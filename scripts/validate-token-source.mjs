#!/usr/bin/env node
/**
 * Ensures active tokens are from Figma/Tokens Studio — not scaffold.
 * Skips when files are empty placeholders (before figma-extract).
 */
import {
  loadActiveFiles,
  isEmptyPlaceholder,
  totalLeaves,
} from "./lib/token-files.mjs";

const TEST_MODE = process.argv.includes("--test");
const FORCE = process.argv.includes("--force");

const BLOCKED = new Set(["gluestack-ui-v2"]);
const ALLOWED = new Set(["figma", "figma-mcp", "tokens-studio", "tokens-studio-for-figma"]);

const loaded = loadActiveFiles();
const errors = [];
let blocked = 0;
let allowed = 0;
const histogram = {};

for (const { error } of loaded) {
  if (error) errors.push(error);
}

if (!FORCE && !TEST_MODE && isEmptyPlaceholder(loaded)) {
  console.log("SKIP: tokens:validate-source — empty placeholders (run figma-extract first).");
  process.exit(0);
}

if (TEST_MODE) {
  console.log("SKIP: tokens:validate-source — test mode (DTCG shape only).");
  process.exit(0);
}

for (const { leaves } of loaded) {
  for (const { token } of leaves) {
    const src = token.$extensions?.source ?? null;
    if (src) histogram[src] = (histogram[src] ?? 0) + 1;
    if (src && BLOCKED.has(src)) blocked += 1;
    else if (src && ALLOWED.has(src)) allowed += 1;
  }
}

if (blocked > 0) {
  errors.push(
    `Active tokens use blocked source gluestack-ui-v2 (${blocked} leaves). ` +
      `Import from Figma; reference: tokens/archive/gluestack-scaffold/`
  );
}
if (allowed === 0 && totalLeaves(loaded) > 0) {
  errors.push("No figma / tokens-studio source on active token leaves.");
}

console.log("Token source validation");
console.log(`  Leaves: ${totalLeaves(loaded)}`);
console.log(`  Allowed: ${allowed}  Blocked: ${blocked}`);
for (const [s, n] of Object.entries(histogram).sort()) console.log(`    ${s}: ${n}`);

if (errors.length) {
  for (const e of errors) console.error("FAIL:", e);
  process.exit(1);
}
console.log("PASS: token source is Figma/Tokens Studio.");
process.exit(0);
