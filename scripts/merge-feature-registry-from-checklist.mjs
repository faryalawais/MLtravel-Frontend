#!/usr/bin/env node
/**
 * Merge one figma component-checklist section into tokens/ui-registry.json.
 *
 * Usage:
 *   node scripts/merge-feature-registry-from-checklist.mjs \
 *     --feature HIW-003 \
 *     --prefix howItWorks,hero \
 *     --screen screen.howItWorks.page \
 *     --section "HIWHeroSection" \
 *     --root-node 5217:6699 \
 *     --root-description "HIW desktop hero (Gherkin: component.howItWorks.hero)"
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @param {string} name */
function baseSlugFromName(name) {
  const special = {
    HIWHeroSection: "root",
    "S1-Hero": "s1Hero",
    HIWHeroTextBlock: "textBlock",
    "head-group": "headGroup",
    "cta-group": "ctaGroup",
    "Button/Primary": "demoCta",
    HeroStatsStrip: "statsStrip",
    HeroStatItem: "statItem",
    "val-block": "valBlock",
    "label-block": "labelBlock",
    divider: "divider",
    label: "label",
    bar: "bar",
    Group: "group",
    graphic: "graphic",
    "Icon/Button": "ctaIcon",
    Container: "container",
    Frame: "frame",
    Paragraph: "paragraph",
    Rectangle: "rectangle",
  };
  if (special[name]) return special[name];

  if (name.length > 36 || /[.→£✓⚡📊⬤↓$%]/.test(name)) {
    return "textBlock";
  }

  const cleaned = name
    .replace(/\//g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
  if (!cleaned) return "node";

  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    const w = words[0];
    if (/^Frame/i.test(w)) return w.replace(/^Frame/i, "frame").replace(/(\d+)/, (_, n) => n);
    let slug = w.charAt(0).toLowerCase() + w.slice(1);
    if (/^\d/.test(slug)) slug = `n${slug}`;
    return slug;
  }

  const joined = words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
  let slug = joined.charAt(0).toLowerCase() + joined.slice(1);
  if (/^\d/.test(slug)) slug = `n${slug}`;
  return slug;
}

function parseArgs() {
  const argv = process.argv.slice(2);
  /** @type {Record<string, string>} */
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--feature") o.feature = argv[++i];
    else if (a === "--prefix") o.prefix = argv[++i];
    else if (a === "--screen") o.screen = argv[++i];
    else if (a === "--section") o.section = argv[++i];
    else if (a === "--root-node") o.rootNode = argv[++i];
    else if (a === "--root-description") o.rootDescription = argv[++i];
  }
  if (!o.feature || !o.prefix || !o.screen || !o.section) {
    console.error(
      "Usage: merge-feature-registry-from-checklist.mjs --feature <id> --prefix a,b --screen screen.x --section <name> [--root-node] [--root-description]",
    );
    process.exit(2);
  }
  return o;
}

function setPath(tree, segments, leaf) {
  let cur = tree;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (!cur[seg] || typeof cur[seg] !== "object") cur[seg] = {};
    cur = cur[seg];
  }
  cur[segments[segments.length - 1]] = {
    $description: leaf.description,
    $screen: leaf.screen,
    $figmaNode: leaf.nodeId,
    $states: leaf.states,
    $tokens: {},
  };
}

const opts = parseArgs();
const prefix = opts.prefix.split(",").map((s) => s.trim());
const checklistPath = join(ROOT, "features", opts.feature, "figma", "component-checklist.md");
const registryPath = join(ROOT, "tokens", "ui-registry.json");
const md = readFileSync(checklistPath, "utf8");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const sectionHeader = opts.section;
const lines = md.split("\n");
let inSection = false;
/** @type {Array<{ path: string[], description: string, nodeId: string, states: string[] }>} */
const entries = [];
/** @type {Map<string, number>} */
const slugCounts = new Map();

for (const line of lines) {
  if (line.startsWith("## ") && !line.includes(opts.section)) {
    if (inSection) break;
    continue;
  }
  if (line.startsWith("## ") && line.includes(opts.section)) {
    inSection = true;
    continue;
  }
  if (!inSection) continue;

  const rowMatch = line.match(/^- \[ \] (.+?)  \(nodeId: ([^)]+)\)/);
  if (!rowMatch) continue;

  const [, rawName, nodeId] = rowMatch;
  const name = rawName.replace(/  \(content:.*$/, "").replace(/  \(variants:.*$/, "").trim();

  let leaf = baseSlugFromName(name);
  if (leaf === "root" && opts.rootNode && nodeId !== opts.rootNode) {
    leaf = "sectionRoot";
  }

  const count = slugCounts.get(leaf) ?? 0;
  slugCounts.set(leaf, count + 1);
  if (count > 0) leaf = `${leaf}${count + 1}`;

  const path = [...prefix, leaf];
  if (path.length > 4) {
    console.error(`ERROR: path too deep component.${path.join(".")} (${nodeId})`);
    process.exit(1);
  }

  const isRoot = opts.rootNode ? nodeId === opts.rootNode : leaf === "root";
  const isInteractive =
    isRoot || /Button|Primary|CTA|demoCta/i.test(name) || /HeroStatItem/i.test(name);

  entries.push({
    path,
    description: isRoot && opts.rootDescription ? opts.rootDescription : `${name} (${nodeId})`,
    nodeId,
    states: isInteractive ? ["default", "hover"] : ["default"],
    screen: opts.screen,
  });
}

if (!entries.length) {
  console.error(`ERROR: no checklist rows for section ${opts.section}`);
  process.exit(1);
}

for (const e of entries) {
  setPath(registry.component, e.path, e);
}

const aliasPath = `component.${prefix.join(".")}`;
const rootPath = `${aliasPath}.root`;
if (!registry.$metadata.gherkinAliases) registry.$metadata.gherkinAliases = {};
registry.$metadata.gherkinAliases[aliasPath] = rootPath;

const desc = registry.$metadata.description ?? "";
if (!desc.includes(opts.feature)) {
  registry.$metadata.description = `${desc} + ${opts.feature} ${prefix.join(".")} slice`;
}

writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf8");
console.log(`✓ merged ${entries.length} entries under component.${prefix.join(".")}`);
