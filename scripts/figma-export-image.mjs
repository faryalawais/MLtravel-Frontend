#!/usr/bin/env node
/**
 * figma-export-image.mjs
 *
 * Screenshots + assets via the Figma REST API — never MCP (docs §11 Phase 3.3,
 * Appendix A.6). REST tolerates concurrency and large payloads and has no LLM
 * token budget, so it is the right channel for binary exports. This is the
 * deterministic replacement for the unreliable MCP screenshot-to-disk path that
 * shipped placeholder reference.png files for AUTH-001 / SHOP-003.
 *
 * It does two things:
 *   1. One PNG @2x per slice-root section → features/<id>/figma/reference-<slug>.png
 *      (slice-roots resolved the same way the driver resolves them).
 *   2. Re-download every `static` asset listed in asset-manifest.json as
 *      SVG/PNG to its localPath (icons/images). `dynamic` assets are skipped.
 *
 * A single export failure is logged and skipped — it never aborts the run
 * (the handshake-path1 HTTP 500 pattern).
 *
 * Requires:
 *   FIGMA_ACCESS_TOKEN   — a Figma personal access token (X-Figma-Token)
 *   FIGMA_FILE_KEY       — optional; otherwise derived from spec.json $meta.figmaUrl
 *
 * Usage:
 *   node scripts/figma-export-image.mjs --feature <id>
 *   npm run figma:export-image -- --feature PDP-004
 *
 * Flags:
 *   --feature <id>     (required)
 *   --out <dir>        output dir (default features/<id>/figma)
 *   --scale <n>        PNG scale (default 2)
 *   --no-assets        skip the asset-manifest re-download, screenshots only
 *
 * Exit codes:
 *   0  — screenshots + static assets exported (individual skips are warnings)
 *   1  — nothing could be exported (no token, no file key, or all calls failed)
 *   2  — usage error / missing input
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  normalizeId,
  collectRegistryFigmaNodes,
  resolveSliceRoots,
  resolveFileKey,
} from "./figma-extract-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const REST = "https://api.figma.com/v1";

// ── Args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const opts = { feature: null, out: null, scale: 2, assets: true };
for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  switch (arg) {
    case "--feature": opts.feature = argv[++i]; break;
    case "--out": opts.out = argv[++i]; break;
    case "--scale": opts.scale = Number(argv[++i]); break;
    case "--no-assets": opts.assets = false; break;
    default:
      if (!arg.startsWith("--") && !opts.feature) opts.feature = arg;
      break;
  }
}

if (!opts.feature) {
  console.error("Usage: node scripts/figma-export-image.mjs --feature <id>");
  process.exit(2);
}

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
if (!TOKEN) {
  console.error("ERROR: FIGMA_ACCESS_TOKEN is not set.");
  console.error("  export FIGMA_ACCESS_TOKEN=figd_...   (Figma → Settings → Personal access tokens)");
  process.exit(2);
}

const fileKey = resolveFileKey({ repoRoot: REPO_ROOT, featureId: opts.feature });
if (!fileKey) {
  console.error("ERROR: could not resolve the Figma file key.");
  console.error("  Set FIGMA_FILE_KEY, or ensure features/<id>/figma/spec.json $meta.figmaUrl is present.");
  process.exit(2);
}

const FIGMA_DIR = opts.out ? opts.out : join(REPO_ROOT, "features", opts.feature, "figma");
mkdirSync(FIGMA_DIR, { recursive: true });

const headers = { "X-Figma-Token": TOKEN };

// ── Resolve slice-roots for screenshots ───────────────────────────────────────
// REST cannot enumerate the frame tree cheaply, so screenshots reuse the
// committed slice-roots / explicit list / ui-registry projection — but the
// ui-registry path needs a frame tree we don't have here. We therefore resolve
// from slice-roots.json or run-report.json (written by the driver) first, then
// fall back to the spec.json in-scope sections.
const sliceRoots = resolveScreenshotTargets();

let exported = 0;
let skipped = 0;

// ── 1. Screenshots — one PNG @scale per slice-root ────────────────────────────
if (sliceRoots.length === 0) {
  console.warn("WARN: no slice-roots resolved for screenshots — skipping screenshots.");
} else {
  console.log(`figma:export-image — ${opts.feature} (file ${fileKey})`);
  console.log(`  screenshots: ${sliceRoots.length} slice-root(s) @${opts.scale}x`);
  const ids = sliceRoots.map((s) => s.nodeId);
  const urlMap = await fetchImageUrls(ids, { format: "png", scale: opts.scale });
  for (const sr of sliceRoots) {
    const url = urlMap[sr.nodeId] ?? urlMap[sr.nodeId.replace(":", "-")];
    const slug = slugify(sr.name ?? sr.nodeId);
    const outPath = join(FIGMA_DIR, `reference-${slug}.png`);
    if (!url) {
      console.warn(`    ✗ ${sr.nodeId} ${sr.name ?? ""} — no render URL returned (skipped)`);
      skipped++;
      continue;
    }
    const ok = await download(url, outPath);
    if (ok) {
      const kb = (statSync(outPath).size / 1024).toFixed(1);
      console.log(`    ✓ ${sr.nodeId} → reference-${slug}.png (${kb} KB)`);
      exported++;
    } else {
      skipped++;
    }
  }
}

// ── 2. Static assets from asset-manifest.json ─────────────────────────────────
if (opts.assets) {
  const manifestPath = join(FIGMA_DIR, "asset-manifest.json");
  if (!existsSync(manifestPath)) {
    console.warn("  assets: asset-manifest.json not found — skipping asset re-download.");
  } else {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const statics = (manifest.assets ?? []).filter((a) => a.dataSource !== "dynamic");
    const svgIds = statics.filter((a) => a.type === "svg").map((a) => normalizeId(a.nodeId));
    const rasterIds = statics.filter((a) => a.type !== "svg").map((a) => normalizeId(a.nodeId));
    console.log(`  assets: ${statics.length} static (${svgIds.length} svg, ${rasterIds.length} raster)`);

    const urlMap = {};
    if (svgIds.length) Object.assign(urlMap, await fetchImageUrls(svgIds, { format: "svg", svg_include_id: true }));
    if (rasterIds.length) Object.assign(urlMap, await fetchImageUrls(rasterIds, { format: "png", scale: opts.scale }));

    for (const a of statics) {
      const id = normalizeId(a.nodeId);
      const url = urlMap[id] ?? urlMap[id.replace(":", "-")];
      const outPath = join(REPO_ROOT, a.localPath);
      if (!url) {
        console.warn(`    ✗ ${id} ${a.nodeName ?? ""} — no render URL (skipped, keeping existing file)`);
        skipped++;
        continue;
      }
      mkdirSync(dirname(outPath), { recursive: true });
      const ok = await download(url, outPath);
      if (ok) { console.log(`    ✓ ${id} → ${a.localPath}`); exported++; }
      else skipped++;
    }
  }
}

console.log("");
if (exported === 0) {
  console.error(`✗ figma:export-image — ${opts.feature}: nothing exported (${skipped} skipped).`);
  process.exit(1);
}
console.log(`✓ figma:export-image — ${opts.feature}: ${exported} exported, ${skipped} skipped.`);
process.exit(0);

// ── helpers ────────────────────────────────────────────────────────────────────

/**
 * Call GET /v1/images and return a { nodeId → renderUrl } map.
 * REST may run with concurrency; a single failure is logged and yields no URL
 * for that node (the caller skips it).
 */
