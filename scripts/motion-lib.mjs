/**
 * motion-lib.mjs — shared offline helpers for the motion extract pipeline.
 * Imported by motion-chain-walk, build-motion-from-cache, validate-motion-chains.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { cacheStem, normalizeId } from './figma-extract-lib.mjs';

/** Slice-root names that reference Figma animation prototype frames. */
export function isAnimationSliceName(name) {
  if (!name || typeof name !== 'string') return false;
  const n = name.toLowerCase();
  return n.includes('animation') || n.endsWith('-animaiton');
}

/** True when slice-roots.json entry is an animation prototype frame. */
export function isAnimationSliceEntry(entry) {
  if (!entry || typeof entry !== 'object') return false;
  if (entry.motionTwin === true) return true;
  return isAnimationSliceName(entry.name ?? '');
}

export function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function loadCachedNode(nodesDir, nodeId) {
  const stem = cacheStem(normalizeId(nodeId));
  const path = join(nodesDir, `${stem}.json`);
  if (!existsSync(path)) return null;
  const payload = loadJson(path);
  return { nodeId: normalizeId(nodeId), meta: payload.$meta ?? {}, raw: payload.raw };
}

/** Depth-first walk of a Figma REST node subtree. */
export function walkFigmaTree(node, visit, depth = 0) {
  if (!node || typeof node !== 'object') return;
  visit(node, depth);
  for (const child of node.children ?? []) {
    walkFigmaTree(child, visit, depth + 1);
  }
}

/** Collect every interaction on a node and its descendants. */
export function collectSubtreeInteractions(raw) {
  const out = [];
  walkFigmaTree(raw, (node) => {
    for (const interaction of node.interactions ?? []) {
      out.push({
        triggerNodeId: node.id,
        triggerNodeName: node.name,
        interaction,
      });
    }
  });
  return out;
}

const HOVER_TRIGGERS = new Set(['MOUSE_ENTER', 'ON_HOVER']);

export function normalizeTriggerType(type) {
  if (!type) return 'UNKNOWN';
  if (type === 'ON_HOVER') return 'MOUSE_ENTER';
  return type;
}

/** Parse duration to integer ms (Figma REST uses seconds in transition.duration). */
export function toDurationMs(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  if (n > 0 && n < 10) return Math.round(n * 1000);
  return Math.round(n);
}

export function parseTransitionRecord({ triggerNodeId, triggerNodeName, interaction }) {
  const trigger = interaction.trigger ?? {};
  const action = (interaction.actions ?? []).find((a) => a.type === 'NODE' && a.destinationId);
  if (!action) return null;

  const transition = action.transition ?? {};
  const durationMs =
    toDurationMs(transition.duration) ??
    toDurationMs(interaction.transitionDuration) ??
    null;
  const delayMs = trigger.type === 'AFTER_TIMEOUT' ? toDurationMs(trigger.timeout) : 0;

  return {
    triggerNodeId,
    triggerNodeName,
    trigger: normalizeTriggerType(trigger.type),
    rawTrigger: trigger.type,
    delayMs,
    destinationId: normalizeId(action.destinationId),
    transitionType: transition.type ?? 'SMART_ANIMATE',
    durationMs,
    easing: transition.easing?.type ?? interaction.transitionEasing ?? null,
    navigation: action.navigation,
  };
}

/** Known semantic duration tokens (ms → token path). */
export const DURATION_MS_TO_TOKEN = {
  700: 'motion.duration.default',
  300: 'motion.duration.autoAdvance',
  120: 'motion.duration.stepDelay',
};

export const EASING_TO_TOKEN = {
  EASE_IN: 'motion.easing.default',
  EASE_OUT: 'motion.easing.hero',
};

export function mapDurationToken(ms) {
  if (ms == null) return null;
  return DURATION_MS_TO_TOKEN[ms] ?? null;
}

export function mapEasingToken(easing) {
  if (!easing) return null;
  return EASING_TO_TOKEN[easing] ?? null;
}

/**
 * Walk primary prototype chain from animation slice-root.
 * Follows MOUSE_ENTER/ON_HOVER first edge, then AFTER_TIMEOUT auto-advance chain.
 */
