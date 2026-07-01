/**
 * figma-extract-lib.mjs
 *
 * Shared helpers for the single-MCP-session extraction pipeline
 * (docs/figma-single-pass-extract-plan.md §11 Phase 3, Appendix A).
 *
 * NOT a runnable script — imported by:
 *   - scripts/figma-extract-driver.mjs  (the ONE MCP session)
 *   - scripts/figma-export-image.mjs    (REST screenshots + assets)
 *
 * Everything here is pure / offline (no MCP, no network). The two concerns it
 * owns are (a) resolving the slice-root nodeIds a feature must extract and
 * (b) parsing the get_metadata XML into a tree so the chunking algorithm (A.3)
 * can size subtrees and recurse without extra MCP calls.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

// ── Node-id helpers ───────────────────────────────────────────────────────────

/**
 * Normalise a Figma node id to the canonical colon form.
 * Accepts "394-8951" (URL form) → "394:8951". Instance ids ("I394:9911;391:6789")
 * are returned unchanged.
 */
export function normalizeId(id) {
  if (typeof id !== "string") return id;
  const s = id.trim();
  if (/^\d+-\d+$/.test(s)) return s.replace("-", ":");
  return s;
}

/** Accept string nodeId or `{ nodeId, name?, source? }` from slice-roots.json. */
export function sliceRootId(entry) {
  if (typeof entry === "string") return normalizeId(entry);
  if (entry && typeof entry === "object" && typeof entry.nodeId === "string") {
    return normalizeId(entry.nodeId);
  }
  return null;
}

/**
 * Filesystem-safe cache file stem for a node id.
 *   "394:9911"            → "394-9911"
 *   "I403:4515;399:4142"  → "I403-4515-399-4142"
 * The original id is always re-recorded in the cache file's $meta.nodeId, so
 * this transform never has to be reversed.
 */
export function cacheStem(nodeId) {
  return String(nodeId).replace(/[:;]/g, "-");
}

/**
 * The top-level instance root a node belongs to, if it is an instance-scoped id.
 *   "I403:4515;399:4142" → "403:4515"
 * Returns null for a plain id.
 */
export function instanceRootOf(id) {
  const m = /^I(\d+[:-]\d+);/.exec(String(id));
  return m ? normalizeId(m[1]) : null;
}

// ── ui-registry.json — collect every $figmaNode binding ───────────────────────

/**
 * Walk ui-registry.json and collect every `$figmaNode` value into a Set.
 * These are the nodes a feature actually consumes — the basis for deciding
 * which top-level frame sections are in scope (a slice-root).
 */
export function collectRegistryFigmaNodes(registry) {
  const out = new Set();
  (function walk(node) {
    if (!node || typeof node !== "object") return;
    if (typeof node.$figmaNode === "string") out.add(node.$figmaNode.trim());
    for (const [k, v] of Object.entries(node)) {
      if (k === "$figmaNode") continue;
      walk(v);
    }
  })(registry);
  return out;
}

// ── get_metadata XML → node tree ──────────────────────────────────────────────

/**
 * Parse the XML returned by the Figma MCP `get_metadata` tool into a tree.
 *
 * The format is a nested set of element tags (frame / instance / text / vector /
 * group …) each carrying `id`, `name`, `x`, `y`, `width`, `height` attributes.
 * We only need ids, names, geometry and nesting, so a lightweight tag-stack
 * tokenizer is sufficient (and avoids adding an XML dependency).
 *
 * Returns an array of root nodes:
 *   { id, type, name, x, y, width, height, children: [...] }
 */
export function parseMetadataXml(xml) {
  const roots = [];
  const stack = [];
  const tagRe = /<(\/)?([A-Za-z][\w:-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/)?>/g;
  let m;
  while ((m = tagRe.exec(xml)) !== null) {
    const [, closing, tagName, attrStr, selfClose] = m;

    if (closing) {
      stack.pop();
      continue;
    }

    const attrs = {};
    const aRe = /([\w:-]+)="([^"]*)"/g;
    let a;
    while ((a = aRe.exec(attrStr)) !== null) attrs[a[1]] = a[2];

    const node = {
      id: attrs.id ? normalizeId(attrs.id) : null,
      type: tagName,
      name: attrs.name ?? null,
      x: numOrNull(attrs.x),
      y: numOrNull(attrs.y),
      width: numOrNull(attrs.width),
      height: numOrNull(attrs.height),
      children: [],
    };

    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(node);
    else roots.push(node);

    if (!selfClose) stack.push(node);
  }
  return roots;
}

