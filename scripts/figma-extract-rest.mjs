#!/usr/bin/env node
/**
 * figma-extract-rest.mjs
 *
 * REST fallback for the single-session extraction cache (docs/figma-single-pass-
 * extract-plan.md Appendix A.1 "optional tree skeleton via /files/.../nodes",
 * A.9 fallback, and docs/figma-extract-improvement-plan.md Stage 0).
 *
 * Why this exists: in some environments the Dev Mode MCP `get_design_context`
 * tool never returns for an out-of-process client (the documented A.9
 * "systematic outage"), so scripts/figma-extract-driver.mjs cannot populate
 * features/<id>/figma/nodes/*.json. `get_metadata` only reaches 53/84 PDP-004
 * nodes — it treats component instances as leaves, so the instance-internal ids
 * (`I403:4515;399:4142` …) are unreachable that way. The Figma REST file-content
 * endpoint returns the FULL recursive document for a node — every descendant id,
 * geometry, fills, typography and text — so it can build the same cache with
 * real data and ZERO MCP.
 *
 * It writes one cache file per slice-root in the §5 shape:
 *   features/<id>/figma/nodes/<cacheStem>.json
 *     { $meta: { nodeId, nodeName, cachedAt, source, figmaFileKey, figmaLastModified }, raw }
 * `raw` is the REST `document` subtree (recursive) — so a slice-root file covers
 * all of its leaves, exactly like a recursive get_design_context payload.
 *
 * Requires:
 *   FIGMA_ACCESS_TOKEN — a Figma PAT WITH the "File content: Read-only" scope.
 *                        (Image-only scope renders screenshots but 404s on
 *                        /v1/files and /v1/files/:key/nodes — see CHECK below.)
 *   FIGMA_FILE_KEY     — optional; otherwise derived from spec.json $meta.figmaUrl.
 *
 * Usage:
 *   node scripts/figma-extract-rest.mjs --feature PDP-004 --frame 394:8951
 *   npm run figma:extract:rest -- --feature PDP-004 --frame 394:8951
 *   npm run figma:extract:rest -- --feature PDP-004 --refresh-node 399:4042
 *
 * Flags:
 *   --feature <id>        (required)
 *   --frame <node>        frame node id (used to resolve slice-roots from the tree)
 *   --out <dir>           output dir (default features/<id>/figma)
 *   --nodes a,b,c         explicit slice-root nodeIds (override resolution)
 *   --refresh-node <id>   re-fetch exactly this node (repeatable / comma list)
 *   --force               ignore existing cache (clean re-extract)
 *   --no-stamp            do not back-stamp spec.json / layout.json figmaLastModified
 *
 * Exit codes:
 *   0  — cache written and every checklist nodeId is covered
 *   1  — token lacks file-content scope, a fetch failed, or coverage incomplete
 *   2  — usage error / missing input
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  normalizeId,
  cacheStem,
  collectRegistryFigmaNodes,
  resolveSliceRoots,
  resolveFileKey,
} from "./figma-extract-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const REST = "https://api.figma.com/v1";

// ── Args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opts = {
  feature: null,
  frame: null,
  out: null,
  nodes: [],
  refreshNodes: [],
  force: false,
  stamp: true,
};
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  switch (arg) {
    case "--feature": opts.feature = argv[++i]; break;
    case "--frame": opts.frame = normalizeId(argv[++i]); break;
    case "--out": opts.out = argv[++i]; break;
    case "--nodes": opts.nodes = splitList(argv[++i]); break;
    case "--refresh-node": opts.refreshNodes.push(...splitList(argv[++i])); break;
    case "--force": opts.force = true; break;
    case "--no-stamp": opts.stamp = false; break;
    default:
      if (!arg.startsWith("--") && !opts.feature) opts.feature = arg;
      break;
  }
}
function splitList(s) {
  return (s ?? "").split(",").map((x) => normalizeId(x.trim())).filter(Boolean);
}

if (!opts.feature) {
  console.error("Usage: node scripts/figma-extract-rest.mjs --feature <id> --frame <node>");
  process.exit(2);
}

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("ERROR: FIGMA_ACCESS_TOKEN is not set.");
  console.error("  export FIGMA_ACCESS_TOKEN=figd_...  (Figma → Settings → Security → Personal access tokens)");
  console.error("  The token MUST have the 'File content: Read-only' scope.");
  process.exit(2);
}

const fileKey = resolveFileKey({ repoRoot: REPO_ROOT, featureId: opts.feature });
if (!fileKey) {
  console.error("ERROR: could not resolve the Figma file key.");
  console.error("  Set FIGMA_FILE_KEY, or ensure features/<id>/figma/spec.json $meta.figmaUrl is present.");
  process.exit(2);
}

const FIGMA_DIR = opts.out ? opts.out : join(REPO_ROOT, "features", opts.feature, "figma");
const NODES_DIR = join(FIGMA_DIR, "nodes");
const specPath = join(FIGMA_DIR, "spec.json");
const layoutPath = join(FIGMA_DIR, "layout.json");
const refreshSet = new Set(opts.refreshNodes.map(normalizeId));
const refreshOnly = opts.refreshNodes.length > 0 && opts.nodes.length === 0;

// ── REST helpers ──────────────────────────────────────────────────────────────
async function fetchNodes(ids) {
  const url = `${REST}/files/${fileKey}/nodes?ids=${ids.map(encodeURIComponent).join(",")}&geometry=paths`;
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "X-Figma-Token": TOKEN } });
      if (res.status === 403 || res.status === 404) {
        // The decisive scope signal: an image-only token renders screenshots but
        // 404/403s on file-content reads. Fail with the exact remedy.
        const body = await res.text().catch(() => "");
        scopeFail(res.status, body);
      }
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        await sleep(attempt * 1000);
        continue;
      }
      return await res.json();
    } catch (e) {
      lastErr = e;
      await sleep(attempt * 1000);
    }
  }
  throw lastErr ?? new Error("REST /nodes failed");
}

function scopeFail(status, body) {
  console.error(`\n✗ figma:extract:rest — Figma REST file-content read returned HTTP ${status}.`);
  console.error(`  ${body?.slice(0, 200) ?? ""}`);
  console.error(
    `\n  This token can authenticate (GET /v1/me) and may even render images, but it\n` +
      `  cannot read the document JSON — it is missing the 'File content: Read-only'\n` +
      `  scope. Regenerate the PAT with that scope:\n` +
      `    Figma → Settings → Security → Personal access tokens → Generate new token\n` +
      `    Scopes: File content → Read-only\n` +
      `  then: export FIGMA_ACCESS_TOKEN=figd_... && npm run figma:extract:rest -- --feature ${opts.feature} --frame ${opts.frame ?? "<frame>"}`,
  );
  process.exit(1);
}

// REST document nodes carry { id, name, type, children }, the shape the shared
// resolver/walkers expect — so they can be used directly.
function findInDoc(node, id) {
  const want = normalizeId(id);
  const stack = [node];
  while (stack.length) {
    const n = stack.pop();
    if (!n) continue;
    if (normalizeId(n.id) === want) return n;
    if (Array.isArray(n.children)) stack.push(...n.children);
  }
  return null;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ── Cache write (§5 shape) ─────────────────────────────────────────────────────
function writeCache(nodeId, name, subtree, figmaLastModified) {
  mkdirSync(NODES_DIR, { recursive: true });
  const payload = {
    $meta: {
      nodeId,
      nodeName: name ?? null,
      cachedAt: new Date().toISOString().slice(0, 10),
      source: "figma-rest-files-nodes",
      figmaFileKey: fileKey,
      figmaLastModified: figmaLastModified ?? null,
    },
    raw: subtree,
  };
  writeFileSync(join(NODES_DIR, `${cacheStem(nodeId)}.json`), JSON.stringify(payload, null, 2) + "\n", "utf8");
}

function backStamp(path, key, value) {
  if (!opts.stamp || !value || !existsSync(path)) return;
  try {
    const json = JSON.parse(readFileSync(path, "utf8"));
    if (key === "$meta") {
      json.$meta = json.$meta ?? {};
      json.$meta.figmaLastModified = value;
    } else {
      json.figmaLastModified = value;
    }
    writeFileSync(path, JSON.stringify(json, null, 2) + "\n", "utf8");
  } catch { /* best effort */ }
}

