#!/usr/bin/env node
/**
 * enrich-registry-tokens.mjs
 *
 * Enriches tokens/ui-registry.json $tokens from spec.json boundVariables
 * (REST extract) via the Figma variable → semantic token index.
 *
 * Usage:
 *   node scripts/enrich-registry-tokens.mjs [feature-id]
 *   npm run ui-registry:enrich-tokens -- PDP-004
 *
 * Flags:
 *   --refresh-index   Re-fetch Figma /variables/local before enriching
 *   --dry-run         Print changes without writing ui-registry.json
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { fileKeyFromUrl } from "./figma-extract-lib.mjs";
import {
  boundVariablesToTokens,
  loadOrBuildVariableIndex,
} from "./lib/figma-token-map.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const REGISTRY_PATH = join(REPO_ROOT, "tokens", "ui-registry.json");

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const featureId = args[0] ?? null;
const refreshIndex = process.argv.includes("--refresh-index");
const dryRun = process.argv.includes("--dry-run");

if (!existsSync(REGISTRY_PATH)) {
  console.error("ERROR: tokens/ui-registry.json not found.");
  process.exit(1);
}

/** @type {Record<string, object>} */
const specByNodeId = new Map();

function indexSpecTree(node) {
  if (!node || typeof node !== "object") return;
  if (node.nodeId) specByNodeId.set(node.nodeId, node);
  for (const key of ["sections", "layers", "widgets", "columns", "banners"]) {
    for (const child of node[key] ?? []) indexSpecTree(child);
  }
}

if (featureId) {
  const specPath = join(REPO_ROOT, "features", featureId, "figma", "spec.json");
  if (!existsSync(specPath)) {
    console.error(`ERROR: ${specPath} not found. Run build:spec-from-cache first.`);
    process.exit(1);
  }
  const spec = JSON.parse(readFileSync(specPath, "utf8"));
  indexSpecTree(spec);
} else {
  for (const id of ["HOME-002", "PDP-004", "SHOP-003", "AUTH-001"]) {
    const specPath = join(REPO_ROOT, "features", id, "figma", "spec.json");
    if (existsSync(specPath)) {
      indexSpecTree(JSON.parse(readFileSync(specPath, "utf8")));
    }
  }
}

let fileKey = process.env.FIGMA_FILE_KEY ?? null;
if (featureId) {
  const specPath = join(REPO_ROOT, "features", featureId, "figma", "spec.json");
  if (existsSync(specPath)) {
    try {
      const spec = JSON.parse(readFileSync(specPath, "utf8"));
      fileKey = fileKeyFromUrl(spec.$meta?.figmaUrl) ?? spec.$meta?.figmaFile ?? fileKey;
    } catch {
      /* ignore */
    }
  }
}

const variableIndex = await loadOrBuildVariableIndex({ fileKey, refresh: refreshIndex });
const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));

let enriched = 0;
let skipped = 0;

function walkRegistry(node, pathPrefix = "") {
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$") || key === "$metadata") continue;
    const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;
    if (value && typeof value === "object") {
      if (typeof value.$figmaNode === "string" && value.$description) {
        const specNode = specByNodeId.get(value.$figmaNode);
        if (!specNode?.boundVariables) {
          skipped++;
        } else {
          const fromBound = boundVariablesToTokens(specNode.boundVariables, variableIndex);
          if (Object.keys(fromBound).length) {
            value.$tokens = { ...(value.$tokens ?? {}), ...fromBound };
            value.$tokensSource = "boundVariables";
            enriched++;
          }
        }
      }
      walkRegistry(value, fullPath);
    }
  }
}

walkRegistry(registry);

if (dryRun) {
  console.log(`enrich-registry-tokens (dry-run) — ${enriched} entries would be enriched, ${skipped} skipped (no boundVariables in spec)`);
  process.exit(0);
}

writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n", "utf8");
console.log(`✓ enrich-registry-tokens — ${enriched} component(s) enriched from boundVariables`);
console.log(`  skipped: ${skipped} (no boundVariables on spec node)`);
console.log(`  index:   ${Object.keys(variableIndex.byVariableId ?? {}).length} variable id(s) mapped`);
if (variableIndex.apiWarning) console.warn(`  warn:    ${variableIndex.apiWarning}`);
console.log(`  next:    npm run ui-registry:validate`);
