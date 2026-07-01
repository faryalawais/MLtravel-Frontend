#!/usr/bin/env node
/**
 * validate-figma-extract.mjs
 *
 * Layer A / D fidelity gate (no MCP) from docs/figma-single-pass-extract-plan.md
 * §8 and §10b. Proves the single-session extraction landed completely on disk so
 * every downstream skill (ui-registry-build, design-contract, fe-implement) can
 * read the cache instead of re-calling Figma.
 *
 * Three checks against features/<id>/figma/:
 *
 *   CHECK 1 — Cache coverage
 *     Every nodeId in component-checklist.md is captured by the on-disk cache:
 *     either a features/<id>/figma/nodes/<nodeId>.json file exists for it, OR the
 *     id appears inside a cached slice-root payload (get_design_context is
 *     recursive, so a slice-root file contains all its leaf data-node-ids), OR a
 *     features/_shared/figma/nodes/<nodeId>.json pointer covers it (shared chrome).
 *
 *   CHECK 2 — Real reference screenshots
 *     At least one reference-<section>.png (or reference.png) exists and every
 *     reference image is a real export, not a placeholder (>= MIN_REFERENCE_BYTES).
 *
 *   CHECK 3 — Freshness stamp consistency (Layer D)
 *     figmaLastModified is consistent across spec.json, layout.json and every
 *     nodes/*.json. A mix of stamps (drift) fails; all-unstamped warns (freshness
 *     checking is simply disabled until the extractor records a file-modified time).
 *
 * Usage:
 *   node scripts/validate-figma-extract.mjs <feature-id>
 *   npm run validate:figma-extract -- <feature-id>
 *
 * Exit codes:
 *   0  — all checks pass
 *   1  — uncovered nodeId(s), placeholder/missing reference, or stamp drift
 *   2  — usage error / component-checklist.md missing
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');

const MIN_REFERENCE_BYTES = 10 * 1024; // a real PNG export is well over 10 KB; a placeholder is tiny.

// ── Args ─────────────────────────────────────────────────────────────────────
const featureId = process.argv[2];
if (!featureId || featureId.startsWith('--')) {
  console.error('Usage: node scripts/validate-figma-extract.mjs <feature-id>');
  process.exit(2);
}

const figmaDir = join(REPO_ROOT, 'features', featureId, 'figma');
const checklistPath = join(figmaDir, 'component-checklist.md');
const specPath = join(figmaDir, 'spec.json');
const layoutPath = join(figmaDir, 'layout.json');
const nodesDir = join(figmaDir, 'nodes');
const sharedNodesDir = join(REPO_ROOT, 'features', '_shared', 'figma', 'nodes');

if (!existsSync(checklistPath)) {
  console.error(`ERROR: component-checklist.md not found: ${checklistPath}`);
  console.error('Run figma-extract (frame mode) for this feature first.');
  process.exit(2);
}

// ── Node-id helpers (mirror figma-extract-lib.mjs, kept local to stay dependency-free) ──
function cacheStem(nodeId) {
  return String(nodeId).replace(/[:;]/g, '-');
}
/** Candidate string forms a nodeId may appear as inside a cached payload. */
function idForms(nodeId) {
  const forms = new Set();
  const id = String(nodeId).trim();
  forms.add(id);
  forms.add(cacheStem(id));
  // Instance ids ("I403:4515;399:4142") — also match the inner/leaf id.
  const trailing = id.includes(';') ? id.slice(id.lastIndexOf(';') + 1) : id;
  forms.add(trailing);
  forms.add(cacheStem(trailing));
  return [...forms].filter((f) => f.length >= 3);
}