export function walkPrimaryChain(sliceRootId, nodesDir, getNode = (id) => loadCachedNode(nodesDir, id)) {
  const states = [];
  const transitions = [];
  const visited = new Set();
  const missingNodeIds = [];

  let currentId = normalizeId(sliceRootId);
  const start = getNode(currentId);
  if (!start) {
    return {
      states: [],
      transitions: [],
      status: 'incomplete',
      missingNodeIds: [currentId],
      error: 'slice-root not cached',
    };
  }

  const allInteractions = collectSubtreeInteractions(start.raw);
  let entry = allInteractions.find((row) => HOVER_TRIGGERS.has(row.interaction.trigger?.type));

  // Auto-play chains (e.g. SocialProof carousel) start with AFTER_TIMEOUT on mount.
  if (!entry) {
    entry = allInteractions.find((row) => row.interaction.trigger?.type === 'AFTER_TIMEOUT');
  }

  // Fallback: Figma sometimes stores prototype on transitionNodeID without interactions[] (REST gap).
  if (!entry && start.raw.transitionNodeID) {
    entry = {
      triggerNodeId: start.raw.id,
      triggerNodeName: start.raw.name,
      interaction: {
        trigger: { type: 'MOUSE_ENTER', delay: 0 },
        actions: [
          {
            type: 'NODE',
            destinationId: start.raw.transitionNodeID,
            navigation: 'CHANGE_TO',
            transition: {
              type: 'SMART_ANIMATE',
              duration: toDurationMs(start.raw.transitionDuration ?? 700) / 1000,
              easing: { type: start.raw.transitionEasing ?? 'EASE_IN' },
            },
          },
        ],
      },
    };
  }

  if (!entry) {
    states.push({ index: 1, nodeId: currentId, label: 'idle' });
    return {
      states,
      transitions: [],
      status: 'incomplete',
      missingNodeIds: [],
      error: 'no MOUSE_ENTER / ON_HOVER trigger on slice-root subtree',
    };
  }

  states.push({ index: 1, nodeId: currentId, label: 'idle' });

  let nextTransition = parseTransitionRecord(entry);
  while (nextTransition && !visited.has(nextTransition.destinationId)) {
    visited.add(nextTransition.destinationId);
    transitions.push({
      from: currentId,
      to: nextTransition.destinationId,
      trigger: nextTransition.trigger,
      rawTrigger: nextTransition.rawTrigger,
      triggerNodeId: nextTransition.triggerNodeId,
      triggerNodeName: nextTransition.triggerNodeName,
      delayMs: nextTransition.delayMs,
      delayToken: mapDurationToken(nextTransition.delayMs),
      durationMs: nextTransition.durationMs,
      durationToken: mapDurationToken(nextTransition.durationMs),
      easing: nextTransition.easing,
      easingToken: mapEasingToken(nextTransition.easing),
      transitionType: nextTransition.transitionType,
      ...(!mapDurationToken(nextTransition.durationMs) && nextTransition.durationMs != null
        ? { customApproved: true }
        : {}),
      ...(!mapEasingToken(nextTransition.easing) && nextTransition.easing
        ? { customApproved: true }
        : {}),
    });

    currentId = nextTransition.destinationId;
    const cached = getNode(currentId);
    if (!cached) {
      missingNodeIds.push(currentId);
      break;
    }
    states.push({ index: states.length + 1, nodeId: currentId, label: `state-${states.length + 1}` });

    const nodeInteractions = collectSubtreeInteractions(cached.raw);
    const auto = nodeInteractions.find(
      (row) => row.interaction.trigger?.type === 'AFTER_TIMEOUT',
    );
    nextTransition = auto ? parseTransitionRecord(auto) : null;
  }

  const status =
    missingNodeIds.length > 0
      ? 'incomplete'
      : transitions.length === 0
        ? 'incomplete'
        : 'closed';

  return { states, transitions, status, missingNodeIds, error: null };
}

export function classifyPattern(transitions, animationName) {
  if (!transitions.length) return { pattern: 'custom', runner: 'useOneWayMotion' };

  const autoSteps = transitions.filter((t) => t.trigger === 'AFTER_TIMEOUT');
  const name = (animationName ?? '').toLowerCase();

  if (autoSteps.length === 0) {
    return { pattern: 'simple-one-step', runner: 'useOneWayMotion' };
  }

  const delays = autoSteps.map((t) => t.delayMs).filter((d) => d != null);
  const avgDelay = delays.length ? delays.reduce((a, b) => a + b, 0) / delays.length : 0;

  if (autoSteps.length === 3 && avgDelay <= 150) {
    return { pattern: 'rapid-four-step', runner: 'runRapidFourStepMotion' };
  }

  if (autoSteps.length >= 1 && avgDelay >= 200) {
    const runner =
      name.includes('hero') || transitions.some((t) => t.easing === 'EASE_OUT')
        ? 'runHeroMotion'
        : 'runFeatureGridMotion';
    return { pattern: 'staged-sequence', runner };
  }

  return { pattern: 'custom', runner: 'useOneWayMotion', customApproved: false };
}

