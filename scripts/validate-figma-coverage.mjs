#!/usr/bin/env node
/**
 * validate-figma-coverage.mjs
 *
 * Two hard checks on features/<id>/figma/spec.json → contract.md §2:
 *
 * CHECK 1 — Named-entity coverage
 *   Every named section/layer/widget/column/banner in spec.json must appear
 *   (at minimum as prose mention) in contract.md §2 anatomy.
 *
 * CHECK 2 — Prose-collapse detection
 *   Any section that collapses its visual sub-elements into a prose `content`
 *   string (instead of writing them as named objects in layers/widgets/columns/
 *   banners) is flagged. These sections are invisible to Check 1 — their actual
 *   sub-components (brand logos, form card, dropdown menus, icon rows, etc.)
 *   can be silently omitted from the contract.
 *
 *   The Newsletter section of F-001a.2 is the canonical example: its sub-elements
 *   (copy block, form card, divider, brand logos row) were never captured in
 *   structured arrays, so the contract and implementation both missed the logos
 *   entirely.
 *
 * Usage:
 *   node scripts/validate-figma-coverage.mjs <feature-id>
 *   npm run validate:figma-coverage -- <feature-id>
 *
 * Exit codes:
 *   0  — both checks pass
 *   1  — one or more entities absent from §2, OR prose-collapsed sections found
 *   2  — usage error, spec.json missing, or contract.md missing §2 heading
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ── Args ─────────────────────────────────────────────────────────────────────

const featureId = process.argv[2];
if (!featureId) {
  console.error('Usage: node scripts/validate-figma-coverage.mjs <feature-id>');
  process.exit(2);
}

const root = resolve(process.cwd());
const specPath     = resolve(root, `features/${featureId}/figma/spec.json`);
const contractPath = resolve(root, `features/${featureId}/contract.md`);

if (!existsSync(specPath)) {
  console.error(`ERROR: spec.json not found: ${specPath}`);
  console.error('Run figma-extract (frame mode) for this feature first.');
  process.exit(2);
}

if (!existsSync(contractPath)) {
  console.log(`INFO: contract.md not found (${contractPath}).`);
  console.log('      validate:figma-coverage will enforce coverage once contract.md is written.');
  process.exit(0);
}

// ── Parse spec.json ──────────────────────────────────────────────────────────

let spec;
try {
  spec = JSON.parse(readFileSync(specPath, 'utf8'));
} catch (err) {
  console.error(`ERROR: Could not parse spec.json: ${err.message}`);
  process.exit(2);
}

// ── CHECK 2 — Prose-collapse detection ───────────────────────────────────────
//
// A section is "prose-collapsed" when it meets ALL of:
//   (a) has a string `content` field — author described sub-elements in prose
//   (b) has NO structured sub-element arrays (layers/widgets/columns/banners)
//   (c) the `content` string contains UI-element keywords suggesting real
//       sub-components exist that were silently collapsed
//   (d) the section is non-trivial height (> 60px) — filters out separator lines
//
// Prose-collapsed sections are a pipeline defect: their real sub-components
// are invisible to Check 1 and to design-contract, so they end up omitted
// from the contract and implementation.

const UI_ELEMENT_KEYWORDS = [
  'dropdown', 'button', 'logo', 'icon', 'badge', 'form', 'input',
  'card', 'grid', 'carousel', 'nav', 'tab', 'modal', 'banner',
  'search', 'menu', 'link', 'accordion', 'sidebar', 'panel',
  'image', 'photo', 'product', 'column', 'row', 'section',
  'social', 'payment', 'app store', 'play store', 'copyright',
  'subscribe', 'newsletter', 'promo', 'cta', 'hero', 'widget',
];

function isProseCollapsed(section) {
  const hasProseContent = typeof section.content === 'string' && section.content.trim().length > 0;
  if (!hasProseContent) return false;

  const hasStructuredChildren =
    (section.layers  ?? []).length > 0 ||
    (section.widgets ?? []).length > 0 ||
    (section.columns ?? []).length > 0 ||
    (section.banners ?? []).length > 0;
  if (hasStructuredChildren) return false; // structured data present — OK

  const height = section.height ?? 0;
  if (height > 0 && height < 60) return false; // trivial height — likely a separator

  const contentLower = section.content.toLowerCase();
  return UI_ELEMENT_KEYWORDS.some(kw => contentLower.includes(kw));
}

const proseCollapsed = (spec.sections ?? []).filter(isProseCollapsed);

// ── CHECK 1 — Named-entity coverage ──────────────────────────────────────────

/**
 * Collect all named entities from structured sub-element arrays.
 * NOTE: prose-collapsed sections contribute only their own name here,
 * not their hidden sub-elements — that is exactly what Check 2 catches.
 */
function collectNamedEntities(spec) {
  const entities = [];
  for (const section of spec.sections ?? []) {
    if (!section.name) continue;
    entities.push({ kind: 'section', name: section.name, parent: null });

    for (const layer of section.layers ?? []) {
      if (layer.name) entities.push({ kind: 'layer',  name: layer.name,  parent: section.name });
    }
    for (const widget of section.widgets ?? []) {
      if (widget.name) entities.push({ kind: 'widget', name: widget.name, parent: section.name });
    }
    for (const col of section.columns ?? []) {
      if (col.name) entities.push({ kind: 'column', name: col.name, parent: section.name });
    }
    for (const banner of section.banners ?? []) {
      if (banner.name) entities.push({ kind: 'banner', name: banner.name, parent: section.name });
    }
  }
  return entities;
}

