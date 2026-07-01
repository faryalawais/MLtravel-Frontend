#!/usr/bin/env node
/**
 * build-spec-from-cache.mjs
 *
 * Derives features/<id>/figma/spec.json + component-checklist.md ONLY from the
 * on-disk REST/MCP cache (features/<id>/figma/nodes/*.json). No legacy spec
 * input — proves the single-pass cache is the sole design source.
 *
 * Usage:
 *   node scripts/build-spec-from-cache.mjs <feature-id>
 *   npm run build:spec-from-cache -- HOME-002
 *
 * Exit codes:
 *   0  — spec.json + component-checklist.md written
 *   1  — no nodes/*.json cache found
 *   2  — usage error
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { cacheStem, normalizeId, sliceRootId } from "./figma-extract-lib.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");

const featureId = process.argv[2];
if (!featureId || featureId.startsWith("--")) {
  console.error("Usage: node scripts/build-spec-from-cache.mjs <feature-id>");
  process.exit(2);
}

const figmaDir = join(REPO_ROOT, "features", featureId, "figma");
const nodesDir = join(figmaDir, "nodes");
const sliceRootsPath = join(figmaDir, "slice-roots.json");
const specPath = join(figmaDir, "spec.json");
const checklistPath = join(figmaDir, "component-checklist.md");

if (!existsSync(nodesDir)) {
  console.error(`ERROR: no nodes/ cache at ${nodesDir}`);
  console.error("Run figma:extract:rest or figma:extract first.");
  process.exit(1);
}

const cacheFiles = readdirSync(nodesDir).filter((f) => f.endsWith(".json"));
if (!cacheFiles.length) {
  console.error(`ERROR: nodes/ is empty — nothing to derive spec from.`);
  process.exit(1);
}

/** @type {Map<string, { meta: object, raw: object }>} */
const cacheByNodeId = new Map();
let figmaLastModified = null;
let figmaFileKey = null;
let frameNodeId = null;
let frameName = null;

for (const file of cacheFiles) {
  const payload = JSON.parse(readFileSync(join(nodesDir, file), "utf8"));
  const nodeId = normalizeId(payload.$meta?.nodeId ?? file.replace(/\.json$/, "").replace(/-/g, ":"));
  cacheByNodeId.set(nodeId, { meta: payload.$meta ?? {}, raw: payload.raw });
  if (payload.$meta?.figmaLastModified) figmaLastModified = payload.$meta.figmaLastModified;
  if (payload.$meta?.figmaFileKey) figmaFileKey = payload.$meta.figmaFileKey;
}

// Section order: slice-roots.json, then known extras (footer), then any remaining caches.
const orderedIds = [];
if (existsSync(sliceRootsPath)) {
  try {
    const sr = JSON.parse(readFileSync(sliceRootsPath, "utf8"));
    for (const entry of sr.sliceRoots ?? sr.nodes ?? []) {
      const id = sliceRootId(entry);
      if (id) orderedIds.push(id);
    }
    if (sr.frame) frameNodeId = normalizeId(sr.frame);
  } catch {
    /* ignore */
  }
}

const EXTRA_SECTION_IDS = ["389:2665"]; // shared footer — cached separately when out of slice-roots
for (const id of EXTRA_SECTION_IDS) {
  if (cacheByNodeId.has(id) && !orderedIds.includes(id)) orderedIds.push(id);
}

for (const id of cacheByNodeId.keys()) {
  if (!orderedIds.includes(id)) orderedIds.push(id);
}

const SKIP_TYPES = new Set(["VECTOR", "LINE", "BOOLEAN_OPERATION"]);
const MAX_DEPTH = 12;
const MIN_SIZE = 8;

function dims(node) {
  const b = node.absoluteBoundingBox ?? node.size;
  if (!b) return null;
  const w = Math.round(b.width ?? b.x ?? 0);
  const h = Math.round(b.height ?? b.y ?? 0);
  if (w < MIN_SIZE && h < MIN_SIZE) return null;
  return { width: w, height: h };
}

function autoLayout(node) {
  if (!node.layoutMode || node.layoutMode === "NONE") return undefined;
  const layout = {
    direction: node.layoutMode === "HORIZONTAL" ? "row" : "column",
  };
  if (typeof node.itemSpacing === "number") layout.gap = `${node.itemSpacing}px`;
  const pad = {};
  for (const [k, figmaKey] of [
    ["x", "paddingLeft"],
    ["y", "paddingTop"],
  ]) {
    const v = node[figmaKey];
    if (typeof v === "number" && v > 0) pad[k] = `${v}px`;
  }
  if (Object.keys(pad).length) layout.padding = pad;
  if (node.primaryAxisAlignItems === "CENTER") layout.align = "center";
  if (node.counterAxisAlignItems === "CENTER") layout.align = "center";
  if (node.primaryAxisAlignItems === "SPACE_BETWEEN") layout.justify = "space-between";
  return layout;
}