// ── Parse component-checklist.md → ordered list of { nodeId, label, shared } ──
const checklistText = readFileSync(checklistPath, 'utf8');
const checklistNodes = [];
{
  const lineRe = /\(nodeId:\s*([^)]+?)\s*\)/g;
  for (const rawLine of checklistText.split('\n')) {
    lineRe.lastIndex = 0;
    let m;
    while ((m = lineRe.exec(rawLine)) !== null) {
      const nodeId = m[1].trim();
      if (!nodeId || /unknown/i.test(nodeId)) continue;
      checklistNodes.push({
        nodeId,
        label: rawLine.replace(/^[#\->\s[\]x]*/, '').trim().slice(0, 80),
        shared: /\(shared\)/i.test(rawLine),
      });
    }
  }
}

if (checklistNodes.length === 0) {
  console.error(`ERROR: no "(nodeId: …)" entries found in ${checklistPath}.`);
  console.error('figma-extract must record a nodeId on every checklist row.');
  process.exit(2);
}

// ── Build the cache index (feature nodes/ + _shared/) ─────────────────────────
function readCacheDir(dir) {
  const ids = new Set();
  let rawBlob = '';
  const stamps = new Set();
  if (!existsSync(dir)) return { ids, rawBlob, stamps, count: 0 };
  const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
  for (const f of files) {
    ids.add(f.replace(/\.json$/, '')); // filename stem (cacheStem form)
    try {
      const payload = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      if (payload?.$meta?.nodeId) {
        ids.add(payload.$meta.nodeId);
        ids.add(cacheStem(payload.$meta.nodeId));
      }
      if (payload?.$meta?.figmaLastModified) stamps.add(payload.$meta.figmaLastModified);
      // The recursive get_design_context payload lists every leaf's data-node-id.
      rawBlob += typeof payload?.raw === 'string' ? payload.raw : JSON.stringify(payload?.raw ?? '');
      rawBlob += '\n';
    } catch {
      /* a malformed cache file still counts by filename; coverage search just skips its blob */
    }
  }
  return { ids, rawBlob, stamps, count: files.length };
}

const featureCache = readCacheDir(nodesDir);
const sharedCache = readCacheDir(sharedNodesDir);

const cachedIds = new Set([...featureCache.ids, ...sharedCache.ids]);
const cachedBlob = featureCache.rawBlob + sharedCache.rawBlob;

function isCovered(nodeId) {
  for (const form of idForms(nodeId)) {
    if (cachedIds.has(form)) return true;
    if (cachedBlob.includes(form)) return true;
  }
  return false;
}

// ── CHECK 1 — cache coverage ──────────────────────────────────────────────────
const uncovered = [];
const seen = new Set();
for (const n of checklistNodes) {
  if (seen.has(n.nodeId)) continue;
  seen.add(n.nodeId);
  if (!isCovered(n.nodeId)) uncovered.push(n);
}
const uniqueChecklist = seen.size;
const check1Pass = uncovered.length === 0;

// ── CHECK 2 — real reference screenshots ──────────────────────────────────────
const referenceFiles = existsSync(figmaDir)
  ? readdirSync(figmaDir).filter((f) => /^reference.*\.png$/i.test(f))
  : [];
const placeholders = [];
for (const f of referenceFiles) {
  const bytes = statSync(join(figmaDir, f)).size;
  if (bytes < MIN_REFERENCE_BYTES) placeholders.push({ file: f, bytes });
}
const check2Pass = referenceFiles.length > 0 && placeholders.length === 0;

// ── CHECK 3 — freshness stamp consistency ─────────────────────────────────────
function stampOf(path, key) {
  if (!existsSync(path)) return undefined;
  try {
    const json = JSON.parse(readFileSync(path, 'utf8'));
    return key === '$meta' ? json?.$meta?.figmaLastModified ?? null : json?.figmaLastModified ?? null;
  } catch {
    return undefined;
  }
}
const stampSources = [
  { name: 'spec.json', value: stampOf(specPath, '$meta') },
  { name: 'layout.json', value: stampOf(layoutPath, 'top') },
];
const distinctStamps = new Set(
  [
    ...stampSources.map((s) => s.value),
    ...featureCache.stamps,
    ...sharedCache.stamps,
  ].filter((v) => v !== null && v !== undefined && v !== '')
);
// Drift = more than one distinct non-null stamp across the artifacts.
const check3Pass = distinctStamps.size <= 1;
const freshnessStamped = distinctStamps.size === 1;

// ── Report ────────────────────────────────────────────────────────────────────
if (check1Pass && check2Pass && check3Pass) {
  console.log(`✓ validate:figma-extract — ${featureId}`);
  console.log(`  CHECK 1: all ${uniqueChecklist} checklist nodeId(s) covered by cache `
    + `(${featureCache.count} feature + ${sharedCache.count} shared node file(s)).`);
  console.log(`  CHECK 2: ${referenceFiles.length} reference image(s), none a placeholder `
    + `(>= ${(MIN_REFERENCE_BYTES / 1024) | 0} KB).`);
  console.log(`  CHECK 3: freshness ${freshnessStamped ? `stamped (${[...distinctStamps][0]})` : 'not stamped (freshness check disabled — see note)'}.`);
  if (!freshnessStamped) {
    console.log('  note:    figmaLastModified is null everywhere — fe-implement cannot detect a stale cache.');
    console.log('           This passes today, but the extractor should stamp it to enable Layer D.');
  }
  console.log('');
  process.exit(0);
}

console.error(`✗ validate:figma-extract — ${featureId}\n`);

if (!check1Pass) {
  console.error(`CHECK 1 FAIL — ${uncovered.length} of ${uniqueChecklist} checklist nodeId(s) not in the cache:`);
  if (featureCache.count === 0 && sharedCache.count === 0) {
    console.error('  No cache files found. The single MCP session has not run yet.');
    console.error(`  Run:  npm run figma:extract -- --feature ${featureId} --frame <frame-node-id>\n`);
  }
  for (const n of uncovered) {
    console.error(`  UNCOVERED ${n.nodeId}${n.shared ? ' (shared)' : ''}  — ${n.label}`);
  }
  console.error('\n  Fix: re-run the extraction, or refresh the missing node(s):');
  console.error(`    npm run figma:refresh-node -- --feature ${featureId} --refresh-node <nodeId>`);
  console.error(`  Shared chrome lives in features/_shared/figma/nodes/ — extract it there once.\n`);
}

if (!check2Pass) {
  if (referenceFiles.length === 0) {
    console.error('CHECK 2 FAIL — no reference-<section>.png found.');
    console.error(`  Run:  npm run figma:export-image -- --feature ${featureId}   (REST screenshots)\n`);
  } else {
    console.error(`CHECK 2 FAIL — ${placeholders.length} placeholder reference image(s) (< ${(MIN_REFERENCE_BYTES / 1024) | 0} KB):`);
    for (const p of placeholders) console.error(`  PLACEHOLDER ${p.file} (${p.bytes} bytes)`);
    console.error('  Re-export via REST — an MCP screenshot-to-disk often writes an empty/tiny file.');
    console.error(`    npm run figma:export-image -- --feature ${featureId}\n`);
  }
}

if (!check3Pass) {
  console.error(`CHECK 3 FAIL — inconsistent figmaLastModified stamps (cache drift): ${[...distinctStamps].join(', ')}`);
  console.error('  spec.json, layout.json and every nodes/*.json must carry the SAME stamp.');
  console.error(`  Re-run:  npm run figma:extract -- --feature ${featureId} --frame <frame-node-id> --force\n`);
}

process.exit(1);