export function baseStyleForAnimation(name) {
  return (name ?? '').toLowerCase().includes('hero') ? 'HERO_MOTION_STYLE' : 'DEFAULT_MOTION_STYLE';
}

/** Index Figma nodes by layer name (last segment wins on collision). */
export function indexLayersByName(raw) {
  const map = new Map();
  walkFigmaTree(raw, (node) => {
    if (!node.name || !node.id) return;
    map.set(node.name, node);
  });
  return map;
}

export function getTranslateY(relativeTransform) {
  if (!Array.isArray(relativeTransform) || relativeTransform.length < 2) return 0;
  const row = relativeTransform[1];
  return Array.isArray(row) && row.length >= 3 ? row[2] : 0;
}

export function loadSpacingPxIndex(repoRoot) {
  const path = join(repoRoot, 'tokens', 'primitives.json');
  const pxToToken = new Map();
  if (!existsSync(path)) return pxToToken;
  const primitives = loadJson(path);
  for (const [key, entry] of Object.entries(primitives.spacing ?? {})) {
    const px = entry?.$value?.value;
    if (typeof px === 'number') {
      pxToToken.set(px, `spacing.${key}`);
    }
  }
  return pxToToken;
}

export function mapSpacingToken(px, pxToToken) {
  if (px == null) return null;
  const rounded = Math.round(px);
  return pxToToken.get(rounded) ?? null;
}

/** Build figmaNodeId → registry dot-path from ui-registry.json. */
export function buildRegistryFigmaIndex(registry, prefix = []) {
  const index = new Map();
  if (!registry || typeof registry !== 'object') return index;

  for (const [key, value] of Object.entries(registry)) {
    if (key.startsWith('$')) continue;
    const path = [...prefix, key];
    if (value && typeof value === 'object') {
      if (typeof value.$figmaNode === 'string') {
        index.set(normalizeId(value.$figmaNode), path.join('.'));
      }
      const nested = buildRegistryFigmaIndex(value, path);
      for (const [k, v] of nested) index.set(k, v);
    }
  }
  return index;
}

export function inferHelper(changes) {
  const keys = Object.keys(changes);
  if (keys.includes('translateY') && (keys.includes('borderColor') || keys.includes('boxShadow'))) {
    return 'getMotionCascadeCardSurfaceStyle';
  }
  if (keys.includes('opacity') && keys.length === 1) {
    return 'getMotionCascadeTextStyle';
  }
  if (keys.includes('translateY') || keys.includes('opacity')) {
    return 'getMotionSlideRevealStyle';
  }
  if (keys.includes('width') || keys.includes('scaleX')) {
    return 'custom';
  }
  return 'custom';
}

/** Chain-aware helper — staged hero columns use shared-origin helper, not generic slide. */
export function resolveMotionHelper(runner, layerName, changes) {
  if (
    runner === 'runHeroMotion' &&
    (layerName === 'Frame 1561553827' || layerName === 'Frame 1561553830')
  ) {
    return 'getHeroColumnMotionStyle';
  }
  if (layerName === 'ProblemCTA') {
    return 'getProblemCtaMotionStyle';
  }
  if (layerName === 'Frame 2095585108') {
    return 'getComparisonMainGroupMotionStyle';
  }
  if (layerName === 'footer-note') {
    return 'getHiwFooterMotionStyle';
  }
  if (
    layerName === 'FeatureRow1' ||
    layerName === 'FeatureRow2' ||
    layerName === 'FooterBar'
  ) {
    return 'getFeatureGridContentMotionStyle';
  }
  if (layerName === 'FooterNavLink') {
    return 'getFooterNavLinkMotionStyle';
  }
  return inferHelper(changes);
}

/** Collect layer names that appear in motion-diffs for a chain. */
export function collectDiffLayerNames(diffs, chainName) {
  const names = new Set();
  for (const diff of diffs) {
    if (diff.chain !== chainName) continue;
    for (const layer of diff.layers ?? []) {
      if (layer.name) names.add(layer.name);
    }
  }
  return names;
}

/**
 * Per-state absolute poses for layers that move (from cached variant nodes).
 * Used by design-contract, fe-implement, and motion.constants authoring.
 */