function pickArrayKey(parent, children) {
  const name = (parent.name ?? "").toLowerCase();
  if (name.includes("banner")) return "banners";
  if (
    parent.layoutMode === "HORIZONTAL" &&
    children.length >= 2 &&
    children.every((c) => c.dimensions?.height && c.dimensions.height > 80)
  ) {
    return "widgets";
  }
  return "layers";
}

function shouldInclude(node, depth) {
  if (depth > MAX_DEPTH) return false;
  if (node.type === "TEXT") return Boolean(node.characters?.trim());
  if (SKIP_TYPES.has(node.type) && !(node.children?.length)) return false;
  if (["FRAME", "GROUP", "COMPONENT", "INSTANCE", "SYMBOL", "RECTANGLE"].includes(node.type)) {
    return dims(node) !== null || (node.children?.length ?? 0) > 0;
  }
  return false;
}

function transformNode(node, depth = 0) {
  if (!shouldInclude(node, depth)) return null;

  const out = {
    name: node.name || node.type,
    nodeId: node.id,
  };

  const d = dims(node);
  if (d) out.dimensions = d;

  if (node.type === "TEXT") {
    out.type = "text";
    out.content = node.characters;
    if (node.style) {
      out.typography = {
        fontSize: node.style.fontSize,
        fontWeight: node.style.fontWeight,
        lineHeightPx: node.style.lineHeightPx,
      };
    }
    return out;
  }

  const layout = autoLayout(node);
  if (layout) out.layout = layout;

  if (node.boundVariables && Object.keys(node.boundVariables).length) {
    out.boundVariables = node.boundVariables;
  }

  const childNodes = (node.children ?? [])
    .map((c) => transformNode(c, depth + 1))
    .filter(Boolean);

  if (childNodes.length) {
    const key = pickArrayKey(node, childNodes);
    out[key] = childNodes;
  }

  return out;
}

function sectionFromCache(nodeId) {
  const entry = cacheByNodeId.get(nodeId);
  if (!entry) return null;
  const raw = entry.raw;
  const section = transformNode(raw, 0);
  if (!section) return null;
  section.name = raw.name ?? section.name;
  section.nodeId = raw.id;
  if (!section.dimensions && dims(raw)) section.dimensions = dims(raw);
  return section;
}

const sections = [];
for (const id of orderedIds) {
  const section = sectionFromCache(id);
  if (section) sections.push(section);
}

if (!sections.length) {
  console.error("ERROR: could not derive any sections from cache.");
  process.exit(1);
}

if (!frameNodeId) {
  // Infer frame from slice-roots file meta or first section
  const oldSpecPath = specPath;
  if (existsSync(oldSpecPath)) {
    try {
      frameNodeId = JSON.parse(readFileSync(oldSpecPath, "utf8")).$meta?.frame ?? null;
      frameName = JSON.parse(readFileSync(oldSpecPath, "utf8")).$meta?.frameName ?? null;
    } catch {
      /* ignore */
    }
  }
}

const spec = {
  $meta: {
    feature: featureId,
    frame: frameNodeId ?? "unknown",
    frameName: frameName ?? sections[0]?.name ?? featureId,
    figmaFile: figmaFileKey,
    generatedAt: new Date().toISOString().slice(0, 10),
    extractionMethod: "build-spec-from-cache (REST nodes/*.json only)",
    source: "figma-rest-files-nodes",
    figmaLastModified,
    cacheFiles: cacheFiles.length,
    note: "No legacy MCP spec.json content — derived solely from nodes/ cache.",
  },
  sections,
};

writeFileSync(specPath, JSON.stringify(spec, null, 2) + "\n", "utf8");

// ── component-checklist.md from spec tree ───────────────────────────────────
const checklistLines = [
  `# Figma Component Checklist — ${featureId}`,
  "Generated by build-spec-from-cache from nodes/*.json only. design-contract MUST cover every row in §2.",
  "",
];

function walkChecklist(node, indent = "") {
  if (node.nodeId) {
    const label = node.content
      ? `${node.name}  (content: ${String(node.content).slice(0, 60)})`
      : node.name;
    checklistLines.push(`${indent}- [ ] ${label}  (nodeId: ${node.nodeId})`);
  }
  for (const key of ["layers", "widgets", "columns", "banners"]) {
    for (const child of node[key] ?? []) walkChecklist(child, indent);
  }
}

for (const section of sections) {
  checklistLines.push(`## ${section.name} (nodeId: ${section.nodeId})`, "");
  walkChecklist(section, "");
  checklistLines.push("");
}

writeFileSync(checklistPath, checklistLines.join("\n"), "utf8");

console.log(`✓ build-spec-from-cache — ${featureId}`);
console.log(`  sections: ${sections.length} (from ${cacheFiles.length} cache file(s))`);
console.log(`  wrote:    ${specPath}`);
console.log(`  wrote:    ${checklistPath}`);
console.log(`  next:     npm run build:layout -- ${featureId}`);
