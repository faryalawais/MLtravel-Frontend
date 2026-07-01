#!/usr/bin/env node
/**
 * validate-layout.mjs
 *
 * Offline (no MCP) validator for a feature's composition tree
 * features/<id>/figma/layout.json — per docs/figma-single-pass-extract-plan.md
 * (§4 schema boundary, §8 validators, Phase 1.2).
 *
 * Four checks, all against disk artifacts:
 *   SCHEMA   — layout.json validates against schemas/layout.schema.json (ajv).
 *              This already enforces "only allowed node types/hints" and that
 *              every gap/padding is a token-shaped string (never raw px).
 *   SLUGS    — every leaf `slug` resolves to a registered leaf in
 *              tokens/ui-registry.json.
 *   TOKENS   — every gap/padding token reference appears in the authoritative
 *              spacing vocabulary of reports/tokens-report.md.
 *   SYNC     — tokens/ui-registry.json passes ui-registry:validate (grammar +
 *              $screen resolution). ADVISORY by default (warns, never fails the
 *              gate) because registry health is owned by its own dedicated gate
 *              (`ui-registry:check-sync` in `npm run gate`) and components may
 *              not be implemented yet. Pass --check-sync to make it fatal here.
 *
 * Usage:
 *   node scripts/validate-layout.mjs <feature-id> [--check-sync]
 *   npm run validate:layout -- <feature-id>
 *
 * Exit codes:
 *   0  — all checks pass
 *   1  — one or more checks fail
 *   2  — usage error / missing input
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import Ajv from "ajv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const featureId = process.argv[2];
const CHECK_SYNC = process.argv.includes("--check-sync");

if (!featureId || featureId.startsWith("--")) {
  console.error("Usage: node scripts/validate-layout.mjs <feature-id> [--check-sync]");
  process.exit(2);
}

const layoutPath = join(REPO_ROOT, "features", featureId, "figma", "layout.json");
const schemaPath = join(REPO_ROOT, "schemas", "layout.schema.json");
const registryPath = join(REPO_ROOT, "tokens", "ui-registry.json");
const reportPath = join(REPO_ROOT, "reports", "tokens-report.md");

for (const [label, p] of [
  ["layout.json", layoutPath],
  ["schemas/layout.schema.json", schemaPath],
  ["tokens/ui-registry.json", registryPath],
  ["reports/tokens-report.md", reportPath],
]) {
  if (!existsSync(p)) {
    console.error(`ERROR: ${label} not found: ${p}`);
    if (label === "layout.json") console.error("Run: npm run build:layout -- " + featureId);
    process.exit(2);
  }
}

function readJson(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    console.error(`ERROR: could not parse ${p}: ${e.message}`);
    process.exit(2);
  }
}

const layout = readJson(layoutPath);
const schema = readJson(schemaPath);
const registry = readJson(registryPath);

// ── Collect registry leaf paths (a leaf is any object with $description) ──────
function collectLeafPaths(node, path, out) {
  if (!node || typeof node !== "object") return;
  if ("$description" in node) {
    out.add(path.join("."));
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    collectLeafPaths(v, [...path, k], out);
  }
}
const registryLeaves = new Set();
if (registry.screen) collectLeafPaths(registry.screen, ["screen"], registryLeaves);
if (registry.component) collectLeafPaths(registry.component, ["component"], registryLeaves);

// ── Collect the spacing vocabulary from tokens-report.md ─────────────────────
// Spacing-capable tokens are the `space.*` semantic aliases and the
// `spacing.*` primitive scale (both legal for gap/padding). Parse them out of
// the report so the source of truth stays the report, not a hard-coded list.
const reportText = readFileSync(reportPath, "utf8");
const spacingTokens = new Set();
for (const m of reportText.matchAll(/\b(space|spacing)\.[a-zA-Z0-9][a-zA-Z0-9.-]*/g)) {
  spacingTokens.add(m[0]);
}

// ── Walk the layout tree, collecting leaves + gap/padding refs ────────────────
const leafSlugs = [];
const spacingRefs = []; // { value, where }

