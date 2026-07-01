#!/usr/bin/env node
/**
 * Seed component entries from LP-001 figma checklist (navbar + hero        + comparison + howItWorksTeaser slices).
 * ui-registry-build merges these into tokens/ui-registry.json.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCREEN = "screen.landing.home";
const CHECKLIST_PATH = join(ROOT, "features/LP-001/figma/component-checklist.md");

/** @typedef {{ path: string[], description: string, nodeId: string, states?: string[] }} RegistryEntry */

/** @param {string} name */
function sanitizeSegment(seg) {
  let s = seg.replace(/[^a-zA-Z0-9]/g, "");
  if (!s) return "node";
  if (/^\d/.test(s)) s = `n${s}`;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/** @param {string} name */
function baseSlugFromName(name) {
  const special = {
    HowItWorksSection: "root",
    "How It Works": "sectionRoot",
    "HowItWorks-animation": "root",
    "SectionHeader/HowItWorks": "sectionHeader",
    SectionPill: "sectionPill",
    HIWCard: "hiwCard",
    "card-visual": "cardVisual",
    "card-content": "cardContent",
    HIWStepBadge: "stepBadge",
    "main-block": "mainBlock",
    AccentBar: "accentBar",
    "accent-bar": "accentBar",
    "footer-note": "footerNote",
    "heading-block": "headingBlock",
    "cards-wrap": "cardsWrap",
    HIW: "hiwStack",
    Container: "container",
    "Heading 2": "heading",
    Paragraph: "paragraph",
    Rectangle: "rectangle",
    Frame: "frame",
    "The Choice": "sectionPillLabel",
  };
  if (special[name]) return special[name];

  if (name.length > 36 || /[.→£✓⚡📊⬤↓]/.test(name)) {
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
    if (/^Frame/i.test(w)) return sanitizeSegment(w.replace(/^Frame/i, "frame"));
    return sanitizeSegment(w);
  }

  const joined = words
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
  return sanitizeSegment(joined.slice(0, 40));
}

/**
 * Parse HIW checklist sections into registry entries (GH#7).
 * @returns {RegistryEntry[]}
 */
function parseHiwChecklistEntries() {
  const md = readFileSync(CHECKLIST_PATH, "utf8");
  const lines = md.split("\n");

  /** @type {Array<{ prefix: string[], endMarker: string, rootDescription: string }>} */
  const sections = [
    {
      prefix: ["landing", "howItWorksTeaser"],
      endMarker: "## How It Works (nodeId: 5164:6690)",
      rootDescription: "How-it-works teaser desktop (Gherkin: component.landing.howItWorksTeaser)",
    },
    {
      prefix: ["landing", "howItWorksTeaser", "mobile"],
      endMarker: "## HowItWorks-animation",
      rootDescription: "How-it-works teaser mobile (Gherkin @393px)",
    },
    {
      prefix: ["landing", "howItWorksTeaser", "motion"],
      endMarker: "## Button/Secondary2 (nodeId: 5164:10342)",
      rootDescription: "How-it-works motion prototype (Gherkin: 5164:10412)",
    },
  ];

  /** @type {RegistryEntry[]} */
  const entries = [];
  let sectionIndex = -1;
  let inHiw = false;
  /** @type {Map<string, number>} */
  const slugCounts = new Map();

  for (const line of lines) {
    if (line.startsWith("## HowItWorksSection")) {
      inHiw = true;
      sectionIndex = 0;
      slugCounts.clear();
      continue;
    }
    if (!inHiw) continue;

    const section = sections[sectionIndex];
    if (section && line.startsWith(section.endMarker)) {
      sectionIndex += 1;
      slugCounts.clear();
      if (sectionIndex >= sections.length) {
        inHiw = false;
      }
      continue;
    }

    const rowMatch = line.match(/^- \[ \] (.+?)  \(nodeId: ([^)]+)\)/);
    if (!rowMatch || sectionIndex < 0 || sectionIndex >= sections.length) continue;

    const [, rawName, nodeId] = rowMatch;
    const name = rawName.replace(/  \(content:.*$/, "").trim();
    const currentSection = sections[sectionIndex];

    let leaf = baseSlugFromName(name);
    if (leaf === "root" && entries.some((e) => e.nodeId === nodeId)) {
      leaf = "sectionRoot";
    }

    const count = slugCounts.get(leaf) ?? 0;
    slugCounts.set(leaf, count + 1);
    if (count > 0) leaf = `${leaf}${count + 1}`;

    const path = [...currentSection.prefix, leaf];
    if (path.length > 4) {
      throw new Error(`Registry path too deep: component.${path.join(".")} (${nodeId})`);
    }

    const isRoot =
      (sectionIndex === 0 && nodeId === "5164:6567") ||
      (sectionIndex === 1 && nodeId === "5164:6690") ||
      (sectionIndex === 2 && nodeId === "5164:10412");

    const isCard = /^HIWCard$/i.test(name) || name === "HIW";
    const isInteractive =
      isRoot ||
      isCard ||
      /Link|CTA|Button|NavLink/i.test(name) ||
      /AccentBar|HIWCard|footer-note/i.test(name);

    entries.push({
      path,
      description: isRoot ? currentSection.rootDescription : `${name} (${nodeId})`,
      nodeId,
      states: isInteractive ? ["default", "hover"] : ["default"],
    });
  }

  return entries;
}

const NAVBAR_ENTRIES = [
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

/** @type {Array<{ path: string[], description: string, nodeId: string, states?: string[] }>} */
const HERO_ENTRIES = [
  { path: ["landing", "hero", "root"], description: "Hero section desktop (Gherkin: component.landing.hero)", nodeId: "5164:6560", states: ["default", "hover"] },
  { path: ["landing", "hero", "heroTop"], description: "Hero top row — copy + product image", nodeId: "I5164:6560;5160:5271" },
  { path: ["landing", "hero", "textBlock"], description: "Hero text block", nodeId: "I5164:6560;5160:5272" },
  { path: ["landing", "hero", "headingGroup"], description: "Hero heading group", nodeId: "I5164:6560;5160:5272;5160:43" },
  { path: ["landing", "hero", "heading"], description: "Hero headline", nodeId: "I5164:6560;5160:5272;5160:44" },
  { path: ["landing", "hero", "subheading"], description: "Hero subcopy", nodeId: "I5164:6560;5160:5272;5160:45" },
  { path: ["landing", "hero", "ctaGroup"], description: "Hero CTA group", nodeId: "I5164:6560;5160:5272;5160:46" },
  { path: ["landing", "hero", "ctaRow"], description: "Hero CTA row", nodeId: "I5164:6560;5160:5272;5160:47" },
  { path: ["landing", "hero", "cta"], description: "Book A Demo primary CTA (Gherkin: component.landing.hero.cta)", nodeId: "I5164:6560;5160:5272;5160:48", states: ["default", "hover"] },
  { path: ["landing", "hero", "ctaLabel"], description: "Primary CTA label", nodeId: "I5164:6560;5160:5272;5160:48;2780:1424" },
  { path: ["landing", "hero", "ctaIcon"], description: "Primary CTA icon", nodeId: "I5164:6560;5160:5272;5160:48;2780:1425" },
  { path: ["landing", "hero", "ctaGraphic"], description: "Primary CTA arrow", nodeId: "I5164:6560;5160:5272;5160:48;2780:1425;2780:1499" },
  { path: ["landing", "hero", "secondaryCta"], description: "View Pricing secondary CTA", nodeId: "I5164:6560;5160:5272;5160:57", states: ["default", "hover"] },
  { path: ["landing", "hero", "secondaryCtaLabel"], description: "View Pricing label", nodeId: "I5164:6560;5160:5272;5160:57;2780:1462" },
  { path: ["landing", "hero", "proofLine"], description: "Agencies save average proof line", nodeId: "I5164:6560;5160:5272;5160:64" },
  { path: ["landing", "hero", "productImage"], description: "Hero product screenshot", nodeId: "I5164:6560;5160:5290" },
  { path: ["landing", "hero", "bottomFrame"], description: "Stats + logos container", nodeId: "I5164:6560;5164:5195" },
  { path: ["landing", "hero", "statsStrip"], description: "Hero stats strip", nodeId: "I5164:6560;5160:5292" },
  { path: ["landing", "hero", "stat1"], description: "Stat item $1,200/mo", nodeId: "I5164:6560;5160:5292;5160:5221" },
  { path: ["landing", "hero", "stat2"], description: "Stat item 40%", nodeId: "I5164:6560;5160:5292;5160:5229" },
  { path: ["landing", "hero", "stat3"], description: "Stat item 6 Weeks", nodeId: "I5164:6560;5160:5292;5160:5237" },
  { path: ["landing", "hero", "stat4"], description: "Stat item 500+", nodeId: "I5164:6560;5160:5292;5160:5245" },
  { path: ["landing", "hero", "logosStrip"], description: "Partner logos strip", nodeId: "I5164:6560;5160:5324" },
  { path: ["landing", "hero", "mobile", "root"], description: "Hero mobile frame (Gherkin @393px)", nodeId: "5164:7080" },
  { path: ["landing", "hero", "mobile", "banner"], description: "Mobile HeroBanner", nodeId: "5164:7081" },
  { path: ["landing", "hero", "mobile", "cta"], description: "Mobile primary CTA", nodeId: "5164:7090", states: ["default", "hover"] },
  { path: ["landing", "hero", "motion", "root"], description: "Hero motion prototype (Gherkin: motion 5164:10343)", nodeId: "5164:10343", states: ["default", "hover"] },
  { path: ["landing", "hero", "motion", "cta"], description: "Motion frame primary CTA", nodeId: "I5164:10343;5307:6562", states: ["default", "hover"] },
];

/** @type {Array<{ path: string[], description: string, nodeId: string, states?: string[] }>} */
const PROBLEM_ENTRIES = [
  { path: ["landing", "problem", "root"], description: "Problem section desktop (Gherkin: component.landing.problem)", nodeId: "5164:6561", states: ["default", "hover"] },
  { path: ["landing", "problem", "outerFrame"], description: "Problem outer layout frame", nodeId: "I5164:6561;5151:12615" },
  { path: ["landing", "problem", "innerFrame"], description: "Problem inner layout frame", nodeId: "I5164:6561;5151:12530" },
  { path: ["landing", "problem", "headerWrap"], description: "Problem header wrap", nodeId: "I5164:6561;3129:14" },
  { path: ["landing", "problem", "sectionHeader"], description: "SectionHeader/Problem", nodeId: "I5164:6561;3129:15" },
  { path: ["landing", "problem", "sectionPill"], description: "The Problem section pill", nodeId: "I5164:6561;3129:15;3131:1205" },
  { path: ["landing", "problem", "sectionPillLabel"], description: "Pill label The Problem", nodeId: "I5164:6561;3129:15;3131:1205;3131:1152" },
  { path: ["landing", "problem", "headingBlock"], description: "Section heading block", nodeId: "I5164:6561;3129:15;3128:17" },
  { path: ["landing", "problem", "sectionHeading"], description: "Section H2 headline", nodeId: "I5164:6561;3129:15;3128:18" },
  { path: ["landing", "problem", "sectionSubtitle"], description: "Section subtitle copy", nodeId: "I5164:6561;3129:15;3128:19" },
  { path: ["landing", "problem", "cardsGrid"], description: "Problem cards grid", nodeId: "I5164:6561;3129:24" },
  { path: ["landing", "problem", "card1"], description: "Problem card 1 — multi-platform", nodeId: "I5164:6561;3129:25", states: ["default", "hover"] },
  { path: ["landing", "problem", "card1Icon"], description: "Card 1 icon frame", nodeId: "I5164:6561;3129:25;3092:14" },
  { path: ["landing", "problem", "card1Graphic"], description: "Card 1 icon graphic", nodeId: "I5164:6561;3129:25;3092:14;3091:14" },
  { path: ["landing", "problem", "card1TextBlock"], description: "Card 1 text block", nodeId: "I5164:6561;3129:25;3092:20" },
  { path: ["landing", "problem", "card1Heading"], description: "Card 1 heading", nodeId: "I5164:6561;3129:25;3092:21" },
  { path: ["landing", "problem", "card1AccentBar"], description: "Card 1 accent bar", nodeId: "I5164:6561;3129:25;3092:22" },
  { path: ["landing", "problem", "card1Body"], description: "Card 1 body copy", nodeId: "I5164:6561;3129:25;3092:23" },
  { path: ["landing", "problem", "card2"], description: "Problem card 2 — 3rd party tools", nodeId: "I5164:6561;3129:41", states: ["default", "hover"] },
  { path: ["landing", "problem", "card2Icon"], description: "Card 2 icon frame", nodeId: "I5164:6561;3129:41;3092:25" },
  { path: ["landing", "problem", "card2Graphic"], description: "Card 2 icon graphic", nodeId: "I5164:6561;3129:41;3092:25;3091:20" },
  { path: ["landing", "problem", "card2TextBlock"], description: "Card 2 text block", nodeId: "I5164:6561;3129:41;3092:32" },
  { path: ["landing", "problem", "card2Heading"], description: "Card 2 heading", nodeId: "I5164:6561;3129:41;3092:33" },
  { path: ["landing", "problem", "card2AccentBar"], description: "Card 2 accent bar", nodeId: "I5164:6561;3129:41;3092:34" },
  { path: ["landing", "problem", "card2Body"], description: "Card 2 body copy", nodeId: "I5164:6561;3129:41;3092:35" },
  { path: ["landing", "problem", "card3"], description: "Problem card 3 — GDS disputes", nodeId: "I5164:6561;3129:59", states: ["default", "hover"] },
  { path: ["landing", "problem", "card3Icon"], description: "Card 3 icon frame", nodeId: "I5164:6561;3129:59;3092:37" },
  { path: ["landing", "problem", "card3Graphic"], description: "Card 3 icon graphic", nodeId: "I5164:6561;3129:59;3092:37;3091:27" },
  { path: ["landing", "problem", "card3TextBlock"], description: "Card 3 text block", nodeId: "I5164:6561;3129:59;3092:41" },
  { path: ["landing", "problem", "card3Heading"], description: "Card 3 heading", nodeId: "I5164:6561;3129:59;3092:42" },
  { path: ["landing", "problem", "card3AccentBar"], description: "Card 3 accent bar", nodeId: "I5164:6561;3129:59;3092:43" },
  { path: ["landing", "problem", "card3Body"], description: "Card 3 body copy", nodeId: "I5164:6561;3129:59;3092:44" },
  { path: ["landing", "problem", "cta"], description: "ProblemCTA block", nodeId: "I5164:6561;3129:71" },
  { path: ["landing", "problem", "ctaText"], description: "CTA text cluster", nodeId: "I5164:6561;5151:12347" },
  { path: ["landing", "problem", "ctaLine1"], description: "CTA line — The model is broken on purpose.", nodeId: "I5164:6561;5151:12348" },
  { path: ["landing", "problem", "ctaLine2"], description: "CTA line — We built the alternative.", nodeId: "I5164:6561;5151:12349" },
  { path: ["landing", "problem", "gradientBar"], description: "Bottom gradient accent bar", nodeId: "I5164:6561;3129:75" },
  { path: ["landing", "problem", "mobile", "root"], description: "Problem mobile section (Gherkin @393px)", nodeId: "5164:6571" },
  { path: ["landing", "problem", "mobile", "headerContainer"], description: "Mobile header container", nodeId: "5164:6575" },
  { path: ["landing", "problem", "mobile", "sectionPill"], description: "Mobile section pill", nodeId: "5164:6576" },
  { path: ["landing", "problem", "mobile", "sectionPillLabel"], description: "Mobile pill label The Problem", nodeId: "5164:6578" },
  { path: ["landing", "problem", "mobile", "headingBlock"], description: "Mobile heading block", nodeId: "5164:6579" },
  { path: ["landing", "problem", "mobile", "sectionHeading"], description: "Mobile section H2", nodeId: "5164:6580" },
  { path: ["landing", "problem", "mobile", "sectionSubtitle"], description: "Mobile section subtitle", nodeId: "5164:6582" },
  { path: ["landing", "problem", "mobile", "cardsContainer"], description: "Mobile cards stack container", nodeId: "5164:6584" },
  { path: ["landing", "problem", "mobile", "card1"], description: "Mobile problem card 1", nodeId: "5164:6585", states: ["default", "hover"] },
  { path: ["landing", "problem", "mobile", "card1Icon"], description: "Mobile card 1 icon", nodeId: "5164:6586" },
  { path: ["landing", "problem", "mobile", "card1Graphic"], description: "Mobile card 1 graphic", nodeId: "I5164:6586;2317:119" },
  { path: ["landing", "problem", "mobile", "card1Heading"], description: "Mobile card 1 heading", nodeId: "5164:6588" },
  { path: ["landing", "problem", "mobile", "card1Body"], description: "Mobile card 1 body", nodeId: "5164:6590" },
  { path: ["landing", "problem", "mobile", "card2"], description: "Mobile problem card 2", nodeId: "5164:6591", states: ["default", "hover"] },
  { path: ["landing", "problem", "mobile", "card2Icon"], description: "Mobile card 2 icon", nodeId: "5164:6592" },
  { path: ["landing", "problem", "mobile", "card2Graphic"], description: "Mobile card 2 graphic", nodeId: "I5164:6592;2317:125" },
  { path: ["landing", "problem", "mobile", "card2Heading"], description: "Mobile card 2 heading", nodeId: "5164:6594" },
  { path: ["landing", "problem", "mobile", "card2Body"], description: "Mobile card 2 body", nodeId: "5164:6596" },
  { path: ["landing", "problem", "mobile", "card3"], description: "Mobile problem card 3", nodeId: "5164:6597", states: ["default", "hover"] },
  { path: ["landing", "problem", "mobile", "card3Icon"], description: "Mobile card 3 icon", nodeId: "5164:6598" },
  { path: ["landing", "problem", "mobile", "card3Graphic"], description: "Mobile card 3 graphic", nodeId: "I5164:6598;2317:132" },
  { path: ["landing", "problem", "mobile", "card3Heading"], description: "Mobile card 3 heading", nodeId: "5164:6600" },
  { path: ["landing", "problem", "mobile", "card3AccentBar"], description: "Mobile card 3 accent bar", nodeId: "5164:6601" },
  { path: ["landing", "problem", "mobile", "card3Body"], description: "Mobile card 3 body", nodeId: "5164:6602" },
  { path: ["landing", "problem", "mobile", "ctaLine1"], description: "Mobile CTA line 1", nodeId: "5164:6606" },
  { path: ["landing", "problem", "mobile", "ctaLine2"], description: "Mobile CTA line 2", nodeId: "5164:6607" },
  { path: ["landing", "problem", "motion", "root"], description: "Problem motion prototype (Gherkin: 5164:10344)", nodeId: "5164:10344", states: ["default", "hover"] },
  { path: ["landing", "problem", "motion", "headerWrap"], description: "Motion header wrap", nodeId: "I5164:10344;5145:4201" },
  { path: ["landing", "problem", "motion", "sectionHeader"], description: "Motion section header", nodeId: "I5164:10344;5145:4202" },
  { path: ["landing", "problem", "motion", "card1"], description: "Motion card 1", nodeId: "I5164:10344;5145:4205", states: ["default", "hover"] },
  { path: ["landing", "problem", "motion", "card2"], description: "Motion card 2", nodeId: "I5164:10344;5145:4206", states: ["default", "hover"] },
  { path: ["landing", "problem", "motion", "card3"], description: "Motion card 3", nodeId: "I5164:10344;5145:4207", states: ["default", "hover"] },
  { path: ["landing", "problem", "motion", "cta"], description: "Motion ProblemCTA", nodeId: "I5164:10344;5145:4208" },
  { path: ["landing", "problem", "motion", "gradientBar"], description: "Motion gradient bar", nodeId: "I5164:10344;5145:4212" },
];

/** Desktop comparison row leaf bindings. */
function comparisonDesktopRows(cardKey, label, rows) {
  return rows.flatMap((row, index) => {
    const n = index + 1;
    return [
      {
        path: ["landing", "comparisonFirst", `${cardKey}Row${n}`],
        description: `${label} row ${n}`,
        nodeId: row.row,
        states: ["default", "hover"],
      },
      {
        path: ["landing", "comparisonFirst", `${cardKey}Row${n}MicroTag`],
        description: `${label} row ${n} micro tag`,
        nodeId: row.microTag,
      },
      {
        path: ["landing", "comparisonFirst", `${cardKey}Row${n}TagLabel`],
        description: `${label} row ${n} tag label`,
        nodeId: row.tagLabel,
      },
      {
        path: ["landing", "comparisonFirst", `${cardKey}Row${n}Title`],
        description: `${label} row ${n} title`,
        nodeId: row.title,
      },
      {
        path: ["landing", "comparisonFirst", `${cardKey}Row${n}Body`],
        description: `${label} row ${n} body`,
        nodeId: row.body,
      },
      {
        path: ["landing", "comparisonFirst", `${cardKey}Row${n}Stamp`],
        description: `${label} row ${n} stamp`,
        nodeId: row.stamp,
      },
      {
        path: ["landing", "comparisonFirst", `${cardKey}Row${n}StampLabel`],
        description: `${label} row ${n} stamp label`,
        nodeId: row.stampLabel,
      },
    ];
  });
}

/** Mobile comparison row leaf bindings. */
function comparisonMobileRows(cardKey, label, rows) {
  return rows.flatMap((row, index) => {
    const n = index + 1;
    return [
      {
        path: ["landing", "comparisonFirst", "mobile", `${cardKey}Row${n}`],
        description: `Mobile ${label} row ${n}`,
        nodeId: row.row,
        states: ["default", "hover"],
      },
      {
        path: ["landing", "comparisonFirst", "mobile", `${cardKey}Row${n}Tag`],
        description: `Mobile ${label} row ${n} tag`,
        nodeId: row.tag,
      },
      {
        path: ["landing", "comparisonFirst", "mobile", `${cardKey}Row${n}Title`],
        description: `Mobile ${label} row ${n} title`,
        nodeId: row.title,
      },
      {
        path: ["landing", "comparisonFirst", "mobile", `${cardKey}Row${n}Body`],
        description: `Mobile ${label} row ${n} body`,
        nodeId: row.body,
      },
      {
        path: ["landing", "comparisonFirst", "mobile", `${cardKey}Row${n}Stamp`],
        description: `Mobile ${label} row ${n} stamp`,
        nodeId: row.stamp,
      },
    ];
  });
}

const INDUSTRY_DESKTOP_ROWS = [
  {
    row: "I5164:6566;5006:22;5005:20;5004:23",
    microTag: "I5164:6566;5006:22;5005:20;5004:23;3183:19",
    tagLabel: "I5164:6566;5006:22;5005:20;5004:23;3183:19;3182:17",
    title: "I5164:6566;5006:22;5005:20;5004:23;3183:22",
    body: "I5164:6566;5006:22;5005:20;5004:23;3183:23",
    stamp: "I5164:6566;5006:22;5005:20;5004:23;3183:25",
    stampLabel: "I5164:6566;5006:22;5005:20;5004:23;3183:25;3182:30",
  },
  {
    row: "I5164:6566;5006:22;5005:20;5004:35",
    microTag: "I5164:6566;5006:22;5005:20;5004:35;3183:28",
    tagLabel: "I5164:6566;5006:22;5005:20;5004:35;3183:28;3182:19",
    title: "I5164:6566;5006:22;5005:20;5004:35;3183:31",
    body: "I5164:6566;5006:22;5005:20;5004:35;3183:32",
    stamp: "I5164:6566;5006:22;5005:20;5004:35;3183:34",
    stampLabel: "I5164:6566;5006:22;5005:20;5004:35;3183:34;3182:32",
  },
  {
    row: "I5164:6566;5006:22;5005:20;5004:47",
    microTag: "I5164:6566;5006:22;5005:20;5004:47;3183:37",
    tagLabel: "I5164:6566;5006:22;5005:20;5004:47;3183:37;3182:21",
    title: "I5164:6566;5006:22;5005:20;5004:47;3183:40",
    body: "I5164:6566;5006:22;5005:20;5004:47;3183:41",
    stamp: "I5164:6566;5006:22;5005:20;5004:47;3183:43",
    stampLabel: "I5164:6566;5006:22;5005:20;5004:47;3183:43;3182:34",
  },
];

const MAQSOOD_DESKTOP_ROWS = [
  {
    row: "I5164:6566;5006:22;5005:125;5004:68",
    microTag: "I5164:6566;5006:22;5005:125;5004:68;3183:46",
    tagLabel: "I5164:6566;5006:22;5005:125;5004:68;3183:46;3182:23",
    title: "I5164:6566;5006:22;5005:125;5004:68;3183:49",
    body: "I5164:6566;5006:22;5005:125;5004:68;3183:50",
    stamp: "I5164:6566;5006:22;5005:125;5004:68;3183:52",
    stampLabel: "I5164:6566;5006:22;5005:125;5004:68;3183:52;3182:36",
  },
  {
    row: "I5164:6566;5006:22;5005:125;5004:80",
    microTag: "I5164:6566;5006:22;5005:125;5004:80;3183:55",
    tagLabel: "I5164:6566;5006:22;5005:125;5004:80;3183:55;3182:25",
    title: "I5164:6566;5006:22;5005:125;5004:80;3183:58",
    body: "I5164:6566;5006:22;5005:125;5004:80;3183:59",
    stamp: "I5164:6566;5006:22;5005:125;5004:80;3183:61",
    stampLabel: "I5164:6566;5006:22;5005:125;5004:80;3183:61;3182:38",
  },
  {
    row: "I5164:6566;5006:22;5005:125;5004:92",
    microTag: "I5164:6566;5006:22;5005:125;5004:92;3183:64",
    tagLabel: "I5164:6566;5006:22;5005:125;5004:92;3183:64;3182:27",
    title: "I5164:6566;5006:22;5005:125;5004:92;3183:67",
    body: "I5164:6566;5006:22;5005:125;5004:92;3183:68",
    stamp: "I5164:6566;5006:22;5005:125;5004:92;3183:70",
    stampLabel: "I5164:6566;5006:22;5005:125;5004:92;3183:70;3182:40",
  },
];

const INDUSTRY_MOBILE_ROWS = [
  { row: "5164:6632", tag: "5164:6634", title: "5164:6635", body: "5164:6636", stamp: "5164:6637" },
  { row: "5164:6639", tag: "5164:6641", title: "5164:6642", body: "5164:6643", stamp: "5164:6644" },
  { row: "5164:6646", tag: "5164:6648", title: "5164:6649", body: "5164:6650", stamp: "5164:6651" },
];

const MAQSOOD_MOBILE_ROWS = [
  { row: "5164:6663", tag: "5164:6665", title: "5164:6666", body: "5164:6667", stamp: "5164:6668" },
  { row: "5164:6670", tag: "5164:6672", title: "5164:6673", body: "5164:6674", stamp: "5164:6675" },
  { row: "5164:6677", tag: "5164:6679", title: "5164:6680", body: "5164:6681", stamp: "5164:6682" },
];

/** @type {Array<{ path: string[], description: string, nodeId: string, states?: string[] }>} */
const COMPARISON_FIRST_ENTRIES = [
  {
    path: ["landing", "comparisonFirst", "root"],
    description: "Comparison first block desktop (Gherkin: component.landing.comparisonFirst)",
    nodeId: "5164:6566",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "sectionHeader"], description: "SectionHeader/Comparison", nodeId: "I5164:6566;5006:14" },
  { path: ["landing", "comparisonFirst", "sectionPill"], description: "The Choice section pill", nodeId: "I5164:6566;5006:14;5005:14" },
  { path: ["landing", "comparisonFirst", "sectionPillLabel"], description: "Pill label The Choice", nodeId: "I5164:6566;5006:14;5005:14;3182:15" },
  { path: ["landing", "comparisonFirst", "headingBlock"], description: "Section heading block", nodeId: "I5164:6566;5006:14;5002:1796" },
  { path: ["landing", "comparisonFirst", "sectionHeading"], description: "Section H2 — Dependency or Ownership", nodeId: "I5164:6566;5006:14;5005:17" },
  {
    path: ["landing", "comparisonFirst", "sectionSubtitle"],
    description: "Section subtitle copy",
    nodeId: "I5164:6566;5006:14;5005:18",
  },
  { path: ["landing", "comparisonFirst", "columnsFrame"], description: "Columns + CTA frame", nodeId: "I5164:6566;5002:1800" },
  { path: ["landing", "comparisonFirst", "giantTicket"], description: "GiantTicket two-column card stack", nodeId: "I5164:6566;5006:22" },
  {
    path: ["landing", "comparisonFirst", "industryCard"],
    description: "Industry norm comparison card",
    nodeId: "I5164:6566;5006:22;5005:20",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "industryCardHeader"], description: "Industry card header", nodeId: "I5164:6566;5006:22;5005:20;5004:14" },
  { path: ["landing", "comparisonFirst", "industryBadge"], description: "Industry card header badge", nodeId: "I5164:6566;5006:22;5005:20;5004:17" },
  {
    path: ["landing", "comparisonFirst", "industryBadgeLabel"],
    description: "Industry badge label",
    nodeId: "I5164:6566;5006:22;5005:20;5004:17;3183:14",
  },
  {
    path: ["landing", "comparisonFirst", "industryTitleLine1"],
    description: "Industry card title line 1",
    nodeId: "I5164:6566;5006:22;5005:20;5004:20",
  },
  {
    path: ["landing", "comparisonFirst", "industryTitleLine2"],
    description: "Industry card title line 2",
    nodeId: "I5164:6566;5006:22;5005:20;5004:21",
  },
  { path: ["landing", "comparisonFirst", "industryCardBody"], description: "Industry card body", nodeId: "I5164:6566;5006:22;5005:20;5004:22" },
  ...comparisonDesktopRows("industry", "Industry norm", INDUSTRY_DESKTOP_ROWS),
  { path: ["landing", "comparisonFirst", "dividerPerforated"], description: "Perforated divider between cards", nodeId: "I5164:6566;5006:22;5005:90" },
  {
    path: ["landing", "comparisonFirst", "maqsoodCard"],
    description: "MaqsoodTravel comparison card",
    nodeId: "I5164:6566;5006:22;5005:125",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "maqsoodCardHeader"], description: "Maqsood card header", nodeId: "I5164:6566;5006:22;5005:125;5004:59" },
  { path: ["landing", "comparisonFirst", "maqsoodBadge"], description: "Maqsood card header badge", nodeId: "I5164:6566;5006:22;5005:125;5004:62" },
  {
    path: ["landing", "comparisonFirst", "maqsoodBadgeLabel"],
    description: "Maqsood badge label",
    nodeId: "I5164:6566;5006:22;5005:125;5004:62;3183:16",
  },
  {
    path: ["landing", "comparisonFirst", "maqsoodTitleLine1"],
    description: "Maqsood card title line 1",
    nodeId: "I5164:6566;5006:22;5005:125;5004:65",
  },
  {
    path: ["landing", "comparisonFirst", "maqsoodTitleLine2"],
    description: "Maqsood card title line 2",
    nodeId: "I5164:6566;5006:22;5005:125;5004:66",
  },
  { path: ["landing", "comparisonFirst", "maqsoodCardBody"], description: "Maqsood card body", nodeId: "I5164:6566;5006:22;5005:125;5004:67" },
  ...comparisonDesktopRows("maqsood", "MaqsoodTravel", MAQSOOD_DESKTOP_ROWS),
  { path: ["landing", "comparisonFirst", "notchTop"], description: "GiantTicket top notch", nodeId: "I5164:6566;5006:22;5005:195" },
  { path: ["landing", "comparisonFirst", "ctaBlock"], description: "Footnote + CTA block", nodeId: "I5164:6566;5151:7325" },
  {
    path: ["landing", "comparisonFirst", "footnote"],
    description: "Savings footnote copy",
    nodeId: "I5164:6566;5151:7327",
  },
  {
    path: ["landing", "comparisonFirst", "cta"],
    description: "Book A Free Demo primary CTA",
    nodeId: "I5164:6566;5151:7328",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "ctaLabel"], description: "CTA label Book A Free Demo", nodeId: "I5164:6566;5151:7328;2780:1424" },
  { path: ["landing", "comparisonFirst", "ctaIcon"], description: "CTA icon button", nodeId: "I5164:6566;5151:7328;2780:1425" },
  { path: ["landing", "comparisonFirst", "ctaGraphic"], description: "CTA arrow graphic", nodeId: "I5164:6566;5151:7328;2780:1425;2780:1499" },
  // Mobile — 5164:6609
  {
    path: ["landing", "comparisonFirst", "mobile", "root"],
    description: "Comparison first block mobile (Gherkin @393px)",
    nodeId: "5164:6609",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "mobile", "headerBlock"], description: "Mobile header block", nodeId: "5164:6611" },
  { path: ["landing", "comparisonFirst", "mobile", "sectionPill"], description: "Mobile section pill", nodeId: "5164:6612" },
  { path: ["landing", "comparisonFirst", "mobile", "sectionPillDot"], description: "Mobile pill dot", nodeId: "5164:6613" },
  { path: ["landing", "comparisonFirst", "mobile", "sectionPillLabel"], description: "Mobile pill label The Choice", nodeId: "5164:6614" },
  { path: ["landing", "comparisonFirst", "mobile", "headRow"], description: "Mobile heading row", nodeId: "5164:6615" },
  { path: ["landing", "comparisonFirst", "mobile", "sectionHeadingLine1"], description: "Mobile H2 line 1", nodeId: "5164:6616" },
  { path: ["landing", "comparisonFirst", "mobile", "sectionHeadingLine2"], description: "Mobile H2 line 2", nodeId: "5164:6618" },
  { path: ["landing", "comparisonFirst", "mobile", "sectionSubtitle"], description: "Mobile section subtitle", nodeId: "5164:6619" },
  { path: ["landing", "comparisonFirst", "mobile", "contentFrame"], description: "Mobile cards + CTA frame", nodeId: "5164:6620" },
  { path: ["landing", "comparisonFirst", "mobile", "giantTicket"], description: "Mobile GiantTicket stack", nodeId: "5164:6621" },
  {
    path: ["landing", "comparisonFirst", "mobile", "industryCard"],
    description: "Mobile industry norm card",
    nodeId: "5164:6622",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "mobile", "industryCardHeader"], description: "Mobile industry card header", nodeId: "5164:6623" },
  { path: ["landing", "comparisonFirst", "mobile", "industryBadge"], description: "Mobile industry badge", nodeId: "5164:6626" },
  { path: ["landing", "comparisonFirst", "mobile", "industryTitleLine1"], description: "Mobile industry title line 1", nodeId: "5164:6629" },
  { path: ["landing", "comparisonFirst", "mobile", "industryTitleLine2"], description: "Mobile industry title line 2", nodeId: "5164:6630" },
  { path: ["landing", "comparisonFirst", "mobile", "industryCardBody"], description: "Mobile industry card body", nodeId: "5164:6631" },
  ...comparisonMobileRows("industry", "industry norm", INDUSTRY_MOBILE_ROWS),
  {
    path: ["landing", "comparisonFirst", "mobile", "maqsoodCard"],
    description: "Mobile MaqsoodTravel card",
    nodeId: "5164:6653",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "mobile", "maqsoodCardHeader"], description: "Mobile Maqsood card header", nodeId: "5164:6654" },
  { path: ["landing", "comparisonFirst", "mobile", "maqsoodBadge"], description: "Mobile Maqsood badge", nodeId: "5164:6657" },
  { path: ["landing", "comparisonFirst", "mobile", "maqsoodTitleLine1"], description: "Mobile Maqsood title line 1", nodeId: "5164:6660" },
  { path: ["landing", "comparisonFirst", "mobile", "maqsoodTitleLine2"], description: "Mobile Maqsood title line 2", nodeId: "5164:6661" },
  { path: ["landing", "comparisonFirst", "mobile", "maqsoodCardBody"], description: "Mobile Maqsood card body", nodeId: "5164:6662" },
  ...comparisonMobileRows("maqsood", "MaqsoodTravel", MAQSOOD_MOBILE_ROWS),
  { path: ["landing", "comparisonFirst", "mobile", "ctaBlock"], description: "Mobile footnote + CTA block", nodeId: "5164:6683" },
  { path: ["landing", "comparisonFirst", "mobile", "footnote"], description: "Mobile savings footnote", nodeId: "5164:6684" },
  {
    path: ["landing", "comparisonFirst", "mobile", "cta"],
    description: "Mobile Book A Free Demo CTA",
    nodeId: "5164:6685",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "mobile", "ctaLabel"], description: "Mobile CTA label", nodeId: "5164:6686" },
  { path: ["landing", "comparisonFirst", "mobile", "ctaIcon"], description: "Mobile CTA icon", nodeId: "5164:6687" },
  // Motion — 5164:10411
  {
    path: ["landing", "comparisonFirst", "motion", "root"],
    description: "Comparison motion prototype (Gherkin: 5164:10411)",
    nodeId: "5164:10411",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "motion", "sectionHeader"], description: "Motion section header", nodeId: "I5164:10411;5145:4498" },
  { path: ["landing", "comparisonFirst", "motion", "giantTicket"], description: "Motion GiantTicket", nodeId: "I5164:10411;5145:4500" },
  {
    path: ["landing", "comparisonFirst", "motion", "industryCard"],
    description: "Motion industry card",
    nodeId: "I5164:10411;5145:4500;5005:20",
    states: ["default", "hover"],
  },
  {
    path: ["landing", "comparisonFirst", "motion", "maqsoodCard"],
    description: "Motion Maqsood card",
    nodeId: "I5164:10411;5145:4500;5005:125",
    states: ["default", "hover"],
  },
  { path: ["landing", "comparisonFirst", "motion", "ctaBlock"], description: "Motion CTA block", nodeId: "I5164:10411;5145:4501" },
  {
    path: ["landing", "comparisonFirst", "motion", "cta"],
    description: "Motion primary CTA",
    nodeId: "I5164:10411;5145:4504",
    states: ["default", "hover"],
  },
];

const HOW_IT_WORKS_TEASER_ENTRIES = parseHiwChecklistEntries();

const ENTRIES = [
  ...NAVBAR_ENTRIES,
  ...HERO_ENTRIES,
  ...PROBLEM_ENTRIES,
  ...COMPARISON_FIRST_ENTRIES,
  ...HOW_IT_WORKS_TEASER_ENTRIES,
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
    description: "UI registry — LP-001 Navbar + Hero + Problem + Comparison₁ + HowItWorksTeaser slices (ui-registry-build 2026-07-01)",
    pathGrammar: "<domain>.<segment>(.<segment>)+",
    owner: "MLtravel FE",
    gherkinAliases: {
      "screen.landing": "screen.landing.home",
      "screen.contact": "screen.contact.page",
      "screen.howItWorks": "screen.howItWorks.page",
      "component.navbar": "component.navbar.root",
      "component.landing.hero": "component.landing.hero.root",
      "component.landing.hero.cta": "component.landing.hero.cta",
      "component.landing.problem": "component.landing.problem.root",
      "component.landing.comparisonFirst": "component.landing.comparisonFirst.root",
      "component.landing.howItWorksTeaser": "component.landing.howItWorksTeaser.root",
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