// ── Main ───────────────────────────────────────────────────────────────────────
console.log(`figma:extract:rest — ${opts.feature} (file ${fileKey})`);

// 1. Fetch the frame's full recursive document (one call; large JSON is fine on REST).
const seedIds = refreshOnly ? [...refreshSet] : opts.frame ? [opts.frame] : opts.nodes;
if (seedIds.length === 0) {
  console.error("ERROR: provide --frame, --nodes, or --refresh-node.");
  process.exit(2);
}
const json = await fetchNodes(seedIds);
const figmaLastModified = json.lastModified ?? null;
console.log(`  file lastModified: ${figmaLastModified ?? "(none)"}`);

// 2. Resolve slice-roots against the frame document tree.
let frameDoc = null;
if (opts.frame && json.nodes?.[opts.frame]?.document) {
  frameDoc = json.nodes[opts.frame].document;
} else if (opts.frame && json.nodes?.[opts.frame.replace(":", "-")]?.document) {
  frameDoc = json.nodes[opts.frame.replace(":", "-")].document;
}

let registryNodes = new Set();
const registryPath = join(REPO_ROOT, "tokens", "ui-registry.json");
if (existsSync(registryPath)) {
  try {
    registryNodes = collectRegistryFigmaNodes(JSON.parse(readFileSync(registryPath, "utf8")));
  } catch { /* tolerate */ }
}

