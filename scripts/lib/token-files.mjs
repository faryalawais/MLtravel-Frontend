import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, "../..");

export const ACTIVE_FILES = [
  { label: "primitives", path: join(ROOT, "tokens/primitives.json"), expectLayer: "primitive" },
  { label: "semantics", path: join(ROOT, "tokens/semantics.json"), expectLayer: "semantic" },
  { label: "typography", path: join(ROOT, "tokens/typography.json"), expectLayer: "semantic" },
];

export function loadActiveFiles() {
  const loaded = [];
  for (const f of ACTIVE_FILES) {
    if (!existsSync(f.path)) {
      loaded.push({ ...f, data: null, leaves: [], error: `missing ${f.path}` });
      continue;
    }
    try {
      const data = JSON.parse(readFileSync(f.path, "utf8"));
      const leaves = [];
      walkLeaves(data, [], leaves);
      loaded.push({ ...f, data, leaves, error: null });
    } catch (e) {
      loaded.push({ ...f, data: null, leaves: [], error: e.message });
    }
  }
  return loaded;
}

export function walkLeaves(obj, path, out) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
  if (obj.$value !== undefined && obj.$type !== undefined) {
    out.push({ path: path.join("."), token: obj });
    return;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("$")) continue;
    walkLeaves(v, [...path, k], out);
  }
}

export function totalLeaves(loaded) {
  return loaded.reduce((n, f) => n + f.leaves.length, 0);
}

export function isEmptyPlaceholder(loaded) {
  return totalLeaves(loaded) === 0;
}
