#!/usr/bin/env node
/**
 * Strict W3C DTCG validation — run only when active token files have content.
 * Empty {} placeholders are skipped (awaiting figma-extract).
 *
 *   npm run tokens:dtcg-lint
 *   npm run tokens:validate:test   # DTCG only, allows scaffold source for shape tests
 */
import {
  ACTIVE_FILES,
  loadActiveFiles,
  isEmptyPlaceholder,
  totalLeaves,
} from "./lib/token-files.mjs";

const TEST_MODE = process.argv.includes("--test") || process.env.TOKENS_VALIDATE_TEST === "1";
const FORCE = process.argv.includes("--force");

const VALID_TYPES = new Set([
  "color", "dimension", "fontFamily", "fontWeight", "number", "duration", "shadow", "typography", "cubicBezier",
]);

/** Tailwind-style keys: 0.5, px, 2xl, 9xl, 2xs, inverse-muted, colorDark */
const SEGMENT = /^(\d+(\.\d+)?|px|\d+[a-z][a-z0-9]*|[a-z][a-zA-Z0-9]*(-[a-z0-9]+)*)$/;
const HEX_STRING = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const LEGACY_DIM = /^\d+(\.\d+)?(px|rem|em|%)$/;

const TYPO_SUB_KEYS = new Set(["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"]);

const REQUIRED_SEMANTIC_PREFIXES = [
  "color.surface.", "color.text.", "color.border.",
  "color.action.primary.", "color.action.secondary.", "color.action.tertiary.", "color.action.danger.",
  "color.input.", "color.feedback.success.", "color.feedback.warning.", "color.feedback.error.", "color.feedback.info.",
  "color.focus.", "space.", "radius.", "shadow.",
  "typography.display.", "typography.heading.", "typography.body.", "typography.label.",
];

const errors = [];
const tokenMap = new Map();
const pathsSeen = new Set();

function isAlias(v) {
  return typeof v === "string" && /^\{[a-zA-Z0-9_.-]+\}$/.test(v);
}

function isDtcgColor(v) {
  return (
    v && typeof v === "object" &&
    typeof v.colorSpace === "string" &&
    Array.isArray(v.components) && v.components.length >= 3 &&
    typeof v.alpha === "number"
  );
}

function isDtcgDimension(v) {
  return v && typeof v === "object" && typeof v.value === "number" && typeof v.unit === "string";
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isDtcgShadow(v) {
  if (!v || typeof v !== "object") return false;
  return ["offsetX", "offsetY", "blur", "spread"].every((k) => !v[k] || isDtcgDimension(v[k]));
}

function rejectLegacyValue(val, dotPath, fileLabel) {
  if (typeof val === "string") {
    if (HEX_STRING.test(val)) {
      errors.push(`${fileLabel}: ${dotPath} — hex string forbidden; use DTCG color object`);
      return true;
    }
    if (LEGACY_DIM.test(val)) {
      errors.push(`${fileLabel}: ${dotPath} — legacy dimension string forbidden; use { value, unit }`);
      return true;
    }
  }
  return false;
}

function lintSegment(key, dotPath, fileLabel) {
  if (key.startsWith("$")) return;
  if (dotPath.startsWith("font.lineHeight.") || dotPath.startsWith("font.letterSpacing.")) return;
  if (!SEGMENT.test(key)) {
    errors.push(`${fileLabel}: key "${key}" at "${dotPath}" — invalid path segment`);
  }
}

function walk(obj, path, fileLabel, expectLayer) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;

  if (obj.$value !== undefined && obj.$type !== undefined) {
    const dotPath = path.join(".");
    if (pathsSeen.has(dotPath)) {
      errors.push(`${fileLabel}: duplicate token path "${dotPath}"`);
    }
    pathsSeen.add(dotPath);

    const layer = obj.$extensions?.layer;
    if (!VALID_TYPES.has(obj.$type)) {
      errors.push(`${fileLabel}: ${dotPath} — invalid $type "${obj.$type}"`);
    }
    if (layer !== expectLayer) {
      errors.push(`${fileLabel}: ${dotPath} — $extensions.layer must be "${expectLayer}"`);
    }
    if (!obj.$extensions || typeof obj.$extensions !== "object") {
      errors.push(`${fileLabel}: ${dotPath} — missing $extensions`);
    }

    rejectLegacyValue(obj.$value, dotPath, fileLabel);

    if (fileLabel === "primitives") {
      if (isAlias(obj.$value)) {
        errors.push(`${fileLabel}: ${dotPath} — primitives must not use alias $value`);
      }
      if (obj.$type === "color" && typeof obj.$value === "object" && isDtcgColor(obj.$value)) {
        if (obj.$value.colorSpace !== "srgb") {
          errors.push(`${fileLabel}: ${dotPath} — colorSpace must be "srgb" for web tokens`);
        }
        for (const c of obj.$value.components) {
          if (typeof c !== "number" || c < 0 || c > 1) {
            errors.push(`${fileLabel}: ${dotPath} — color components must be 0..1`);
            break;
          }
        }
      }
      if (obj.$type === "dimension" && isDtcgDimension(obj.$value) && obj.$value.unit !== "px") {
        errors.push(`${fileLabel}: ${dotPath} — dimension unit must be "px" in this pipeline`);
      }
    }

    if (fileLabel === "semantics" && obj.$type !== "typography" && !isAlias(obj.$value)) {
      errors.push(`${fileLabel}: ${dotPath} — semantic leaf must be alias {group.token}`);
    }

    if (obj.$type === "typography" && obj.$value && typeof obj.$value === "object") {
      for (const [sub, val] of Object.entries(obj.$value)) {
        if (!TYPO_SUB_KEYS.has(sub)) {
          errors.push(`${fileLabel}: ${dotPath}.${sub} — unknown typography sub-property`);
        }
        if (!isAlias(val)) {
          errors.push(`${fileLabel}: ${dotPath}.${sub} — must alias a primitive (e.g. "{font.size.md}")`);
        }
        rejectLegacyValue(val, `${dotPath}.${sub}`, fileLabel);
      }
    }

    tokenMap.set(dotPath, { ...obj, fileLabel });
    return;
  }

  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    lintSegment(key, path.length ? `${path.join(".")}.${key}` : key, fileLabel);
    walk(val, [...path, key], fileLabel, expectLayer);
  }
}

