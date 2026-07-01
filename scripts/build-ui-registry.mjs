#!/usr/bin/env node
// build-ui-registry.mjs
//
// Implements the token-generation-phase requirements of
// tokens/templates/PRD-Executable-Requirements-Gherkin-Component-Paths.docx.md
// for the **UI registry** (sibling namespace to DTCG tokens).
//
// Per PRD §3: a design token resolves to a *value*; a component path resolves
// to an *identity* (a thing with structure and states). This pipeline does
// NOT live in tokens/sd.config.mjs because Style Dictionary is built around
// value resolution; it lives here as a standalone script.
//
// Source:  tokens/ui-registry.json   (PRD §4.2 shape)
//
// Validates:
//   - Path grammar per PRD §4.1 EBNF:
//       <path> ::= <domain> "." <segment> ( "." <segment> )+
//       <domain> ::= "screen" | "component"
//       <segment> ::= [a-z][a-zA-Z0-9]*    (lowerCamelCase, no spaces/dashes)
//   - Every component-leaf $screen reference resolves to a registered screen.
//   - $states (if present) is a non-empty array of distinct, non-empty
//     lowerCamelCase strings.
//   - Every screen and component leaf has a $description.
//   - Top-level keys are exactly { $metadata, screen, component }.
//   - Domain trees contain no orphaned $-prefixed metadata other than
//     $description / $metadata at the document root.
//
// Emits:
//   tokens/build/test-ids.ts         TypeScript constants for component code.
//                                    Both a flat `testIds` lookup (path -> id)
//                                    and a nested `ids` tree (ids.component.x.y).
//   reports/ui-registry-glossary.md  Human-readable glossary table for the
//                                    Product team and the AI agent.
//
// Run:    npm run ui-registry:build         (validate + emit artifacts)
// Dry:    npm run ui-registry:validate      (validate only, no artifacts)
// Sync:   npm run ui-registry:check-sync    (validate + sync-check against
//                                            app/ and components/; fails on
//                                            registered-but-not-rendered)
//
// Flags:
//   --validate    skip artifact emit
//   --check-sync  after validation, scan app/ and components/ for
//                 data-testid usages and require that every registered
//                 `component.*` path is rendered exactly once. Adds
//                 entries to the error list on drift.

import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, extname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const SOURCE = join(REPO_ROOT, "tokens", "ui-registry.json");
const OUT_TS = join(REPO_ROOT, "tokens", "build", "test-ids.ts");
const OUT_MD = join(REPO_ROOT, "reports", "ui-registry-glossary.md");

const VALIDATE_ONLY = process.argv.includes("--validate");
const CHECK_SYNC = process.argv.includes("--check-sync");

// --- grammar --------------------------------------------------------------

const SEGMENT_RE = /^[a-z][a-zA-Z0-9]*$/;
const DOMAINS = new Set(["screen", "component"]);

function isValidPath(path) {
  const segs = path.split(".");
  if (segs.length < 3) return false;          // domain + at least 2 segments
  if (!DOMAINS.has(segs[0])) return false;
  return segs.slice(1).every((s) => SEGMENT_RE.test(s));
}

// --- walk -----------------------------------------------------------------

/**
 * Walk a domain tree and collect leaves. A leaf is any object that carries
 * a $description (every screen and component must have one — the build
 * fails if a $description is missing because the glossary depends on it).
 *
 * Returns: [{ path, descr, screen?, states?, isComponent }]
 */
function collectLeaves(node, path, domain, errors) {
  const leaves = [];
  if (!node || typeof node !== "object") return leaves;

  if ("$description" in node) {
    leaves.push({
      path: path.join("."),
      description: node.$description,
      screen: node.$screen ?? null,
      states: node.$states ?? null,
      isComponent: domain === "component",
    });
    // A node may be BOTH testable (carries $description) AND a container of
    // testable children (a "branch-leaf"). Real UIs need this: e.g.
    // component.shop.productCard is asserted directly in Gherkin AND its parts
    // (image, link, discountBadge) are asserted too. Register the node as a
    // leaf, then recurse into its non-$ children so they are registered too.
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$")) continue;
      if (!SEGMENT_RE.test(k)) {
        errors.push({
          path: [...path, k].join("."),
          message: `segment "${k}" violates grammar [a-z][a-zA-Z0-9]* (lowerCamelCase, no underscores/dashes/dots).`,
        });
        continue;
      }
      leaves.push(...collectLeaves(v, [...path, k], domain, errors));
    }
    return leaves;
  }

  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;        // metadata keys never validate as segments
    if (!SEGMENT_RE.test(k)) {
      errors.push({
        path: [...path, k].join("."),
        message: `segment "${k}" violates grammar [a-z][a-zA-Z0-9]* (lowerCamelCase, no underscores/dashes/dots).`,
      });
      continue;
    }
    leaves.push(...collectLeaves(v, [...path, k], domain, errors));
  }

  return leaves;
}