function numOrNull(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Depth-first search for the node whose id matches `targetId`. */
export function findNodeById(roots, targetId) {
  const want = normalizeId(targetId);
  const stack = [...roots];
  while (stack.length) {
    const n = stack.pop();
    if (n.id === want) return n;
    if (n.children) stack.push(...n.children);
  }
  return null;
}

/** All descendant ids of a node (excluding the node itself, ignoring null ids). */
export function descendantIds(node) {
  const out = new Set();
  const stack = [...(node.children ?? [])];
  while (stack.length) {
    const n = stack.pop();
    if (n.id) out.add(n.id);
    if (n.children) stack.push(...n.children);
  }
  return out;
}

/** Total node count of a subtree (the node + every descendant). The chunking
 * budget (A.3 MAX_SUBTREE_NODES) is measured against this. */
export function subtreeNodeCount(node) {
  let count = 1;
  for (const c of node.children ?? []) count += subtreeNodeCount(c);
  return count;
}

// ── Slice-root resolution ─────────────────────────────────────────────────────

/**
 * Resolve the slice-root nodeIds for a feature (docs §12, Appendix A.1/B).
 *
 * Precedence (first match wins):
 *   1. explicitNodes      — caller passed --nodes a,b,c (or a refresh list).
 *   2. slice-roots.json    — committed list at features/<id>/figma/slice-roots.json
 *                            ({ "sliceRoots": ["394:9911", ...] }).
 *   3. derived from ui-registry $figmaNode bindings projected onto the frame's
 *      top-level children: a top-level section is a slice-root iff it (or any
 *      of its descendants) is a node the feature registered. This deterministically
 *      drops shared chrome (Nav/Footer) and out-of-scope sections (Related
 *      Products) — they carry no registered node — and keeps the in-scope
 *      sections, each small by construction.
 *
 * Returns [{ nodeId, name, source }].
 */
export function resolveSliceRoots({
  repoRoot,
  featureId,
  frameNode,
  registryNodes,
  explicitNodes,
}) {
  if (explicitNodes && explicitNodes.length) {
    return explicitNodes.map((nodeId) => ({
      nodeId: normalizeId(nodeId),
      name: nameFor(frameNode, nodeId),
      source: "explicit",
    }));
  }

  const sliceRootsFile = join(repoRoot, "features", featureId, "figma", "slice-roots.json");
  if (existsSync(sliceRootsFile)) {
    try {
      const parsed = JSON.parse(readFileSync(sliceRootsFile, "utf8"));
      const ids = parsed.sliceRoots ?? parsed.nodes ?? [];
      if (Array.isArray(ids) && ids.length) {
        return ids
          .map((entry) => {
            const nodeId = sliceRootId(entry);
            if (!nodeId) return null;
            const name =
              entry && typeof entry === "object" && entry.name
                ? entry.name
                : nameFor(frameNode, nodeId);
            const source =
              entry && typeof entry === "object" && entry.source
                ? entry.source
                : "slice-roots.json";
            return { nodeId, name, source };
          })
          .filter(Boolean);
      }
    } catch {
      /* fall through to derivation */
    }
  }

  if (!frameNode) {
    throw new Error(
      "Cannot derive slice-roots: get_metadata returned no frame node. " +
        "Pass --nodes explicitly or add features/<id>/figma/slice-roots.json.",
    );
  }

  const candidates = frameNode.children ?? [];
  const reg = registryNodes ?? new Set();
  // Pre-compute the instance-roots referenced by the registry so a section whose
  // children are exposed only as instance ids (e.g. tabs: I403:4515;…) still maps.
  const regInstanceRoots = new Set();
  for (const id of reg) {
    const root = instanceRootOf(id);
    if (root) regInstanceRoots.add(root);
  }

  const out = [];
  for (const section of candidates) {
    if (!section.id) continue;
    const desc = descendantIds(section);
    let inScope = false;

    // (a) the section node itself is registered
    if (reg.has(section.id)) inScope = true;

    // (b) a registered plain id lives inside this section
    if (!inScope) {
      for (const id of reg) {
        if (desc.has(id)) {
          inScope = true;
          break;
        }
      }
    }

    // (c) a registered instance id is rooted at this section (or a descendant)
    if (!inScope) {
      for (const root of regInstanceRoots) {
        if (root === section.id || desc.has(root)) {
          inScope = true;
          break;
        }
      }
    }

    if (inScope) {
      out.push({ nodeId: section.id, name: section.name, source: "ui-registry" });
    }
  }

  if (out.length === 0) {
    throw new Error(
      `No slice-roots resolved for ${featureId}: none of the frame's ${candidates.length} ` +
        `top-level sections contain a ui-registry $figmaNode binding. ` +
        `Run ui-registry-build with $figmaNode bindings, or pass --nodes / slice-roots.json.`,
    );
  }
  return out;
}

function nameFor(frameNode, nodeId) {
  if (!frameNode) return null;
  const n = findNodeById([frameNode], nodeId);
  return n?.name ?? null;
}

// ── Figma file key ────────────────────────────────────────────────────────────

/** Extract the Figma file key from a /design/<key>/ URL. */
export function fileKeyFromUrl(url) {
  if (typeof url !== "string") return null;
  const m = /\/design\/([A-Za-z0-9]+)\//.exec(url);
  return m ? m[1] : null;
}

/**
 * Best-effort resolution of the Figma file key for a feature:
 *   env FIGMA_FILE_KEY  →  spec.json $meta.figmaUrl.
 */
export function resolveFileKey({ repoRoot, featureId }) {
  if (featureId) {
    const nodesDir = join(repoRoot, "features", featureId, "figma", "nodes");
    if (existsSync(nodesDir)) {
      try {
        for (const file of readdirSync(nodesDir).filter((f) => f.endsWith(".json"))) {
          const payload = JSON.parse(readFileSync(join(nodesDir, file), "utf8"));
          if (payload.$meta?.figmaFileKey) return payload.$meta.figmaFileKey;
        }
      } catch {
        /* ignore */
      }
    }
    const specPath = join(repoRoot, "features", featureId, "figma", "spec.json");
    if (existsSync(specPath)) {
      try {
        const spec = JSON.parse(readFileSync(specPath, "utf8"));
        if (spec.$meta?.figmaFile) return spec.$meta.figmaFile;
        const key = fileKeyFromUrl(spec.$meta?.figmaUrl);
        if (key) return key;
      } catch {
        /* ignore */
      }
    }
  }
  if (process.env.FIGMA_FILE_KEY) return process.env.FIGMA_FILE_KEY;
  return null;
}
