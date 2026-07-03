#!/usr/bin/env node
/**
 * build-motion-from-cache.mjs
 *
 * Derives motion-chains.json + motion-diffs.json + motion-state-poses.json from cached Figma animation
 * variant states. Zero MCP — reads nodes/*.json + ui-registry.json.
 *
 * Usage:
 *   node scripts/build-motion-from-cache.mjs <feature-id> [--emit-motion-spec]
 *   npm run build:motion-from-cache -- LP-001
 *
 * Exit codes:
 *   0 — artifacts written
 *   1 — chain walk incomplete or build error
 *   2 — usage error
 */

import { writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sliceRootId } from './figma-extract-lib.mjs';
import {
  isAnimationSliceEntry,
  loadJson,
  loadCachedNode,
  walkPrimaryChain,
  classifyPattern,
  baseStyleForAnimation,
  indexLayersByName,
  diffLayerPose,
  loadSpacingPxIndex,
  buildRegistryFigmaIndex,
  resolveMotionHelper,
  collectDiffLayerNames,
  buildStatePoses,
  referencePngName,
  mapDurationToken,
  mapEasingToken,
  applyMotionInferredOverlays,
} from './motion-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const featureId = process.argv[2];
const emitMotionSpec = process.argv.includes('--emit-motion-spec');

if (!featureId || featureId.startsWith('--')) {
  console.error('Usage: npm run build:motion-from-cache -- <feature-id>');
  process.exit(2);
}

const figmaDir = join(REPO_ROOT, 'features', featureId, 'figma');
const nodesDir = join(figmaDir, 'nodes');
const sliceRootsPath = join(figmaDir, 'slice-roots.json');
const registryPath = join(REPO_ROOT, 'tokens', 'ui-registry.json');
const chainsPath = join(figmaDir, 'motion-chains.json');
const diffsPath = join(figmaDir, 'motion-diffs.json');
const posesPath = join(figmaDir, 'motion-state-poses.json');

if (!existsSync(sliceRootsPath) || !existsSync(nodesDir)) {
  console.error('ERROR: run figma-extract first (slice-roots.json + nodes/).');
  process.exit(1);
}

const sliceRoots = loadJson(sliceRootsPath);
const animationTwins = (sliceRoots.sliceRoots ?? []).filter((entry) =>
  isAnimationSliceEntry(entry),
);

const registry = existsSync(registryPath) ? loadJson(registryPath) : {};
const registryIndex = buildRegistryFigmaIndex(registry.component ?? registry);
const pxToToken = loadSpacingPxIndex(REPO_ROOT);

function findStaticTwin(animationName, sliceRootsList) {
  const normalized = animationName
    .toLowerCase()
    .replace(/animation/gi, '')
    .replace(/animaiton/gi, '')
    .replace(/section/gi, '')
    .trim();

  const candidates = sliceRootsList.filter((e) => {
    if (isAnimationSliceEntry(e)) return false;
    const staticName = (e.name ?? '').toLowerCase();
    return (
      staticName.includes(normalized) ||
      normalized.includes(staticName.replace(/section|mobile|new/gi, '').trim())
    );
  });
  return candidates[0] ? { name: candidates[0].name, nodeId: sliceRootId(candidates[0]) } : null;
}

function collectGifRefs(raw, acc = []) {
  if (!raw) return acc;
  if (Array.isArray(raw.children)) {
    for (const child of raw.children) collectGifRefs(child, acc);
  }
  for (const fill of raw.fills ?? []) {
    if (fill.gifRef) {
      acc.push({
        nodeId: raw.id,
        nodeName: raw.name,
        gifRef: fill.gifRef,
        width: raw.size?.x ?? raw.absoluteBoundingBox?.width,
        height: raw.size?.y ?? raw.absoluteBoundingBox?.height,
      });
    }
  }
  return acc;
}

function toComponentTestId(registryPath) {
  if (!registryPath) return null;
  const path = registryPath.startsWith('component.') ? registryPath : `component.${registryPath}`;
  return path;
}

const chains = [];
const diffs = [];
const poseChains = [];
const ambientSeen = new Set();