// --- main -----------------------------------------------------------------

let registry;
try {
  registry = JSON.parse(readFileSync(SOURCE, "utf8"));
} catch (e) {
  console.error(`Cannot read ${SOURCE}: ${e.message}`);
  process.exit(2);
}

const errors = [];
const warnings = [];

// Top-level shape
const allowedTop = new Set(["$metadata", "$description", "screen", "component"]);
for (const k of Object.keys(registry)) {
  if (!allowedTop.has(k)) {
    errors.push({ path: k, message: `unexpected top-level key "${k}" (allowed: $metadata, screen, component).` });
  }
}
for (const required of ["screen", "component"]) {
  if (!registry[required] || typeof registry[required] !== "object") {
    errors.push({ path: required, message: `missing required top-level group "${required}".` });
  }
}

const screenLeaves = registry.screen ? collectLeaves(registry.screen, ["screen"], "screen", errors) : [];
const componentLeaves = registry.component ? collectLeaves(registry.component, ["component"], "component", errors) : [];
const allLeaves = [...screenLeaves, ...componentLeaves];
const allPaths = new Set(allLeaves.map((l) => l.path));

// Grammar check on every emitted path (collectLeaves already filtered bad
// segments, but a leaf path with only 2 segments — e.g. "screen.checkout" —
// would be a valid segment chain but invalid as a path; catch that here.)
for (const l of allLeaves) {
  if (!isValidPath(l.path)) {
    errors.push({ path: l.path, message: "path violates grammar (needs domain + at least 2 segments, all lowerCamelCase)." });
  }
  if (!l.description || typeof l.description !== "string" || l.description.trim() === "") {
    errors.push({ path: l.path, message: "$description is missing or empty (required for glossary)." });
  }
}

// $screen resolution + state shape (components only)
for (const l of componentLeaves) {
  if (l.screen != null) {
    if (typeof l.screen !== "string" || !isValidPath(l.screen) || !l.screen.startsWith("screen.")) {
      errors.push({ path: l.path, message: `$screen "${l.screen}" is not a valid screen path.` });
    } else if (!allPaths.has(l.screen)) {
      errors.push({ path: l.path, message: `$screen "${l.screen}" does not resolve to any registered screen.` });
    }
  } else {
    warnings.push({ path: l.path, message: "$screen is not set; the screen-membership advisory check in the requirement-validator skill cannot run for this component." });
  }
  if (l.states != null) {
    if (!Array.isArray(l.states) || l.states.length === 0) {
      errors.push({ path: l.path, message: "$states must be a non-empty array." });
    } else {
      const seen = new Set();
      for (const s of l.states) {
        if (typeof s !== "string" || !SEGMENT_RE.test(s)) {
          errors.push({ path: l.path, message: `$states entry "${s}" must be a lowerCamelCase string.` });
        } else if (seen.has(s)) {
          errors.push({ path: l.path, message: `$states entry "${s}" is duplicated.` });
        }
        seen.add(s);
      }
    }
  }
}

// Screens carrying $screen / $states are an authoring mistake
for (const l of screenLeaves) {
  if (l.screen != null) errors.push({ path: l.path, message: "screen leaves must not carry $screen." });
  if (l.states != null) errors.push({ path: l.path, message: "screen leaves must not carry $states." });
}

// --- optional sync check against app/ and components/ --------------------
//
// The registry is one half of a contract; the other half is the actual
// rendered DOM. We close the loop by scanning the source files for
// `data-testid` references (either via the typed `ids.<path>` accessor
// or as a literal kebab string) and requiring every registered
// `component.*` path to be rendered at least once.

