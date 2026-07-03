#!/usr/bin/env node
/**
 * motion-chain-walk.mjs
 *
 * Discovers animation prototype chains from cached Figma nodes and reports
 * missing variant states that must be refreshed before build:motion-from-cache.
 *
 * Usage:
 *   node scripts/motion-chain-walk.mjs <feature-id>
 *   npm run figma:motion-chain-walk -- --feature LP-001
 *
 * Writes: features/<id>/figma/chain-walk-report.json
 *
 * Exit codes:
 *   0 — all animation chains closed (every destinationId cached)
 *   1 — one or more chains incomplete
 *   2 — usage error
 */

import { writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sliceRootId } from './figma-extract-lib.mjs';
import {
  isAnimationSliceEntry,
  loadJson,
  walkPrimaryChain,
  referencePngName,
  loadInferredOverlays,
} from './motion-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

function parseArgs(argv) {
  let featureId = null;
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--feature' && argv[i + 1]) {
      featureId = argv[++i];
    } else if (!argv[i].startsWith('--') && !featureId) {
      featureId = argv[i];
    }
  }
  return featureId;
}

const featureId = parseArgs(process.argv);
if (!featureId) {
  console.error('Usage: npm run figma:motion-chain-walk -- --feature <feature-id>');
  process.exit(2);
}

const figmaDir = join(REPO_ROOT, 'features', featureId, 'figma');
const sliceRootsPath = join(figmaDir, 'slice-roots.json');
const nodesDir = join(figmaDir, 'nodes');
const reportPath = join(figmaDir, 'chain-walk-report.json');

if (!existsSync(sliceRootsPath)) {
  console.error(`ERROR: slice-roots.json not found: ${sliceRootsPath}`);
  process.exit(2);
}

if (!existsSync(nodesDir)) {
  console.error(`ERROR: nodes/ cache not found: ${nodesDir}`);
  process.exit(2);
}

const sliceRoots = loadJson(sliceRootsPath);
const overlayByName = new Map(
  loadInferredOverlays(figmaDir).map((o) => [o.chainName ?? o.chain?.name, o]),
);
const animationTwins = (sliceRoots.sliceRoots ?? []).filter((entry) =>
  isAnimationSliceEntry(entry),
);

if (!animationTwins.length) {
  console.log(`No *-animation slice-roots in ${featureId} — nothing to walk.`);
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        $meta: { feature: featureId, generatedAt: new Date().toISOString() },
        twins: [],
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const twins = [];
let allClosed = true;

for (const entry of animationTwins) {
  const nodeId = sliceRootId(entry);
  const name = entry.name ?? nodeId;
  let chain = walkPrimaryChain(nodeId, nodesDir);
  const overlay = overlayByName.get(name);
  if (chain.status !== 'closed' && overlay?.chain) {
    chain = {
      ...chain,
      status: 'closed',
      states: overlay.chain.states,
      transitions: overlay.chain.transitions,
      missingNodeIds: [],
      error: undefined,
      inferred: true,
    };
  }

  const states = chain.states.map((s) => ({
    ...s,
    referencePng: referencePngName(name, s.index),
  }));

  if (chain.status !== 'closed') allClosed = false;

  twins.push({
    name,
    sliceRoot: nodeId,
    status: chain.status,
    stateCount: states.length,
    cachedCount: states.filter((s) => !chain.missingNodeIds.includes(s.nodeId)).length,
    missingNodeIds: chain.missingNodeIds,
    error: chain.error,
    states,
    transitions: chain.transitions,
  });

  const icon = chain.status === 'closed' ? '✓' : '✗';
  console.log(
    `${icon} ${name} (${nodeId}) — ${chain.status} — ${states.length} states, missing: [${chain.missingNodeIds.join(', ')}]`,
  );
  if (chain.error) console.log(`    ${chain.error}`);
}

const report = {
  $meta: {
    feature: featureId,
    generatedAt: new Date().toISOString(),
    source: 'motion-chain-walk',
  },
  twins,
};

writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\nWrote ${reportPath}`);

if (!allClosed) {
  console.error(
    '\nCHAIN INCOMPLETE — refresh missing nodes:\n' +
      twins
        .flatMap((t) =>
          t.missingNodeIds.map(
            (id) => `  npm run figma:refresh-node -- --feature ${featureId} --refresh-node ${id}`,
          ),
        )
        .join('\n'),
  );
  process.exit(1);
}

console.log('\nAll animation chains closed.');
process.exit(0);
