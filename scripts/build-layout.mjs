#!/usr/bin/env node
/**
 * build-layout.mjs
 *
 * Offline (no MCP / no Figma) generator for a feature's composition tree
 * features/<id>/figma/layout.json — per docs/figma-single-pass-extract-plan.md
 * (§4 shape, §A.5 / §A.5.1 derivation, Phase 2.1).
 *
 * Figma is truth: this script REGENERATES layout.json from the cached extract
 * each run (no hand-edits). It reads:
 *   - features/<id>/figma/nodes/*.json   (preferred source — the cache), OR
 *   - features/<id>/figma/spec.json      (bootstrap source, used today)
 *   - tokens/ui-registry.json            (nodeId → registry slug via $figmaNode)
 *   - reports/tokens-report.md           (spacing vocabulary, advisory)
 *
 * Transform:
 *   1. Map each Figma node (by nodeId) to a registry slug using the $figmaNode
 *      bindings in ui-registry.json. A mapped node becomes a leaf { slug } and
 *      recursion stops there (the slug owns its subtree).
 *   2. An unmapped node with mapped descendants becomes a { type:"stack" }
 *      container; its Auto-Layout free-text ("flex row, justify-between …") is
 *      parsed into direction/justify/align, and token-valued gap/padding are
 *      carried over. Unmapped nodes with no mapped descendants are pruned.
 *   3. gap/padding are emitted ONLY when the source value is already a
 *      space.* / spacing.* token. Raw px is dropped (composition stays valid;
 *      exact px lives in spec.json and is enforced by the dimension gates).
 *   4. version + figmaLastModified are stamped.
 *
 * Usage:
 *   node scripts/build-layout.mjs <feature-id>
 *   node scripts/build-layout.mjs --feature <feature-id>
 *   npm run build:layout -- <feature-id>
 *
 * Exit codes:
 *   0  — layout.json written
 *   1  — nothing mappable (no slugs resolved) — a real error
 *   2  — usage error / missing input
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

// ── Args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
let featureId = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--feature") featureId = argv[++i];
  else if (!argv[i].startsWith("--")) featureId = featureId ?? argv[i];
}
if (!featureId) {
  console.error("Usage: node scripts/build-layout.mjs <feature-id>");
  process.exit(2);
}

const figmaDir = join(REPO_ROOT, "features", featureId, "figma");
const specPath = join(figmaDir, "spec.json");
const nodesDir = join(figmaDir, "nodes");
const registryPath = join(REPO_ROOT, "tokens", "ui-registry.json");
const outPath = join(figmaDir, "layout.json");

if (!existsSync(registryPath)) {
  console.error(`ERROR: tokens/ui-registry.json not found: ${registryPath}`);
  process.exit(2);
}

function readJson(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    console.error(`ERROR: could not parse ${p}: ${e.message}`);
    process.exit(2);
  }
}

const registry = readJson(registryPath);

// ── Build nodeId → { slug, screen } map from $figmaNode bindings ──────────────
const nodeToSlug = new Map();
(function walk(node, path) {
  if (!node || typeof node !== "object") return;
  if (typeof node.$figmaNode === "string") {
    nodeToSlug.set(node.$figmaNode, { slug: path.join("."), screen: node.$screen ?? null });
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    walk(v, [...path, k]);
  }
})(registry.component, ["component"]);

if (nodeToSlug.size === 0) {
  console.error(`ERROR: no $figmaNode bindings found in ui-registry.json — cannot map any node to a slug.`);
  console.error(`Run ui-registry-build with $figmaNode bindings first.`);
  process.exit(1);
}

// ── Source: prefer nodes/ cache, fall back to spec.json ──────────────────────
// The cache (nodes/*.json) is the §A.5 path. Until the extraction driver
// (Phase 3) populates it, spec.json carries the same nested tree + tokens.
let sourceTree; // array of top-level section nodes
let figmaLastModified = null;
let figmaNodeId = null;
let sourceLabel = "";

if (existsSync(nodesDir) && readdirSync(nodesDir).some((f) => f.endsWith(".json"))) {
  // Cache mode is wired for Phase 3; spec.json remains the bootstrap today.
  sourceLabel = "spec.json (cache present; spec used as the assembled tree)";
} else {
  sourceLabel = "spec.json (bootstrap)";
}

if (!existsSync(specPath)) {
  console.error(`ERROR: spec.json not found: ${specPath}`);
  console.error(`Run figma-extract for ${featureId} first.`);
  process.exit(2);
}
const spec = readJson(specPath);
sourceTree = spec.sections ?? [];
figmaNodeId = spec.$meta?.frame ?? null;
figmaLastModified = spec.$meta?.figmaLastModified ?? null;

// ── Helpers ──────────────────────────────────────────────────────────────────
function isSpacingToken(v) {
  return typeof v === "string" && /^(space|spacing)\.[a-zA-Z0-9]/.test(v);
}

// Parse the free-text Auto-Layout description into container hints.
function parseLayout(layoutStr) {
  const out = { type: "stack" };
  if (typeof layoutStr !== "string") return out;
  const s = layoutStr.toLowerCase();
  if (/\bgrid\b/.test(s)) out.type = "grid";
  if (/\bcolumn\b/.test(s)) out.direction = "vertical";
  else if (/\brow\b/.test(s)) out.direction = "horizontal";

  if (/justify-between|space-between/.test(s)) out.justify = "between";
  else if (/justify-around/.test(s)) out.justify = "around";
  else if (/justify-evenly/.test(s)) out.justify = "evenly";
  else if (/justify-center|justify-content\s+center/.test(s)) out.justify = "center";
  else if (/justify-end/.test(s)) out.justify = "end";
  else if (/justify-start/.test(s)) out.justify = "start";

  if (/items-center/.test(s)) out.align = "center";
  else if (/items-start/.test(s)) out.align = "start";
  else if (/items-end/.test(s)) out.align = "end";
  else if (/items-stretch/.test(s)) out.align = "stretch";
  else if (/items-baseline/.test(s)) out.align = "baseline";

  return out;
}

/** Structured layout object from spec.json (direction/gap as fields). */
function layoutHints(node) {
  const layout = node.layout;
  if (layout && typeof layout === "object") {
    const out = { type: "stack" };
    if (layout.direction === "column") out.direction = "vertical";
    else if (layout.direction === "row") out.direction = "horizontal";
    if (layout.align === "center") out.align = "center";
    if (layout.justify === "space-between" || layout.justify === "between") out.justify = "between";
    return out;
  }
  return parseLayout(layout);
}