let sliceRoots;
if (refreshOnly) {
  sliceRoots = [...refreshSet].map((nodeId) => ({ nodeId, name: null, source: "refresh-node" }));
} else {
  sliceRoots = resolveSliceRoots({
    repoRoot: REPO_ROOT,
    featureId: opts.feature,
    frameNode: frameDoc,
    registryNodes,
    explicitNodes: opts.nodes,
  });
}

console.log(`  slice-roots (${sliceRoots.length}, source: ${sliceRoots[0]?.source ?? "n/a"}):`);

// Persist slice-roots for the feature (documented chunk list for re-extract + build:spec-from-cache).
if (!refreshOnly && opts.frame) {
  const sliceRootsPath = join(FIGMA_DIR, "slice-roots.json");
  const sliceRootsDoc = {
    frame: normalizeId(opts.frame),
    frameName: frameDoc?.name ?? null,
    sliceRoots: sliceRoots.map((sr) => ({
      nodeId: sr.nodeId,
      name: sr.name ?? null,
      source: sr.source ?? "ui-registry",
    })),
  };
  writeFileSync(sliceRootsPath, JSON.stringify(sliceRootsDoc, null, 2) + "\n", "utf8");
  console.log(`  wrote:    ${sliceRootsPath}`);
}

// 3. Write a cache file per slice-root (subtree extracted from the frame doc, or
//    fetched directly when not present in the seed response).
let written = 0;
for (const sr of sliceRoots) {
  let subtree = frameDoc ? findInDoc(frameDoc, sr.nodeId) : null;
  if (!subtree) {
    const r = await fetchNodes([sr.nodeId]);
    subtree = r.nodes?.[sr.nodeId]?.document ?? null;
  }
  if (!subtree) {
    console.error(`    ✗ ${sr.nodeId} ${sr.name ?? ""} — not found in REST document`);
    continue;
  }
  writeCache(sr.nodeId, sr.name ?? subtree.name, subtree, figmaLastModified);
  written++;
  console.log(`    ✓ ${sr.nodeId} ${sr.name ?? subtree.name ?? ""} → nodes/${cacheStem(sr.nodeId)}.json`);
}

// 4. Back-stamp spec.json + layout.json so Layer-D freshness is coherent.
backStamp(specPath, "$meta", figmaLastModified);
backStamp(layoutPath, "top", figmaLastModified);

// 5. Coverage self-check against component-checklist.md.
const checklistPath = join(FIGMA_DIR, "component-checklist.md");
let uncovered = [];
if (existsSync(checklistPath) && !refreshOnly) {
  const text = readFileSync(checklistPath, "utf8");
  const ids = [...new Set([...text.matchAll(/\(nodeId:\s*([^)]+?)\s*\)/g)].map((m) => m[1].trim()))]
    .filter((x) => x && !/unknown/i.test(x));
  // Re-read the just-written cache as one blob.
  let blob = "";
  for (const sr of sliceRoots) {
    const p = join(NODES_DIR, `${cacheStem(sr.nodeId)}.json`);
    if (existsSync(p)) blob += readFileSync(p, "utf8");
  }
  uncovered = ids.filter((id) => {
    const trailing = id.includes(";") ? id.slice(id.lastIndexOf(";") + 1) : id;
    const forms = [id, cacheStem(id), trailing, cacheStem(trailing)];
    return !forms.some((f) => blob.includes(f));
  });
  console.log(`  coverage: ${ids.length - uncovered.length}/${ids.length} checklist nodeId(s)`);
}

console.log("");
if (uncovered.length) {
  console.error(`✗ figma:extract:rest — ${uncovered.length} checklist nodeId(s) not covered by the written cache:`);
  for (const id of uncovered.slice(0, 20)) console.error(`    UNCOVERED ${id}`);
  console.error("  The slice-roots may not span the frame — pass --nodes or add slice-roots.json.");
  process.exit(1);
}
console.log(`✓ figma:extract:rest — ${opts.feature}: ${written} slice-root cache file(s) written.`);
console.log(`  next: npm run validate:figma-extract -- ${opts.feature}`);
process.exit(0);