const entities = collectNamedEntities(spec);

// ── Extract §2 anatomy from contract.md ──────────────────────────────────────

const contractText = readFileSync(contractPath, 'utf8');
const anatomyMatch = contractText.match(/^## 2[.:]?\s+Component anatomy/im);
if (!anatomyMatch) {
  console.error(`ERROR: contract.md does not contain a "## 2. Component anatomy" heading.`);
  process.exit(2);
}

const anatomyStart = anatomyMatch.index;
const afterAnatomy = contractText.slice(anatomyStart + anatomyMatch[0].length);
const nextHeadingMatch = afterAnatomy.match(/^## /m);
const anatomyEnd = nextHeadingMatch
  ? anatomyStart + anatomyMatch[0].length + nextHeadingMatch.index
  : contractText.length;
const anatomyText = contractText.slice(anatomyStart, anatomyEnd).toLowerCase();

function normalise(name) {
  return name.replace(/\s+[—–-].*$/, '').trim().toLowerCase();
}

const missing = [];
for (const entity of entities) {
  const needle = normalise(entity.name);
  if (needle.length < 2) continue;
  if (!anatomyText.includes(needle)) missing.push(entity);
}

// ── Report ────────────────────────────────────────────────────────────────────

const check1Pass = missing.length === 0;
const check2Pass = proseCollapsed.length === 0;

if (check1Pass && check2Pass) {
  console.log(`✓ validate:figma-coverage — ${featureId}`);
  console.log(`  CHECK 1: All ${entities.length} named Figma elements are present in contract.md §2.`);
  console.log(`  CHECK 2: No prose-collapsed sections detected in spec.json.\n`);
  process.exit(0);
}

console.error(`✗ validate:figma-coverage — ${featureId}\n`);

// ── Report Check 2 first (it is the more dangerous gap) ──────────────────────

if (!check2Pass) {
  console.error(`CHECK 2 FAIL — ${proseCollapsed.length} prose-collapsed section(s) in spec.json:`);
  console.error(`  These sections describe visual sub-elements in a prose "content" string`);
  console.error(`  instead of as named objects in layers/widgets/columns/banners arrays.`);
  console.error(`  Their real sub-components are INVISIBLE to Check 1 and to design-contract.\n`);

  for (const s of proseCollapsed) {
    console.error(`  PROSE-COLLAPSED SECTION: "${s.name}"`);
    console.error(`    content: "${s.content}"`);
    console.error(`    height: ${s.height ?? 'unknown'}px`);
    console.error(`    Sub-elements to enumerate: walk Figma node ${s.nodeId ?? '(nodeId unknown)'}`);
    console.error(`    and write each child as a named object in spec.json.\n`);
  }

  console.error(`  HOW TO FIX (spec.json — figma-extract must be re-run or manually corrected):`);
  console.error(`  For each prose-collapsed section, re-open Figma and enumerate every`);
  console.error(`  named child frame/group as a structured entry. Example transform:\n`);
  console.error(`  BEFORE (prose-collapsed — FORBIDDEN):`);
  console.error(`    { "name": "Newsletter", "content": "Email form + brand logos" }\n`);
  console.error(`  AFTER (structured — REQUIRED):`);
  console.error(`    {`);
  console.error(`      "name": "Newsletter",`);
  console.error(`      "layers": [`);
  console.error(`        { "name": "Copy Block",   "content": "Heading + body text" },`);
  console.error(`        { "name": "Form Card",    "content": "Email input + Subscribe button" },`);
  console.error(`        { "name": "Divider",      "content": "Horizontal rule" },`);
  console.error(`        { "name": "Brand Logos",  "content": "Google · Amazon · Philips · Toshiba · Samsung" }`);
  console.error(`      ]`);
  console.error(`    }`);
  console.error(`\n  Once spec.json is fixed, re-run figma-extract to regenerate`);
  console.error(`  component-checklist.md, then re-run this script.\n`);
}

// ── Report Check 1 ────────────────────────────────────────────────────────────

if (!check1Pass) {
  console.error(`CHECK 1 FAIL — ${missing.length} of ${entities.length} named Figma element(s) absent from contract.md §2:\n`);
  for (const e of missing) {
    const ctx = e.parent ? ` (in section "${e.parent}")` : '';
    console.error(`  MISSING ${e.kind.toUpperCase()}: "${e.name}"${ctx}`);
  }
  console.error(`\n  Add each missing element to §2 with layout, tokens, content, and`);
  console.error(`  a [component.*] data-testid tag where the element is interactive or`);
  console.error(`  structurally significant. Then re-run:\n`);
  console.error(`    npm run validate:figma-coverage -- ${featureId}`);
  console.error(`    npm run validate:contract -- ${featureId}\n`);
}

process.exit(1);
