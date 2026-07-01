#!/usr/bin/env node
/**
 * One-off helper: seed component entries from LP-001 navbar spec checklist.
 * ui-registry-build merges these into tokens/ui-registry.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCREEN = "screen.landing.home";

/** @type {Array<{ path: string[], description: string, nodeId: string, states?: string[] }>} */
const ENTRIES = [
  // Desktop — GH#3
  { path: ["navbar", "root"], description: "Shared navbar desktop (Gherkin: component.navbar)", nodeId: "5164:6559", states: ["default", "hover"] },
  { path: ["navbar", "brand"], description: "Navbar brand cluster", nodeId: "I5164:6559;3150:14" },
  { path: ["navbar", "logoIcon"], description: "Navbar logo icon frame (hidden on desktop)", nodeId: "I5164:6559;3150:15" },
  { path: ["navbar", "brandLabel"], description: "Navbar brand text MaqsoodTravel", nodeId: "I5164:6559;3150:16" },
  { path: ["navbar", "navLinks"], description: "Navbar nav link row", nodeId: "I5164:6559;3150:17" },
  { path: ["navbar", "productLink"], description: "Nav link Product", nodeId: "I5164:6559;3150:18", states: ["default", "hover"] },
  { path: ["navbar", "productLinkLabel"], description: "Nav label Product", nodeId: "I5164:6559;3150:18;3149:14" },
  { path: ["navbar", "howItWorksLink"], description: "Nav link How It Works", nodeId: "I5164:6559;3150:20", states: ["default", "hover"] },
  { path: ["navbar", "howItWorksLinkLabel"], description: "Nav label How It Works", nodeId: "I5164:6559;3150:20;3149:14" },
  { path: ["navbar", "pricingLink"], description: "Nav link Pricing", nodeId: "I5164:6559;3150:22", states: ["default", "hover"] },
  { path: ["navbar", "pricingLinkLabel"], description: "Nav label Pricing", nodeId: "I5164:6559;3150:22;3149:14" },
  { path: ["navbar", "cta"], description: "Book A Demo CTA (Gherkin: component.navbar.cta)", nodeId: "I5164:6559;3147:1442", states: ["default", "hover"] },
  { path: ["navbar", "ctaLabel"], description: "CTA label Book A Demo", nodeId: "I5164:6559;3147:1442;2780:1465" },
  { path: ["navbar", "ctaIcon"], description: "CTA icon button", nodeId: "I5164:6559;3147:1442;2780:1466" },
  { path: ["navbar", "ctaGraphic"], description: "CTA arrow graphic", nodeId: "I5164:6559;3147:1442;2780:1466;2780:1505" },
  // Mobile
  { path: ["navbar", "mobile", "root"], description: "Mobile top bar (Gherkin: component.navbar @393px)", nodeId: "5164:7031", states: ["default", "hover"] },
  { path: ["navbar", "mobile", "leadingCluster"], description: "Mobile leading cluster", nodeId: "5164:7032" },
  { path: ["navbar", "mobile", "menuCluster"], description: "Mobile menu icon cluster", nodeId: "5164:7033" },
  { path: ["navbar", "mobile", "trailingCluster"], description: "Mobile trailing cluster", nodeId: "5164:7035" },
  { path: ["navbar", "mobile", "cta"], description: "Mobile Book A Demo CTA", nodeId: "5164:7037", states: ["default", "hover"] },
  { path: ["navbar", "mobile", "ctaLabel"], description: "Mobile CTA label", nodeId: "I5164:7037;2780:1465" },
  { path: ["navbar", "mobile", "ctaIcon"], description: "Mobile CTA icon", nodeId: "I5164:7037;2780:1466" },
  { path: ["navbar", "mobile", "ctaGraphic"], description: "Mobile CTA graphic", nodeId: "I5164:7037;2780:1466;2780:1505" },
  // Animation reference
  { path: ["navbar", "motion", "root"], description: "Navbar motion prototype (Gherkin: motion matches 5164:10334)", nodeId: "5164:10334", states: ["default", "hover"] },
  { path: ["navbar", "motion", "brand"], description: "Motion frame brand cluster", nodeId: "5164:10335" },
  { path: ["navbar", "motion", "logoIcon"], description: "Motion frame logo icon", nodeId: "5164:10336" },
  { path: ["navbar", "motion", "brandLabel"], description: "Motion frame brand label", nodeId: "5164:10337" },
  { path: ["navbar", "motion", "navLinks"], description: "Motion frame nav links", nodeId: "5164:10338" },
  { path: ["navbar", "motion", "productLink"], description: "Motion frame Product link", nodeId: "5164:10339", states: ["default", "hover"] },
  { path: ["navbar", "motion", "productLinkLabel"], description: "Motion frame Product label", nodeId: "I5164:10339;3149:14" },
  { path: ["navbar", "motion", "howItWorksLink"], description: "Motion frame How It Works link", nodeId: "5164:10340", states: ["default", "hover"] },
  { path: ["navbar", "motion", "howItWorksLinkLabel"], description: "Motion frame How It Works label", nodeId: "I5164:10340;3149:14" },
  { path: ["navbar", "motion", "pricingLink"], description: "Motion frame Pricing link", nodeId: "5164:10341", states: ["default", "hover"] },
  { path: ["navbar", "motion", "pricingLinkLabel"], description: "Motion frame Pricing label", nodeId: "I5164:10341;3149:14" },
  { path: ["navbar", "motion", "cta"], description: "Motion frame CTA", nodeId: "5164:10342", states: ["default", "hover"] },
  { path: ["navbar", "motion", "ctaLabel"], description: "Motion frame CTA label", nodeId: "I5164:10342;2780:1465" },
  { path: ["navbar", "motion", "ctaIcon"], description: "Motion frame CTA icon", nodeId: "I5164:10342;2780:1466" },
  { path: ["navbar", "motion", "ctaGraphic"], description: "Motion frame CTA graphic", nodeId: "I5164:10342;2780:1466;2780:1505" },
];