function walk(node, where) {
  if (!node || typeof node !== "object") return;
  if (typeof node.slug === "string") leafSlugs.push({ slug: node.slug, where });
  for (const key of ["gap", "padding"]) {
    if (typeof node[key] === "string") spacingRefs.push({ value: node[key], where: `${where}.${key}` });
  }
  if (node.overrides && typeof node.overrides === "object") {
    for (const [bp, o] of Object.entries(node.overrides)) {
      for (const key of ["gap", "padding"]) {
        if (o && typeof o[key] === "string") {
          spacingRefs.push({ value: o[key], where: `${where}.overrides.${bp}.${key}` });
        }
      }
    }
  }
  if (Array.isArray(node.children)) {
    node.children.forEach((c, i) => walk(c, `${where}.children[${i}]`));
  }
}

// ── CHECK: SCHEMA ─────────────────────────────────────────────────────────────
const ajv = new Ajv({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
const schemaOk = validate(layout);

// Only walk if structurally sane enough to traverse.
if (layout && typeof layout === "object") {
  if (layout.root) walk(layout.root, "root");
  if (layout.overrides && typeof layout.overrides === "object") {
    for (const [bp, o] of Object.entries(layout.overrides)) {
      for (const key of ["gap", "padding"]) {
        if (o && typeof o[key] === "string") spacingRefs.push({ value: o[key], where: `overrides.${bp}.${key}` });
      }
    }
  }
}

// ── CHECK: SLUGS ──────────────────────────────────────────────────────────────
const badSlugs = leafSlugs.filter((l) => !registryLeaves.has(l.slug));

// ── CHECK: TOKENS ─────────────────────────────────────────────────────────────
const badTokens = spacingRefs.filter((r) => !spacingTokens.has(r.value));

// ── CHECK: SYNC (registry grammar) ───────────────────────────────────────────
let syncOk = true;
let syncMsg = "";
try {
  const args = ["scripts/build-ui-registry.mjs", "--validate"];
  if (CHECK_SYNC) args.push("--check-sync");
  execFileSync("node", args, { cwd: REPO_ROOT, stdio: "pipe" });
} catch (e) {
  syncOk = false;
  syncMsg = (e.stdout?.toString() || "") + (e.stderr?.toString() || "");
}

// ── Report ────────────────────────────────────────────────────────────────────
// SYNC is fatal only under --check-sync; otherwise advisory.
const syncFatal = CHECK_SYNC && !syncOk;

const allOk = schemaOk && badSlugs.length === 0 && badTokens.length === 0 && !syncFatal;

if (allOk) {
  console.log(`✓ validate:layout — ${featureId}`);
  console.log(`  SCHEMA: layout.json conforms to schemas/layout.schema.json.`);
  console.log(`  SLUGS:  all ${leafSlugs.length} leaf slug(s) resolve in tokens/ui-registry.json.`);
  console.log(`  TOKENS: all ${spacingRefs.length} gap/padding ref(s) are tokens in reports/tokens-report.md.`);
  if (syncOk) {
    console.log(`  SYNC:   tokens/ui-registry.json grammar valid${CHECK_SYNC ? " + rendered-sync OK" : ""}.`);
  } else {
    console.log(`  SYNC:   ADVISORY — tokens/ui-registry.json failed ui-registry:validate`);
    console.log(`          (pre-existing; owned by the ui-registry:check-sync gate, not this one).`);
    console.log(`          Run with --check-sync to make this fatal.`);
  }
  console.log("");
  process.exit(0);
}

console.error(`✗ validate:layout — ${featureId}\n`);

if (!schemaOk) {
  console.error(`SCHEMA FAIL — layout.json does not match schemas/layout.schema.json:`);
  for (const err of validate.errors ?? []) {
    console.error(`  ${err.instancePath || "(root)"} ${err.message}`);
  }
  console.error("");
}

if (badSlugs.length) {
  console.error(`SLUGS FAIL — ${badSlugs.length} leaf slug(s) absent from tokens/ui-registry.json:`);
  for (const b of badSlugs) console.error(`  ${b.where}: "${b.slug}"`);
  console.error(`  Add the path to ui-registry.json (ui-registry-build) or fix the slug.\n`);
}

if (badTokens.length) {
  console.error(`TOKENS FAIL — ${badTokens.length} gap/padding value(s) are not spacing tokens:`);
  for (const b of badTokens) console.error(`  ${b.where}: "${b.value}" (expected a space.* or spacing.* token)`);
  console.error(`  Raw px is forbidden — map to a token via reports/tokens-report.md.\n`);
}

if (syncFatal) {
  console.error(`SYNC FAIL — tokens/ui-registry.json failed ui-registry:validate:check-sync:`);
  console.error(syncMsg.split("\n").map((l) => "  " + l).join("\n"));
  console.error("");
}

process.exit(1);
