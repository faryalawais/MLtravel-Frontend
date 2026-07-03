#!/usr/bin/env node
/**
 * export-motion-state-pngs.mjs
 *
 * Export reference-<chain>-animation-state-N.png for every state in motion-chains.json
 * via Figma REST /v1/images. Variant component states may return null — logged as skip.
 *
 * Usage:
 *   npm run figma:export-motion-states -- LP-001
 *   npm run figma:export-motion-states -- LP-001 --chain hero-animation
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeId, resolveFileKey } from './figma-extract-lib.mjs';
import { loadJson } from './motion-lib.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const REST = 'https://api.figma.com/v1';

const featureId = process.argv[2];
const chainFilter = process.argv.includes('--chain')
  ? process.argv[process.argv.indexOf('--chain') + 1]
  : null;
const scale = Number(process.argv.find((a, i) => process.argv[i - 1] === '--scale') ?? 2);

if (!featureId || featureId.startsWith('--')) {
  console.error('Usage: npm run figma:export-motion-states -- <feature-id> [--chain <name>]');
  process.exit(2);
}

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
if (!TOKEN) {
  console.error('ERROR: FIGMA_ACCESS_TOKEN is not set.');
  process.exit(2);
}

const figmaDir = join(REPO_ROOT, 'features', featureId, 'figma');
const chainsPath = join(figmaDir, 'motion-chains.json');
if (!existsSync(chainsPath)) {
  console.error('ERROR: motion-chains.json missing — run build:motion-from-cache first.');
  process.exit(2);
}

const fileKey = resolveFileKey({ repoRoot: REPO_ROOT, featureId });
if (!fileKey) {
  console.error('ERROR: could not resolve Figma file key.');
  process.exit(2);
}

const chainsDoc = loadJson(chainsPath);
const headers = { 'X-Figma-Token': TOKEN };
let exported = 0;
let skipped = 0;
const report = [];

async function fetchImageUrls(ids) {
  const q = new URLSearchParams({ ids: ids.join(','), format: 'png', scale: String(scale) });
  const res = await fetch(`${REST}/images/${fileKey}?${q}`, { headers });
  if (!res.ok) {
    console.warn(`WARN: /v1/images ${res.status}`);
    return {};
  }
  const json = await res.json();
  return json.images ?? {};
}

async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) return false;
  writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
  return true;
}

for (const chain of chainsDoc.chains ?? []) {
  if (chainFilter && chain.name !== chainFilter) continue;

  const states = chain.states ?? [];
  if (!states.length) continue;

  console.log(`\n${chain.name} (${chain.status}) — ${states.length} state(s)`);

  const batch = states.map((s) => ({ ...s, id: normalizeId(s.nodeId) }));
  const urlMap = await fetchImageUrls(batch.map((s) => s.id));

  for (const state of batch) {
    const outName = state.referencePng;
    if (!outName) {
      skipped++;
      continue;
    }
    const outPath = join(figmaDir, outName);
    if (existsSync(outPath)) {
      console.log(`  · ${outName} — exists, skip`);
      report.push({ chain: chain.name, state: state.index, file: outName, status: 'exists' });
      continue;
    }

    const url = urlMap[state.id] ?? urlMap[state.id.replace(':', '-')];
    if (!url) {
      console.warn(`  ✗ state ${state.index} (${state.nodeId}) — REST null (variant node?)`);
      skipped++;
      report.push({
        chain: chain.name,
        state: state.index,
        nodeId: state.nodeId,
        file: outName,
        status: 'rest-null',
      });
      continue;
    }

    mkdirSync(figmaDir, { recursive: true });
    const ok = await download(url, outPath);
    if (ok) {
      const kb = (statSync(outPath).size / 1024).toFixed(1);
      console.log(`  ✓ state ${state.index} (${state.nodeId}) → ${outName} (${kb} KB)`);
      exported++;
      report.push({ chain: chain.name, state: state.index, file: outName, status: 'exported' });
    } else {
      skipped++;
      report.push({ chain: chain.name, state: state.index, file: outName, status: 'download-failed' });
    }
  }
}

const reportPath = join(figmaDir, 'motion-state-export-report.json');
writeFileSync(
  reportPath,
  JSON.stringify(
    {
      $meta: {
        feature: featureId,
        generatedAt: new Date().toISOString(),
        source: 'export-motion-state-pngs',
      },
      exported,
      skipped,
      entries: report,
    },
    null,
    2,
  ),
);

console.log(`\nWrote ${reportPath}`);
console.log(`Done: ${exported} exported, ${skipped} skipped`);
process.exit(exported > 0 || skipped === 0 ? 0 : 1);