function setPath(tree, segments, leaf) {
  let cur = tree;
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (!cur[seg] || typeof cur[seg] !== "object") cur[seg] = {};
    cur = cur[seg];
  }
  const last = segments[segments.length - 1];
  cur[last] = {
    $description: leaf.description,
    $screen: SCREEN,
    $figmaNode: leaf.nodeId,
    $states: leaf.states ?? ["default"],
    $tokens: {},
  };
}

const registry = {
  $metadata: {
    version: "0.1.0",
    description: "UI registry — LP-001 Navbar slice (ui-registry-build 2026-07-01)",
    pathGrammar: "<domain>.<segment>(.<segment>)+",
    owner: "MLtravel FE",
    gherkinAliases: {
      "screen.landing": "screen.landing.home",
      "screen.contact": "screen.contact.page",
      "screen.howItWorks": "screen.howItWorks.page",
      "component.navbar": "component.navbar.root",
    },
  },
  screen: {
    landing: {
      home: {
        $description: "Landing page at / (Gherkin: screen.landing)",
      },
    },
    contact: {
      page: {
        $description: "Contact / demo booking at /contact (Gherkin: screen.contact)",
      },
    },
    howItWorks: {
      page: {
        $description: "How it works at /how-it-works (Gherkin: screen.howItWorks)",
      },
    },
  },
  component: {},
};

for (const e of ENTRIES) {
  setPath(registry.component, e.path, e);
}

// Shared chrome — reused on contact + HIW once implemented
registry.component.navbar.root.$shared = true;

const out = join(ROOT, "tokens", "ui-registry.json");
writeFileSync(out, JSON.stringify(registry, null, 2) + "\n", "utf8");
console.log(`✓ wrote ${out} — ${ENTRIES.length} component entries`);