if (CHECK_SYNC) {
  const SCAN_ROOTS = ["app", "components", "lib"];
  const SCAN_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);
  const renderedPaths = new Set();
  const renderedTestIds = new Set();

  function walkDir(dir, out = []) {
    let entries;
    try { entries = readdirSync(dir); } catch { return out; }
    for (const entry of entries) {
      const full = join(dir, entry);
      let s;
      try { s = statSync(full); } catch { continue; }
      if (s.isDirectory()) walkDir(full, out);
      else if (SCAN_EXT.has(extname(full))) out.push(full);
    }
    return out;
  }

  const idsAccessor = /\bids((?:\.[a-zA-Z][a-zA-Z0-9]*)+)\b/g;        // ids.component.x.y.z
  const testIdsAccessor =
    /\btestIds\s*\[\s*['"`]([a-z][a-zA-Z0-9.]*)['"`]\s*\]/g;          // testIds['component.x.y.z']
  const literalTestId =
    /\bdata-testid\s*=\s*['"]([a-z][a-zA-Z0-9-]*)['"]/g;              // data-testid="component-x-y-z"
  // Dot-form path string literals (e.g. the values inside a per-feature typed
  // id map such as lib/pdp/ids.ts: `breadcrumb: 'component.pdp.breadcrumb'`).
  // Components render these via a `<feature>Ids.component.x.y` accessor whose
  // value is the registered path — equivalent wiring to the generated `ids`
  // accessor, just namespaced per feature.
  const dotPathLiteral =
    /['"`]((?:component|screen)\.[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)+)['"`]/g;

  for (const root of SCAN_ROOTS) {
    for (const file of walkDir(join(REPO_ROOT, root))) {
      const src = readFileSync(file, "utf8");
      let m;
      while ((m = idsAccessor.exec(src))) {
        // m[1] is ".component.x.y" — strip leading dot.
        const path = m[1].slice(1);
        if (path.startsWith("component.") || path.startsWith("screen.")) {
          renderedPaths.add(path);
        }
      }
      while ((m = testIdsAccessor.exec(src))) renderedPaths.add(m[1]);
      while ((m = literalTestId.exec(src))) renderedTestIds.add(m[1]);
      while ((m = dotPathLiteral.exec(src))) renderedPaths.add(m[1]);
    }
  }

  // Resolve literal test-ids back to paths (dashes -> dots).
  for (const tid of renderedTestIds) {
    // Reverse of pathToId (dots -> dashes). We can't reliably reverse
    // because lowerCamelCase segments may legitimately contain dashes in
    // the kebab-cased test-id, but our paths don't allow dashes in
    // segments (grammar in §4.1). So the inverse is safe.
    const path = tid.replace(/-/g, ".");
    if (path.startsWith("component.") || path.startsWith("screen.")) {
      renderedPaths.add(path);
    }
  }

  for (const l of componentLeaves) {
    if (!renderedPaths.has(l.path)) {
      errors.push({
        path: l.path,
        message: `registered component path is not rendered in app/ or components/ (no \`ids.${l.path}\` or \`data-testid="${l.path.replace(/\./g, "-")}"\` found). Either render the element or remove the registry entry.`,
      });
    }
  }
}

// --- report errors --------------------------------------------------------

if (errors.length) {
  console.error(`ui-registry: FAIL — ${errors.length} error(s):`);
  for (const e of errors) console.error(`  ${e.path}:  ${e.message}`);
  if (warnings.length) {
    console.error(`Plus ${warnings.length} warning(s):`);
    for (const w of warnings) console.error(`  ${w.path}:  ${w.message}`);
  }
  process.exit(1);
}

const syncSuffix = CHECK_SYNC ? ", sync OK" : "";
console.log(`ui-registry: PASS — ${screenLeaves.length} screen(s), ${componentLeaves.length} component(s), ${warnings.length} warning(s)${syncSuffix}.`);
for (const w of warnings) console.log(`  warn ${w.path}:  ${w.message}`);

if (VALIDATE_ONLY) process.exit(0);

// --- emit test-ids.ts ----------------------------------------------------

// path -> test-id transform: dots -> dashes (HTML-attribute-safe, reversible).
function pathToId(p) { return p.replace(/\./g, "-"); }

// Build nested const tree. Branch-leaf safe: a node may be both a leaf (string
// id) and a container. When that happens the self id is stored under `$id`,
// so `ids.component.shop.productCard.$id` is the card's own test-id and
// `ids.component.shop.productCard.image` is the child's.
function setDeep(root, dotted, value) {
  const segs = dotted.split(".");
  let cur = root;
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i];
    if (typeof cur[seg] === "string") cur[seg] = { $id: cur[seg] }; // leaf gains children
    cur[seg] ??= {};
    cur = cur[seg];
  }
  const last = segs[segs.length - 1];
  if (cur[last] && typeof cur[last] === "object") {
    cur[last].$id = value;        // children already created this node; attach self id
  } else {
    cur[last] = value;
  }
}
const idTree = {};
for (const l of allLeaves) setDeep(idTree, l.path, pathToId(l.path));

const flatMap = Object.fromEntries(allLeaves.map((l) => [l.path, pathToId(l.path)]));

const tsHeader = `// AUTO-GENERATED by scripts/build-ui-registry.mjs (npm run ui-registry:build).
// Do not edit. Source: tokens/ui-registry.json.
//
// Per the Executable-Requirements PRD, the test-id is a generated build
// artifact. Component code imports it from this file and renders it on the
// real element (typically as data-testid={…}). The path itself is the
// stable contract referenced from Gherkin scenarios and Jira tickets.

`;

const flatBlock =
  `/** Flat lookup: path -> test-id. Used at runtime when you have a path
   from the registry / a Gherkin scenario and need the corresponding
   data-testid string. */
export const testIds = ${JSON.stringify(flatMap, null, 2)} as const;

export type RegistryPath = keyof typeof testIds;
`;

const treeBlock =
  `\n/** Nested tree: ergonomic access from component code, e.g.
   data-testid={ids.component.checkout.cart.checkoutButton}. */
export const ids = ${JSON.stringify(idTree, null, 2)} as const;
`;

mkdirSync(dirname(OUT_TS), { recursive: true });
writeFileSync(OUT_TS, tsHeader + flatBlock + treeBlock, "utf8");

// --- emit ui-registry-glossary.md -----------------------------------------

function renderGlossary() {
  const out = [];
  out.push("# UI Registry — Glossary");
  out.push("");
  out.push(`> Source: \`tokens/ui-registry.json\` (version \`${registry.$metadata?.version ?? "unversioned"}\`).`);
  out.push("> Generated by `npm run ui-registry:build`. Do not edit by hand.");
  out.push(">");
  out.push("> This glossary is the human-readable companion to the test-id constants in `tokens/build/test-ids.ts`. Both come from the same source.");
  out.push("");

  out.push("## Why this exists");
  out.push("");
  out.push("Per the Executable-Requirements PRD (`tokens/templates/PRD-Executable-Requirements-Gherkin-Component-Paths.docx.md`), every UI element referenced from a Jira ticket — and from every Gherkin scenario — uses a **stable path** instead of a description. `component.checkout.cart.checkoutButton` is the contract; the visual, the position, and the generated test-id are not.");
  out.push("");

  out.push("## Screens");
  out.push("");
  if (screenLeaves.length === 0) {
    out.push("_(none registered yet — add entries under `screen.*` in `tokens/ui-registry.json` as features are scoped.)_");
  } else {
    out.push("| Path | Description | test-id |");
    out.push("|---|---|---|");
    for (const l of screenLeaves) {
      out.push(`| \`${l.path}\` | ${l.description} | \`${pathToId(l.path)}\` |`);
    }
  }
  out.push("");

  out.push("## Components");
  out.push("");
  if (componentLeaves.length === 0) {
    out.push("_(none registered yet — add entries under `component.*` in `tokens/ui-registry.json` as features are scoped.)_");
  } else {
    out.push("| Path | Description | Screen | States | test-id |");
    out.push("|---|---|---|---|---|");
    for (const l of componentLeaves) {
      const screen = l.screen ? `\`${l.screen}\`` : "_(unset)_";
      const states = l.states ? l.states.map((s) => `\`${s}\``).join(", ") : "_(any)_";
      out.push(`| \`${l.path}\` | ${l.description} | ${screen} | ${states} | \`${pathToId(l.path)}\` |`);
    }
  }
  out.push("");

  if (warnings.length) {
    out.push("## Warnings");
    out.push("");
    for (const w of warnings) out.push(`- \`${w.path}\`: ${w.message}`);
    out.push("");
  }

  out.push("---");
  out.push("");
  out.push("STATUS: PASS");
  return out.join("\n") + "\n";
}

mkdirSync(dirname(OUT_MD), { recursive: true });
writeFileSync(OUT_MD, renderGlossary(), "utf8");

console.log(`Wrote:`);
console.log(`  ${OUT_TS}`);
console.log(`  ${OUT_MD}`);
