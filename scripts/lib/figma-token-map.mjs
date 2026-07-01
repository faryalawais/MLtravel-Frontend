/**
 * figma-token-map.mjs
 *
 * Maps Figma Variable IDs and figmaPath strings to DTCG token paths.
 * Used by enrich-registry-tokens.mjs after REST extract boundVariables land in spec.json.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const REST = "https://api.figma.com/v1";

/** @param {string} figmaPath e.g. "text/primary" */
export function normalizeFigmaPath(figmaPath) {
  return String(figmaPath).trim().replace(/^\/+/, "").toLowerCase();
}

/** Walk a DTCG tree; collect figmaPath → token path for primitive leaves. */
export function buildFigmaPathIndex(tokenTree, prefix = "") {
  /** @type {Map<string, string>} */
  const index = new Map();
  if (!tokenTree || typeof tokenTree !== "object") return index;

  for (const [key, value] of Object.entries(tokenTree)) {
    if (key.startsWith("$")) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && value.$type) {
      const fp = value.$extensions?.figmaPath;
      if (typeof fp === "string" && fp.trim()) {
        index.set(normalizeFigmaPath(fp), path);
      }
    } else if (value && typeof value === "object") {
      for (const [k, v] of buildFigmaPathIndex(value, path)) index.set(k, v);
    }
  }
  return index;
}

/** Walk semantics; map primitive alias targets → semantic token paths (prefer semantic). */
export function buildSemanticFromPrimitive(semantics) {
  /** @type {Map<string, string>} */
  const index = new Map();

  function walk(node, prefix = "") {
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      const path = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && value.$type) {
        const alias = value.$extensions?.aliasOf;
        if (typeof alias === "string") {
          const prim = alias.replace(/^\{|\}$/g, "").replace(/\./g, ".");
          if (!index.has(prim)) index.set(prim, path);
        }
      } else if (value && typeof value === "object") {
        walk(value, path);
      }
    }
  }

  walk(semantics);
  return index;
}

/**
 * Resolve a figmaPath or variable name to the best registry token path.
 * Prefers semantic over primitive when alias exists.
 */
export function resolveFigmaPathToToken(figmaPath, figmaPathIndex, semanticFromPrimitive) {
  const norm = normalizeFigmaPath(figmaPath);
  const primitive = figmaPathIndex.get(norm);
  if (!primitive) return null;
  return semanticFromPrimitive.get(primitive) ?? primitive;
}

/** Walk tokens/templates for $extensions.figma.variableId → semantic-ish token path. */
export function buildVariableIdFromTemplates() {
  /** @type {Map<string, string>} */
  const index = new Map();
  const templateFiles = [
    join(REPO_ROOT, "tokens", "templates", "primitives.json"),
    join(REPO_ROOT, "tokens", "templates", "semantics.json"),
  ];

  for (const file of templateFiles) {
    if (!existsSync(file)) continue;
    const tree = JSON.parse(readFileSync(file, "utf8"));
    walkTemplateVariableIds(tree, "", index);
  }
  return index;
}

function walkTemplateVariableIds(node, prefix, index) {
  if (!node || typeof node !== "object") return;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith("$")) {
      if (key === "$extensions" && value?.figma?.variableId) {
        /* handled on parent leaf */
      }
      continue;
    }
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && value.$type) {
      const varId = value.$extensions?.figma?.variableId;
      if (typeof varId === "string") index.set(varId, path);
    } else if (value && typeof value === "object") {
      walkTemplateVariableIds(value, path, index);
    }
  }
}

/** Fetch Figma local variables and build VariableID → figmaPath name map. */
export async function fetchFigmaVariableNames(fileKey) {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token || !fileKey) return { names: new Map(), apiError: null };

  const res = await fetch(`${REST}/files/${fileKey}/variables/local`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    let apiError = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) apiError = body.message;
    } catch {
      /* ignore */
    }
    return { names: new Map(), apiError };
  }

  const json = await res.json();
  /** @type {Map<string, string>} */
  const out = new Map();
  for (const [id, meta] of Object.entries(json.meta?.variables ?? {})) {
    if (meta?.name) out.set(id, meta.name);
  }
  return { names: out, apiError: null };
}

