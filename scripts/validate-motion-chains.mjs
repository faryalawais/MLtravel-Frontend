#!/usr/bin/env node
/**
 * validate-motion-chains.mjs
 *
 * Gate for motion extract completeness before design-contract / fe-implement.
 *
 * Usage:
 *   node scripts/validate-motion-chains.mjs <feature-id>
 *   npm run validate:motion-chains -- LP-001
 *
 * Exit codes:
 *   0 — all checks pass (or no animation twins)
 *   1 — validation failures
 *   2 — usage error
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { cacheStem, normalizeId, sliceRootId } from './figma-extract-lib.mjs';
import { isAnimationSliceEntry, loadJson } from './motion-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const featureId = process.argv[2];
const chainFilter = process.argv.includes('--chain')
  ? process.argv[process.argv.indexOf('--chain') + 1]
  : null;

if (!featureId || featureId.startsWith('--')) {
  console.error('Usage: npm run validate:motion-chains -- <feature-id>');
  process.exit(2);
}

const figmaDir = join(REPO_ROOT, 'features', featureId, 'figma');
const sliceRootsPath = join(figmaDir, 'slice-roots.json');
const chainsPath = join(figmaDir, 'motion-chains.json');
const diffsPath = join(figmaDir, 'motion-diffs.json');
const posesPath = join(figmaDir, 'motion-state-poses.json');
const nodesDir = join(figmaDir, 'nodes');
const registryPath = join(REPO_ROOT, 'tokens', 'ui-registry.json');
const manifestPath = join(figmaDir, 'asset-manifest.json');

if (!existsSync(sliceRootsPath)) {
  console.error(`ERROR: slice-roots.json not found`);
  process.exit(2);
}

const sliceRoots = loadJson(sliceRootsPath);
const animationTwins = (sliceRoots.sliceRoots ?? []).filter((e) =>
  isAnimationSliceEntry(e),
);

if (!animationTwins.length) {
  console.log(`validate:motion-chains — ${featureId}: no animation twins, skip.`);
  process.exit(0);
}

const errors = [];
const warnings = [];

if (!existsSync(chainsPath)) {
  errors.push('motion-chains.json missing — run build:motion-from-cache');
}
if (!existsSync(diffsPath)) {
  errors.push('motion-diffs.json missing — run build:motion-from-cache');
}
if (!existsSync(posesPath)) {
  errors.push('motion-state-poses.json missing — run build:motion-from-cache');
}

if (errors.length) {
  for (const e of errors) console.error(`FAIL: ${e}`);
  process.exit(1);
}

const chainsDoc = loadJson(chainsPath);
const diffsDoc = loadJson(diffsPath);

const registryPaths = new Set();
if (existsSync(registryPath)) {
  const reg = loadJson(registryPath);
  (function walk(node, prefix = []) {
    if (!node || typeof node !== 'object') return;
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue;
      const path = [...prefix, k];
      if (v && typeof v === 'object' && v.$figmaNode) {
        registryPaths.add(path.join('.'));
      }
      walk(v, path);
    }
  })(reg.component ?? reg);
}

function registryHasTestId(testId) {
  if (!testId) return false;
  const stripped = testId.replace(/^component\./, '');
  return registryPaths.has(stripped) || registryPaths.has(testId);
}

for (const twin of animationTwins) {
  const name = twin.name;
  if (chainFilter && name !== chainFilter) continue;
  const chain = (chainsDoc.chains ?? []).find((c) => c.name === name);
  if (!chain) {
    errors.push(`no motion-chains entry for animation twin "${name}"`);
    continue;
  }
  if (chain.status !== 'closed') {
    errors.push(`chain "${name}" status is "${chain.status}" — expected closed`);
  }
  for (const state of chain.states ?? []) {
    const stem = cacheStem(normalizeId(state.nodeId));
    if (!existsSync(join(nodesDir, `${stem}.json`))) {
      errors.push(`missing cached node for state ${state.index} (${state.nodeId}) in "${name}"`);
    }
  }
  for (const t of chain.transitions ?? []) {
    if (t.durationMs != null && !t.durationToken && !t.customApproved) {
      errors.push(
        `transition ${t.from}→${t.to} in "${name}" has unmapped duration ${t.durationMs}ms`,
      );
    }
    if (t.easing && !t.easingToken && !t.customApproved) {
      errors.push(`transition ${t.from}→${t.to} in "${name}" has unmapped easing ${t.easing}`);
    }
  }
}

for (const diff of diffsDoc.diffs ?? []) {
  for (const layer of diff.layers ?? []) {
    for (const [key, val] of Object.entries(layer.changes ?? {})) {
      if (key === 'translateY' && val.fromPx != null && !val.token && !val.custom) {
        errors.push(
          `diff layer "${layer.name}" translateY ${val.fromPx}→${val.toPx}px has no spacing token`,
        );
      }
      if (key === 'translateY' && val.custom) {
        warnings.push(
          `diff layer "${layer.name}" translateY ${val.fromPx}→${val.toPx}px marked custom (no spacing token)`,
        );
      }
    }
    if (layer.testId && !registryHasTestId(layer.testId)) {
      warnings.push(`diff layer "${layer.name}" testId not in registry: ${layer.testId}`);
    }
  }
}

const manifestAssets = new Map();
if (existsSync(manifestPath)) {
  for (const a of loadJson(manifestPath).assets ?? []) {
    if (a.gifRef) manifestAssets.set(a.gifRef, a.localPath);
  }
}

for (const ambient of chainsDoc.ambientMotion ?? []) {
  if (ambient.gifRef && ambient.localPath && !existsSync(join(REPO_ROOT, ambient.localPath))) {
    errors.push(`ambient gif missing on disk: ${ambient.localPath}`);
  }
}

console.log(`validate:motion-chains — ${featureId}`);
console.log(`  chains: ${(chainsDoc.chains ?? []).length}`);
console.log(`  diffs: ${(diffsDoc.diffs ?? []).length} transitions`);
console.log(`  ambient: ${(chainsDoc.ambientMotion ?? []).length}`);

for (const w of warnings) console.warn(`WARN: ${w}`);
for (const e of errors) console.error(`FAIL: ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s)`);
  process.exit(1);
}

console.log('\nPASS');
process.exit(0);
