#!/usr/bin/env node
/**
 * validate-assets.mjs
 *
 * Verifies that every Figma visual asset listed in a feature's
 * `asset-manifest.json` has been downloaded to disk and is non-empty.
 *
 * This is the last line of defence against placeholder images, missing icons,
 * and silently-omitted brand logos. It runs at two checkpoints:
 *
 *   1. figma-extract  — immediately after all assets are downloaded (step 4)
 *   2. governance-gate — Checkpoint 0c, before any other gate checks
 *
 * WHY THIS MATTERS
 * ────────────────
 * `validate:figma-coverage` checks that spec.json names appear in contract.md.
 * It does NOT check that the actual files are on disk. A component can pass
 * figma-coverage with a non-existent src="/icons/brand-google.svg" and the
 * gate will still pass. This script closes that gap.
 *
 * ASSET-MANIFEST FORMAT  (features/<id>/figma/asset-manifest.json)
 * ────────────────────────────────────────────────────────────────
 * {
 *   "$meta": {
 *     "feature": "F-001a.2",
 *     "frame": "305:2004",
 *     "generatedAt": "2026-06-15"
 *   },
 *   "assets": [
 *     {
 *       "nodeId":    "389:2810",
 *       "nodeName":  "Brand Logos / Google",
 *       "figmaUrl":  "http://localhost:3845/assets/abc123.svg",
 *       "localPath": "public/icons/brand-google.svg",
 *       "type":      "svg",
 *       "dataSource": "static"
 *     },
 *     {
 *       "nodeId":    "I399:4213;305:2857",
 *       "nodeName":  "Related Product / Image",
 *       "figmaUrl":  "http://localhost:3845/assets/def456.png",
 *       "localPath": "public/images/related-bose-earbuds.png",
 *       "type":      "png",
 *       "dataSource": "static"
 *     }
 *   ]
 * }
 *
 * dataSource values:
 *   "static"  — always renders this exact asset; must exist in public/
 *   "dynamic" — asset comes from a database/API at runtime; Figma value is
 *               an example only. This script SKIPS dynamic assets because
 *               their src values are populated at runtime, not at build time.
 *               They are still listed in the manifest so the contract knows
 *               what kind of content to expect.
 *
 * Usage:
 *   node scripts/validate-assets.mjs <feature-id>
 *   npm run validate:assets -- <feature-id>
 *
 * Exit codes:
 *   0  — all static assets present on disk and non-empty
 *   1  — one or more static assets missing or empty
 *   2  — usage error or asset-manifest.json not found
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { resolve } from 'path';

// ── Args ──────────────────────────────────────────────────────────────────────

const featureId = process.argv[2];
if (!featureId) {
  console.error('Usage: node scripts/validate-assets.mjs <feature-id>');
  process.exit(2);
}

const root = resolve(process.cwd());
const manifestPath = resolve(root, `features/${featureId}/figma/asset-manifest.json`);

if (!existsSync(manifestPath)) {
  console.error(`ERROR: asset-manifest.json not found: ${manifestPath}`);
  console.error('');
  console.error('figma-extract must write an asset-manifest.json listing every');
  console.error('visual asset (icon, image, badge, logo) found in the Figma frame.');
  console.error('');
  console.error('Create the manifest now:');
  console.error(`  features/${featureId}/figma/asset-manifest.json`);
  console.error('');
  console.error('Required shape:');
  console.error('  { "$meta": { "feature": "<id>", ... }, "assets": [ ... ] }');
  console.error('');
  console.error('Each asset entry:');
  console.error('  { "nodeId", "nodeName", "figmaUrl", "localPath", "type", "dataSource" }');
  console.error('');
  console.error('dataSource values: "static" | "dynamic"');
  console.error('  static  = file must exist in public/ (downloaded from Figma)');
  console.error('  dynamic = file comes from DB/API at runtime; skipped by this check');
  process.exit(2);
}

// ── Parse manifest ────────────────────────────────────────────────────────────

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
} catch (err) {
  console.error(`ERROR: Could not parse asset-manifest.json: ${err.message}`);
  process.exit(2);
}

const assets = manifest.assets ?? [];
if (assets.length === 0) {
  console.log(`✓ validate:assets — ${featureId}`);
  console.log(`  No assets listed in asset-manifest.json (empty feature or no visual assets).`);
  process.exit(0);
}

// ── Check each static asset ───────────────────────────────────────────────────

const MIN_BYTES = 50; // anything smaller is almost certainly an empty/placeholder file

const missing  = [];
const empty    = [];
const skipped  = [];
const ok       = [];

for (const asset of assets) {
  if (asset.dataSource === 'dynamic') {
    skipped.push(asset);
    continue;
  }

  if (!asset.localPath) {
    missing.push({ ...asset, reason: 'localPath field is missing from manifest entry' });
    continue;
  }

  const absPath = resolve(root, asset.localPath);

  if (!existsSync(absPath)) {
    missing.push({ ...asset, reason: `file not found at ${asset.localPath}` });
    continue;
  }

  const size = statSync(absPath).size;
  if (size < MIN_BYTES) {
    empty.push({ ...asset, size, reason: `file is only ${size} bytes — likely an empty placeholder` });
    continue;
  }

  ok.push(asset);
}

// ── Report ────────────────────────────────────────────────────────────────────

const pass = missing.length === 0 && empty.length === 0;

if (pass) {
  console.log(`✓ validate:assets — ${featureId}`);
  console.log(`  ${ok.length} static asset(s) present and non-empty.`);
  if (skipped.length > 0) {
    console.log(`  ${skipped.length} dynamic asset(s) skipped (runtime data — not expected in public/).`);
  }
  console.log('');
  process.exit(0);
}

// ── Failure report ────────────────────────────────────────────────────────────

console.error(`✗ validate:assets — ${featureId}\n`);

if (missing.length > 0) {
  console.error(`MISSING ASSETS (${missing.length}) — file does not exist on disk:\n`);
  for (const a of missing) {
    console.error(`  NODE:      ${a.nodeId ?? 'unknown'}  "${a.nodeName ?? 'unknown'}"`);
    console.error(`  FIGMA URL: ${a.figmaUrl ?? 'unknown'}`);
    console.error(`  EXPECTED:  ${a.localPath}`);
    console.error(`  REASON:    ${a.reason}`);
    console.error('');
  }
  console.error('  HOW TO FIX: Download the file from the Figma MCP:');
  console.error('    curl -s "<figmaUrl>" -o "<localPath>"');
  console.error('  Then re-run: npm run validate:assets -- ' + featureId);
  console.error('');
}

if (empty.length > 0) {
  console.error(`EMPTY/PLACEHOLDER ASSETS (${empty.length}) — file exists but is too small to be real:\n`);
  for (const a of empty) {
    console.error(`  NODE:     ${a.nodeId ?? 'unknown'}  "${a.nodeName ?? 'unknown'}"`);
    console.error(`  PATH:     ${a.localPath}  (${a.size} bytes)`);
    console.error(`  REASON:   ${a.reason}`);
    console.error('');
  }
  console.error('  HOW TO FIX: The Figma MCP returned an empty file for this asset.');
  console.error('  Common causes:');
  console.error('    • The node is in an inaccessible shared library');
  console.error('    • The Figma MCP server is not running (check localhost:3845)');
  console.error('    • The asset is a pure CSS shape with no raster export');
  console.error('  For SVG icons that download empty, hand-author the SVG path from');
  console.error('  the Figma inspector and save it to the expected localPath.');
  console.error('  For PNGs, re-export via Figma REST API at 2x scale.');
  console.error('');
}

const totalFailed = missing.length + empty.length;
console.error(`${totalFailed} asset(s) failed. Fix all failures, then re-run:`);
console.error(`  npm run validate:assets -- ${featureId}`);
console.error('');

process.exit(1);