/**
 * Build or load tokens/build/figma-variable-index.json:
 *   { byVariableId: { "VariableID:…": "color.text.primary" }, byFigmaPath: { … } }
 */
export async function loadOrBuildVariableIndex({ fileKey, refresh = false } = {}) {
  const outPath = join(REPO_ROOT, "tokens", "build", "figma-variable-index.json");
  if (!refresh && existsSync(outPath)) {
    try {
      return JSON.parse(readFileSync(outPath, "utf8"));
    } catch {
      /* rebuild */
    }
  }

  const primitives = JSON.parse(readFileSync(join(REPO_ROOT, "tokens", "primitives.json"), "utf8"));
  const semantics = JSON.parse(readFileSync(join(REPO_ROOT, "tokens", "semantics.json"), "utf8"));
  const figmaPathIndex = buildFigmaPathIndex(primitives);
  const semanticFromPrimitive = buildSemanticFromPrimitive(semantics);

  /** @type {Record<string, string>} */
  const byFigmaPath = {};
  for (const [fp, prim] of figmaPathIndex) {
    byFigmaPath[fp] = semanticFromPrimitive.get(prim) ?? prim;
  }

  /** @type {Record<string, string>} */
  const byVariableId = {};

  // Templates Studio export (variableId on template leaves — partial overlap with live file).
  for (const [varId, path] of buildVariableIdFromTemplates()) {
    byVariableId[varId] = path;
  }

  const key = fileKey ?? process.env.FIGMA_FILE_KEY;
  const { names: varNames, apiError } = await fetchFigmaVariableNames(key);
  for (const [varId, name] of varNames) {
    const token = resolveFigmaPathToToken(name, figmaPathIndex, semanticFromPrimitive);
    if (token) byVariableId[varId] = token;
  }

  const index = {
    generatedAt: new Date().toISOString(),
    figmaFileKey: key ?? null,
    byVariableId,
    byFigmaPath,
    ...(apiError ? { apiWarning: `Figma /variables/local: ${apiError}. Add file_variables:read to FIGMA_ACCESS_TOKEN for full boundVariables mapping.` } : {}),
  };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(index, null, 2) + "\n", "utf8");
  return index;
}

/**
 * Map REST boundVariables on a Figma node to registry $tokens slots.
 * @param {object} boundVariables
 * @param {{ byVariableId: Record<string,string> }} variableIndex
 */
export function boundVariablesToTokens(boundVariables, variableIndex) {
  if (!boundVariables || typeof boundVariables !== "object") return {};

  /** @param {unknown} entry */
  function resolveAlias(entry) {
    if (!entry || typeof entry !== "object") return null;
    if (entry.type === "VARIABLE_ALIAS" && typeof entry.id === "string") {
      return variableIndex.byVariableId?.[entry.id] ?? null;
    }
    return null;
  }

  /** @type {Record<string, string>} */
  const tokens = {};

  const fill = boundVariables.fills?.[0] ?? boundVariables.fill;
  const fillToken = resolveAlias(fill);
  if (fillToken) tokens.$background = fillToken;

  const stroke = boundVariables.strokes?.[0] ?? boundVariables.stroke;
  const strokeToken = resolveAlias(stroke);
  if (strokeToken) tokens.$border = strokeToken;

  const radius = boundVariables.cornerRadius ?? boundVariables.topLeftRadius;
  const radiusToken = resolveAlias(radius);
  if (radiusToken) tokens.$radius = radiusToken;

  const gap = boundVariables.itemSpacing;
  const gapToken = resolveAlias(gap);
  if (gapToken) tokens.$spacing = gapToken;

  const paddingL = boundVariables.paddingLeft;
  const padToken = resolveAlias(paddingL);
  if (padToken) tokens.$spacing = padToken;

  return tokens;
}