function spacingFrom(node) {
  const layout = node.layout;
  const gap = node.gap ?? (layout && typeof layout === "object" ? layout.gap : undefined);
  const padding = node.padding ?? (layout && typeof layout === "object" ? layout.padding : undefined);
  return { gap, padding };
}

function childrenOf(node) {
  // spec.json uses `layers`; tolerate the other structured arrays too.
  return [
    ...(node.layers ?? []),
    ...(node.columns ?? []),
    ...(node.widgets ?? []),
    ...(node.banners ?? []),
  ];
}

const stats = { mapped: [], prunedLeaves: 0, containers: 0, droppedTokens: [] };

// ── Transform a spec node → layout node (or null to prune) ────────────────────
function transform(node) {
  const id = node.nodeId;
  if (id && nodeToSlug.has(id)) {
    const { slug } = nodeToSlug.get(id);
    stats.mapped.push({ nodeId: id, slug, name: node.name });
    return { slug }; // leaf — slug owns its subtree
  }

  const kids = childrenOf(node)
    .map(transform)
    .filter(Boolean);

  if (kids.length === 0) {
    if (id && !nodeToSlug.has(id)) stats.prunedLeaves++;
    return null; // unmapped node with no mapped descendants — prune
  }

  const hints = layoutHints(node);
  const container = { type: hints.type };
  if (hints.direction) container.direction = hints.direction;

  const { gap, padding } = spacingFrom(node);
  // gap/padding only when already a spacing token; raw px is dropped.
  if (gap !== undefined) {
    if (isSpacingToken(gap)) container.gap = gap;
    else if (typeof gap === "string") stats.droppedTokens.push({ kind: "gap", value: gap, name: node.name });
  }
  if (padding !== undefined) {
    if (isSpacingToken(padding)) container.padding = padding;
    else if (typeof padding === "string") stats.droppedTokens.push({ kind: "padding", value: padding, name: node.name });
  }

  if (hints.align) container.align = hints.align;
  if (hints.justify) container.justify = hints.justify;
  container.children = kids;
  stats.containers++;
  return container;
}

const sectionNodes = sourceTree.map(transform).filter(Boolean);

if (sectionNodes.length === 0 || stats.mapped.length === 0) {
  console.error(`ERROR: no registry-mapped nodes found in ${specPath}.`);
  console.error(`Check that ui-registry.json $figmaNode bindings match spec.json nodeIds.`);
  process.exit(1);
}

// Collapse a single-section root to that section; otherwise wrap in a vertical stack.
const root =
  sectionNodes.length === 1
    ? sectionNodes[0]
    : { type: "stack", direction: "vertical", children: sectionNodes };

// ── Determine the screen path (mode of mapped leaves' $screen) ────────────────
const screenCounts = new Map();
for (const m of stats.mapped) {
  const sc = nodeToSlug.get(m.nodeId)?.screen;
  if (sc) screenCounts.set(sc, (screenCounts.get(sc) ?? 0) + 1);
}
let screen = null;
let best = -1;
for (const [sc, n] of screenCounts) {
  if (n > best) {
    best = n;
    screen = sc;
  }
}
if (!screen) {
  console.error(`ERROR: mapped leaves carry no $screen — cannot stamp the layout screen.`);
  process.exit(1);
}

// ── Assemble + write ──────────────────────────────────────────────────────────
const layout = {
  screen,
  figmaNodeId: figmaNodeId ?? "",
  version: new Date().toISOString().slice(0, 10),
  figmaLastModified,
  root,
};

writeFileSync(outPath, JSON.stringify(layout, null, 2) + "\n", "utf8");

console.log(`✓ build:layout — ${featureId}`);
console.log(`  source:  ${sourceLabel}`);
console.log(`  screen:  ${screen}`);
console.log(`  mapped:  ${stats.mapped.length} leaf slug(s), ${stats.containers} container(s)`);
if (stats.droppedTokens.length) {
  console.log(`  note:    dropped ${stats.droppedTokens.length} non-token gap/padding value(s) (raw px kept in spec.json):`);
  for (const d of stats.droppedTokens) console.log(`             ${d.kind} "${d.value}" on "${d.name}"`);
}
console.log(`  wrote:   ${outPath}`);