for (const entry of animationTwins) {
  const animationNodeId = sliceRootId(entry);
  const name = entry.name ?? animationNodeId;
  const chainResult = walkPrimaryChain(animationNodeId, nodesDir);

  if (chainResult.status !== 'closed') {
    console.warn(
      `WARN: skipping diffs for ${name} — chain incomplete (missing: ${chainResult.missingNodeIds.join(', ')})`,
    );
    if (chainResult.error) console.warn(`      ${chainResult.error}`);

    chains.push({
      name,
      subgraphId: 'primary',
      staticTwin: findStaticTwin(name, sliceRoots.sliceRoots ?? []) ?? { name: null, nodeId: null },
      animationNodeId,
      status: 'incomplete',
      kind: 'interactive',
      pattern: 'custom',
      runner: 'useOneWayMotion',
      baseStyle: baseStyleForAnimation(name),
      error: chainResult.error,
      missingNodeIds: chainResult.missingNodeIds,
      states: chainResult.states.map((s) => ({
        ...s,
        referencePng: referencePngName(name, s.index),
      })),
      transitions: chainResult.transitions,
    });
    continue;
  }

  const { pattern, runner } = classifyPattern(chainResult.transitions, name);
  const staticTwin = findStaticTwin(name, sliceRoots.sliceRoots ?? []);

  const states = chainResult.states.map((s) => ({
    ...s,
    referencePng: referencePngName(name, s.index),
  }));

  const triggerTransition = chainResult.transitions[0];
  const motionRootPath = registryIndex.get(animationNodeId);
  const triggerTestId = toComponentTestId(motionRootPath);

  chains.push({
    name,
    subgraphId: 'primary',
    staticTwin: staticTwin ?? { name: null, nodeId: null },
    animationNodeId,
    status: 'closed',
    kind: 'interactive',
    pattern,
    runner,
    baseStyle: baseStyleForAnimation(name),
    trigger: {
      event: 'onMouseEnter',
      targetTestId: triggerTestId,
      targetNodeId: triggerTransition?.triggerNodeId ?? animationNodeId,
    },
    states,
    transitions: chainResult.transitions,
  });

  for (let i = 0; i < chainResult.transitions.length; i++) {
    const t = chainResult.transitions[i];
    const cachedA = loadCachedNode(nodesDir, t.from);
    const cachedB = loadCachedNode(nodesDir, t.to);
    if (!cachedA || !cachedB) continue;

    const layersA = indexLayersByName(cachedA.raw);
    const layersB = indexLayersByName(cachedB.raw);
    const layerDiffs = [];

    for (const [layerName, nodeB] of layersB) {
      const nodeA = layersA.get(layerName);
      if (!nodeA) continue;
      const changes = diffLayerPose(nodeA, nodeB, pxToToken);
      if (!changes) continue;

      const regPath = registryIndex.get(nodeB.id) ?? registryIndex.get(nodeA.id) ?? null;

      layerDiffs.push({
        name: layerName,
        nodeIdA: nodeA.id,
        nodeIdB: nodeB.id,
        testId: toComponentTestId(regPath),
        stepIndex: i,
        changes,
        helper: resolveMotionHelper(runner, layerName, changes),
      });
    }

    if (layerDiffs.length) {
      diffs.push({
        chain: name,
        subgraphId: 'primary',
        from: t.from,
        to: t.to,
        trigger: t.trigger,
        durationToken: t.durationToken ?? mapDurationToken(t.durationMs),
        easingToken: t.easingToken ?? mapEasingToken(t.easing),
        layers: layerDiffs,
      });
    }
  }

  const layerNames = collectDiffLayerNames(diffs, name);
  const statePoses = buildStatePoses(chainResult, nodesDir, layerNames, registryIndex);
  const terminalStateIndex = statePoses.length ? statePoses[statePoses.length - 1].index : null;

  poseChains.push({
    name,
    subgraphId: 'primary',
    staticTwin: staticTwin ?? { name: null, nodeId: null },
    initialRender: staticTwin?.nodeId ? 'staticTwin' : 'animationState1',
    terminalStateIndex,
    states: statePoses,
  });
}

const inferredApplied = applyMotionInferredOverlays({ figmaDir, chains, diffs, poseChains });
if (inferredApplied.length) {
  console.log(`Applied inferred overlays: ${inferredApplied.join(', ')}`);
}

const ambientMotion = [];
for (const file of readdirSync(nodesDir).filter((f) => f.endsWith('.json'))) {
  const payload = loadJson(join(nodesDir, file));
  for (const gif of collectGifRefs(payload.raw)) {
    const key = `${gif.nodeId}:${gif.gifRef}`;
    if (ambientSeen.has(key)) continue;
    ambientSeen.add(key);
    ambientMotion.push({
      nodeId: gif.nodeId,
      gifRef: gif.gifRef,
      width: gif.width,
      height: gif.height,
    });
  }
}

const motionChains = {
  $meta: {
    feature: featureId,
    generatedAt: new Date().toISOString(),
    source: 'build-motion-from-cache',
  },
  globalRules: {
    oneWay: true,
    defaultTransition: 'SMART_ANIMATE',
    interactionPolicy: 'ignore',
  },
  chains,
  ambientMotion,
};

const motionDiffs = {
  $meta: {
    feature: featureId,
    generatedAt: new Date().toISOString(),
    source: 'build-motion-from-cache',
  },
  diffs,
};

const motionStatePoses = {
  $meta: {
    feature: featureId,
    generatedAt: new Date().toISOString(),
    source: 'build-motion-from-cache',
  },
  chains: poseChains,
};

writeFileSync(chainsPath, JSON.stringify(motionChains, null, 2));
writeFileSync(diffsPath, JSON.stringify(motionDiffs, null, 2));
writeFileSync(posesPath, JSON.stringify(motionStatePoses, null, 2));

console.log(`Wrote ${chainsPath} (${chains.length} chains)`);
console.log(`Wrote ${diffsPath} (${diffs.length} transitions with layer diffs)`);
console.log(`Wrote ${posesPath} (${poseChains.length} chains with state poses)`);
console.log(`Ambient gifRef layers: ${ambientMotion.length}`);

const incompleteCount = chains.filter((c) => c.status !== 'closed').length;
if (incompleteCount) {
  console.warn(`\n${incompleteCount} chain(s) incomplete — run figma:motion-chain-walk + refresh-node`);
}

if (emitMotionSpec) {
  const specPath = join(REPO_ROOT, 'tokens', 'MOTION-SPEC.md');
  const lines = [
    '# Motion catalog (generated)',
    '',
    `> Generated from motion-chains.json for ${featureId} on ${motionChains.$meta.generatedAt}.`,
    '',
  ];
  for (const chain of chains) {
    lines.push(`## ${chain.name}`);
    lines.push(`Pattern: \`${chain.pattern}\` · Runner: \`${chain.runner}\``);
    lines.push('');
    for (const t of chain.transitions) {
      const delay =
        t.delayMs > 0 ? ` after ${t.delayToken ?? `${t.delayMs}ms`}` : '';
      lines.push(
        `- \`${t.from}\` → \`${t.to}\` (${t.trigger}${delay}, ${t.durationToken ?? `${t.durationMs}ms`})`,
      );
    }
    lines.push('');
  }
  writeFileSync(specPath, lines.join('\n'));
  console.log(`Wrote ${specPath} (optional mirror)`);
}

process.exit(0);