async function fetchImageUrls(ids, params) {
  const q = new URLSearchParams({ ids: ids.join(","), ...stringifyParams(params) });
  const url = `${REST}/images/${fileKey}?${q.toString()}`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`    ! /v1/images ${res.status} ${res.statusText} for ${ids.length} id(s)`);
      return {};
    }
    const json = await res.json();
    if (json.err) {
      console.warn(`    ! /v1/images error: ${json.err}`);
      return {};
    }
    return json.images ?? {};
  } catch (e) {
    console.warn(`    ! /v1/images request failed: ${e.message}`);
    return {};
  }
}

async function download(url, outPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`    ! download ${res.status} for ${outPath}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(outPath, buf);
    return true;
  } catch (e) {
    console.warn(`    ! download failed for ${outPath}: ${e.message}`);
    return false;
  }
}

function stringifyParams(params) {
  const out = {};
  for (const [k, v] of Object.entries(params)) out[k] = String(v);
  return out;
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

/**
 * Screenshot targets, resolved without a live MCP tree:
 *   1. run-report.json sliceRoots (written by the driver this same session)
 *   2. slice-roots.json
 *   3. ui-registry projection over spec.json in-scope sections
 *      (a section is in scope unless it has an out-of-scope `note`)
 */
function resolveScreenshotTargets() {
  // 1. run-report.json
  const runReport = join(FIGMA_DIR, "run-report.json");
  if (existsSync(runReport)) {
    try {
      const rr = JSON.parse(readFileSync(runReport, "utf8"));
      if (Array.isArray(rr.sliceRoots) && rr.sliceRoots.length) {
        return rr.sliceRoots.map((s) => ({ nodeId: normalizeId(s.nodeId), name: s.name }));
      }
    } catch { /* fall through */ }
  }

  // 2. slice-roots.json (via the shared resolver, no frame tree needed)
  try {
    const fromFile = resolveSliceRoots({
      repoRoot: REPO_ROOT,
      featureId: opts.feature,
      frameNode: null,
      registryNodes: new Set(),
      explicitNodes: [],
    });
    if (fromFile.length) return fromFile.map((s) => ({ nodeId: s.nodeId, name: s.name }));
  } catch { /* resolver throws when neither explicit nor slice-roots.json present */ }

  // 3. spec.json in-scope sections projected against ui-registry
  const specPath = join(FIGMA_DIR, "spec.json");
  if (!existsSync(specPath)) return [];
  let spec;
  try { spec = JSON.parse(readFileSync(specPath, "utf8")); } catch { return []; }

  let registryNodes = new Set();
  const registryPath = join(REPO_ROOT, "tokens", "ui-registry.json");
  if (existsSync(registryPath)) {
    try { registryNodes = collectRegistryFigmaNodes(JSON.parse(readFileSync(registryPath, "utf8"))); } catch { /* ignore */ }
  }

  const out = [];
  for (const section of spec.sections ?? []) {
    if (!section.nodeId) continue;
    if (typeof section.note === "string" && /out of (pdp-\w+ )?scope|shared component/i.test(section.note)) continue;
    // Keep sections the feature actually registers (any descendant nodeId) or
    // that have structured layers (i.e. real in-scope content).
    const id = normalizeId(section.nodeId);
    const registered = registryNodes.has(id) || (section.layers?.length ?? 0) > 0;
    if (registered) out.push({ nodeId: id, name: section.name });
  }
  return out;
}
