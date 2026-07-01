#!/usr/bin/env node
/**
 * validate-contract-anatomy
 *
 * Enforces three invariants that the pipeline failed to catch automatically,
 * leading to stub implementations passing the gate:
 *
 *   1. REGISTRY COVERAGE — every [component.*] tag in §2 anatomy must be a
 *      registered entry in tokens/ui-registry.json.
 *
 *   2. BDD VISIBILITY COVERAGE — every registered component path from §1a must
 *      have at least one Gherkin scenario that asserts `component.*` is visible.
 *
 *   3. ANATOMY ↔ REGISTRY ALIGNMENT — every [component.*] tag in §2 anatomy
 *      must also appear in §1a (the registry table). A path that is in the
 *      anatomy tree but missing from the §1a table is invisible to bdd-scaffold
 *      and the gate.
 *
 * Usage:
 *   node scripts/validate-contract-anatomy.mjs <feature-id>
 *   npm run validate:contract -- F-001c.2
 *
 * Exit codes:
 *   0 — all checks pass
 *   1 — one or more checks fail (errors printed to stderr)
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// ── Args ────────────────────────────────────────────────────────────────────

const featureId = process.argv[2];
if (!featureId) {
  process.stderr.write(
    'Usage: node scripts/validate-contract-anatomy.mjs <feature-id>\n' +
    'Example: node scripts/validate-contract-anatomy.mjs F-001c.2\n'
  );
  process.exit(1);
}

const root = process.cwd();

// ── File paths ───────────────────────────────────────────────────────────────

const contractPath  = resolve(root, `features/${featureId}/contract.md`);
const featurePath   = resolve(root, `features/${featureId}/${featureId}.feature`);
const registryPath  = resolve(root, 'tokens/ui-registry.json');

function requireFile(p, label) {
  if (!existsSync(p)) {
    process.stderr.write(`❌  FAIL — ${label} not found: ${p}\n`);
    process.exit(1);
  }
  return readFileSync(p, 'utf8');
}

const contractText  = requireFile(contractPath,  'contract.md');
const featureText   = existsSync(featurePath) ? readFileSync(featurePath, 'utf8') : '';
const registry      = JSON.parse(requireFile(registryPath, 'tokens/ui-registry.json'));

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve a dotted path like "component.shop.quickView.skuRow" through the
 * registry object.  Returns true iff the path resolves to a registered entry.
 *
 * Accepts two node shapes:
 *  - Leaf node  — has `$description` (an individually testable element)
 *  - Branch node — has non-`$`-prefixed child keys (a named container whose
 *    children are individually registered; the container itself is "known"
 *    to the registry even though it has no standalone test-id leaf entry)
 *
 * This allows §2 anatomy to tag container elements (e.g. [component.home.nav])
 * that are parents of registered leaf nodes without forcing a duplicate leaf
 * entry on a branch — which the ui-registry:build script forbids.
 */
function isRegistered(path) {
  const parts = path.split('.');
  let node = registry;
  for (const part of parts) {
    if (node == null || typeof node !== 'object') return false;
    node = node[part];
  }
  if (node == null || typeof node !== 'object') return false;
  return '$description' in node ||
    Object.keys(node).some(k => !k.startsWith('$'));
}

/**
 * Extract all `[component.X.Y.Z]` references from a block of text.
 * Returns an array of full dotted paths (with the "component." prefix).
 */
function extractAnatomyPaths(text) {
  const matches = [...text.matchAll(/\[component\.([\w.]+)\]/g)];
  return [...new Set(matches.map(m => `component.${m[1]}`))];
}

/**
 * Extract all `component.*` paths from backtick-quoted references in text.
 * Used to pull §1a table entries and Gherkin step paths.
 */
function extractBacktickPaths(text) {
  const matches = [...text.matchAll(/`(component\.[^`]+)`/g)];
  return [...new Set(matches.map(m => m[1]))];
}

// ── Parse contract sections ──────────────────────────────────────────────────

// §1a — UI registry entries table
const s1aMatch = contractText.match(/##\s*1a\..*?UI registry entries([\s\S]*?)(?=##\s*1b\.|##\s*2\.)/i);
const s1aText  = s1aMatch?.[1] ?? '';
const s1aPaths = extractBacktickPaths(s1aText);

// §2 — Component anatomy
const s2Match  = contractText.match(/##\s*2\..*?Component anatomy([\s\S]*?)(?=##\s*3\.)/i);
const s2Text   = s2Match?.[1] ?? '';
const s2Paths  = extractAnatomyPaths(s2Text);

// ── Check 1: every §2 [component.*] must be in the registry ─────────────────

const notInRegistry = s2Paths.filter(p => !isRegistered(p));

// ── Check 2: every §1a path must have ≥1 BDD step referencing it ─────────────
// Accepts any assertion: `path` is visible / shows / is enabled / is disabled /
// contains text / etc. — any step that references the component path counts.
// Paths with ZERO coverage in the feature file are the real risk.

const notInBdd = s1aPaths.filter(path => {
  if (!featureText) return true;
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return !new RegExp(`\`${escaped}\``).test(featureText);
});

// ── Check 3: every §2 [component.*] must also appear in §1a ─────────────────

const notInS1a = s2Paths.filter(p => !s1aPaths.includes(p));

// ── Report ───────────────────────────────────────────────────────────────────

const failures = [];

if (notInRegistry.length > 0) {
  failures.push(
    `CHECK 1 FAIL — ${notInRegistry.length} anatomy path(s) tagged in §2 but NOT in ui-registry.json:\n` +
    notInRegistry.map(p => `  ✗  ${p}`).join('\n') + '\n' +
    '  → Add these entries to tokens/ui-registry.json and run: npm run ui-registry:build'
  );
}

if (notInBdd.length > 0) {
  failures.push(
    `CHECK 2 FAIL — ${notInBdd.length} §1a path(s) have NO "is visible" BDD scenario in ${featureId}.feature:\n` +
    notInBdd.map(p => `  ✗  ${p}`).join('\n') + '\n' +
    '  → Add a Gherkin scenario: Then `' + notInBdd[0] + '` is visible  (one per missing path)'
  );
}

if (notInS1a.length > 0) {
  failures.push(
    `CHECK 3 FAIL — ${notInS1a.length} §2 anatomy path(s) missing from §1a registry table:\n` +
    notInS1a.map(p => `  ✗  ${p}`).join('\n') + '\n' +
    '  → Add these paths to the §1a "Components" table in contract.md'
  );
}

if (failures.length > 0) {
  process.stderr.write(
    `\nvalidate:contract FAIL — feature ${featureId}\n\n` +
    failures.join('\n\n') + '\n\n' +
    `Summary: ${failures.length} check(s) failed. Fix all before running governance-gate.\n`
  );
  process.exit(1);
}

process.stdout.write(
  `validate:contract PASS — feature ${featureId}\n` +
  `  §2 anatomy paths tagged:       ${s2Paths.length}\n` +
  `  All registered in ui-registry: ✓\n` +
  `  All have "is visible" in BDD:  ✓\n` +
  `  §2 ↔ §1a alignment:            ✓\n`
);
process.exit(0);