function resolveAlias(ref, seen = new Set()) {
  const m = ref.match(/^\{(.+)\}$/);
  if (!m) return { ok: false, reason: "not an alias" };
  const p = m[1];
  if (seen.has(p)) return { ok: false, reason: `circular alias at ${p}` };
  seen.add(p);
  const tok = tokenMap.get(p);
  if (!tok) return { ok: false, reason: `unresolved ${p}` };
  if (isAlias(tok.$value)) return resolveAlias(tok.$value, seen);
  return { ok: true, target: tok };
}

const loaded = loadActiveFiles();
for (const { label, error } of loaded) {
  if (error) errors.push(`${label}: ${error}`);
}

if (!FORCE && isEmptyPlaceholder(loaded)) {
  console.log("SKIP: tokens:dtcg-lint — active token files are empty (awaiting figma-extract).");
  process.exit(0);
}

for (const { label, expectLayer } of ACTIVE_FILES) {
  const entry = loaded.find((f) => f.label === label);
  if (!entry?.data) continue;
  if (entry.data.$description) {
    errors.push(`${label}: top-level $description forbidden`);
  }
  walk(entry.data, [], label, expectLayer);
}

for (const [dotPath, tok] of tokenMap) {
  const check = (val, ctx) => {
    if (isAlias(val)) {
      const r = resolveAlias(val);
      if (!r.ok) errors.push(`Alias ${dotPath}${ctx ? `.${ctx}` : ""}: ${r.reason}`);
      else if (r.target && tok.$type !== "typography") {
        const prim = r.target;
        if (tok.$type && prim.$type && tok.$type !== prim.$type) {
          errors.push(`Alias ${dotPath}: $type ${tok.$type} ≠ target ${prim.$type}`);
        }
      }
    }
  };
  check(tok.$value);
  if (tok.$type === "typography" && tok.$value && typeof tok.$value === "object") {
    for (const [k, sub] of Object.entries(tok.$value)) check(sub, k);
  }
}

const allSemantic = [...tokenMap.entries()]
  .filter(([, t]) => t.$extensions?.layer === "semantic")
  .map(([p]) => p);

for (const prefix of REQUIRED_SEMANTIC_PREFIXES) {
  if (!allSemantic.some((p) => p.startsWith(prefix))) {
    errors.push(`Missing required semantic group: ${prefix}*`);
  }
}

const primCount = [...tokenMap.values()].filter((t) => t.$extensions?.layer === "primitive").length;
if (primCount < 10) {
  errors.push(`primitives: only ${primCount} leaves — export incomplete`);
}

console.log(`DTCG strict validation${TEST_MODE ? " (test mode)" : ""}`);
console.log(`  Total leaves: ${totalLeaves(loaded)}`);

if (errors.length) {
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error(`\n✗ tokens:dtcg-lint — ${errors.length} error(s)`);
  process.exit(1);
}

console.log("✔ tokens:dtcg-lint — PASS (no DTCG violations)");
process.exit(0);