export function buildStatePoses(chainResult, nodesDir, layerNames, registryIndex) {
  const states = [];
  for (const state of chainResult.states ?? []) {
    const cached = loadCachedNode(nodesDir, state.nodeId);
    if (!cached?.raw) continue;

    const layersByName = indexLayersByName(cached.raw);
    const layers = {};

    for (const layerName of layerNames) {
      const node = layersByName.get(layerName);
      if (!node) continue;

      const regPath = registryIndex.get(normalizeId(node.id));
      const pose = {
        nodeId: node.id,
        translateYpx: Math.round(getTranslateY(node.relativeTransform)),
        opacity: node.opacity ?? 1,
      };
      if (regPath) {
        pose.testId = regPath.startsWith('component.')
          ? regPath
          : `component.${regPath}`;
      }
      layers[layerName] = pose;
    }

    states.push({
      index: state.index,
      nodeId: state.nodeId,
      label: state.label ?? `state-${state.index}`,
      layers,
    });
  }
  return states;
}

/** Diff two layer poses for Smart Animate style properties. */
export function diffLayerPose(nodeA, nodeB, pxToToken) {
  const changes = {};

  const yA = getTranslateY(nodeA?.relativeTransform);
  const yB = getTranslateY(nodeB?.relativeTransform);
  if (Math.abs(yA - yB) > 0.5) {
    const token = mapSpacingToken(Math.abs(yB - yA), pxToToken);
    changes.translateY = {
      fromPx: Math.round(yA),
      toPx: Math.round(yB),
      token,
      custom: token == null,
    };
  }

  const opA = nodeA?.opacity ?? 1;
  const opB = nodeB?.opacity ?? 1;
  if (Math.abs(opA - opB) > 0.01) {
    changes.opacity = { from: opA, to: opB };
  }

  if (nodeA?.visible === false && nodeB?.visible !== false) {
    changes.appears = true;
  }
  if (nodeA?.visible !== false && nodeB?.visible === false) {
    changes.disappears = true;
  }

  const shadowA = (nodeA?.effects ?? []).some((e) => e.type === 'DROP_SHADOW' && e.visible !== false);
  const shadowB = (nodeB?.effects ?? []).some((e) => e.type === 'DROP_SHADOW' && e.visible !== false);
  if (shadowA !== shadowB && shadowB) {
    changes.boxShadow = { toToken: 'shadow.card' };
  }

  const strokeA = (nodeA?.strokes ?? []).length > 0;
  const strokeB = (nodeB?.strokes ?? []).length > 0;
  if (strokeA !== strokeB && strokeB) {
    changes.borderColor = { toToken: 'color.border.brand-navy' };
  }

  return Object.keys(changes).length ? changes : null;
}

export function slugFromAnimationName(name) {
  return String(name)
    .toLowerCase()
    .replace(/animation/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function referencePngName(animationName, stateIndex) {
  return `reference-${slugFromAnimationName(animationName)}-animation-state-${stateIndex}.png`;
}

/** Load per-feature inferred chain overlays (REST gaps documented in figma/notes.md). */
export function loadInferredOverlays(figmaDir) {
  const path = join(figmaDir, 'motion-inferred-overlays.json');
  if (!existsSync(path)) return [];
  const doc = loadJson(path);
  return doc.overlays ?? [];
}

/**
 * Replace incomplete chains with closed inferred overlays from motion-inferred-overlays.json.
 * Mutates chains, diffs, and poseChains in place.
 */
export function applyMotionInferredOverlays({ figmaDir, chains, diffs, poseChains }) {
  const overlays = loadInferredOverlays(figmaDir);
  const applied = [];

  for (const overlay of overlays) {
    const name = overlay.chainName ?? overlay.chain?.name;
    if (!name || !overlay.chain) continue;

    const chainIdx = chains.findIndex((c) => c.name === name);
    if (chainIdx === -1) continue;

    chains[chainIdx] = overlay.chain;
    applied.push(name);

    const keptDiffs = diffs.filter((d) => d.chain !== name);
    diffs.length = 0;
    diffs.push(...keptDiffs);
    if (overlay.diff) diffs.push(overlay.diff);

    const poseIdx = poseChains.findIndex((p) => p.name === name);
    if (poseIdx !== -1) poseChains.splice(poseIdx, 1);
    if (overlay.poses) poseChains.push(overlay.poses);
  }

  return applied;
}
