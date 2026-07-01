#!/usr/bin/env node
/**
 * Merge ML Travel Token Press exports into the 3-file pipeline shape:
 *   primitives.json · semantics.json · typography.json
 *
 * Sources (archived to tokens/archive/ml-travel-export/ after run):
 *   primitives-color.json · primitives-font.json · primitives-spacing.json
 *   primitives-radius.json · semantic-color.json · shadows.json
 *   typography.json (tagged in place) · motion-tokens.json (optional)
 */
import { readFileSync, writeFileSync, mkdirSync, renameSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS = join(ROOT, "tokens");
const ARCHIVE = join(TOKENS, "archive/ml-travel-export");
const SOURCE = "figma";

const SOURCE_FILES = [
  "primitives-color.json",
  "primitives-font.json",
  "primitives-spacing.json",
  "primitives-radius.json",
  "semantic-color.json",
  "shadows.json",
  "motion-tokens.json",
  "layout-grid.json",
  "HIW-motion-tokens.json",
  "MOTION-SPEC.md",
  "HIW-MOTION-SPEC.md",
];

function load(name) {
  const p = name.includes("/") ? join(TOKENS, name) : join(TOKENS, name);
  return JSON.parse(readFileSync(p, "utf8"));
}

function loadIfExists(...candidates) {
  for (const name of candidates) {
    const p = name.includes("/") ? join(TOKENS, name) : join(TOKENS, name);
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8"));
  }
  throw new Error(`Missing token source: ${candidates.join(" or ")}`);
}

function loadOptional(...candidates) {
  for (const name of candidates) {
    const p = name.includes("/") ? join(TOKENS, name) : join(TOKENS, name);
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf8"));
  }
  return null;
}

function stripMeta(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if (node.$value !== undefined && node.$type !== undefined) {
    const { $type, $value, $description } = node;
    const out = { $type, $value };
    if ($description) out.$description = $description;
    return out;
  }
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    out[k] = stripMeta(v);
  }
  return out;
}

function tagPrimitives(node, source = SOURCE) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if (node.$value !== undefined && node.$type !== undefined) {
    return {
      ...node,
      $extensions: {
        ...(node.$extensions ?? {}),
        layer: "primitive",
        source,
      },
    };
  }
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    out[k] = tagPrimitives(v, source);
  }
  return out;
}

function sem(type, alias, aliasOf) {
  return {
    $type: type,
    $value: alias,
    $extensions: { layer: "semantic", source: SOURCE, aliasOf },
  };
}

const SEGMENT =
  /^(\d+(\.\d+)?|px|\d+[a-z][a-z0-9]*|[a-z][a-zA-Z0-9]*(-[a-z0-9]+)*)$/;

function sanitizeLetterspacingKey(key) {
  if (SEGMENT.test(key)) return key;
  if (/^\d+-\d/.test(key)) return `pos${key.replace("-", "p")}`;
  return `v${key.replace(/[^a-zA-Z0-9]/g, "")}`;
}

/** Rename invalid letterspacing segments; return map oldKey → newKey for typography patch. */
function fixLetterspacingPrimitives(letterspacing) {
  if (!letterspacing) return { letterspacing, keyMap: {} };
  const keyMap = {};
  const out = {};
  for (const [k, v] of Object.entries(letterspacing)) {
    const nk = sanitizeLetterspacingKey(k);
    keyMap[k] = nk;
    out[nk] = v;
  }
  return { letterspacing: out, keyMap };
}

/** DTCG: font.family leaves must be fontFamily arrays, not string. */
function fixFontPrimitives(font) {
  if (!font) return font;
  const { letterspacing, keyMap } = fixLetterspacingPrimitives(font.letterspacing);
  const family = {};
  for (const [k, v] of Object.entries(font.family ?? {})) {
    if (v.$type === "string" && typeof v.$value === "string") {
      family[k] = {
        ...v,
        $type: "fontFamily",
        $value: [v.$value, "system-ui", "sans-serif"],
      };
    } else {
      family[k] = v;
    }
  }
  const { style: _style, ...rest } = font;
  return { ...rest, family, letterspacing, __letterspacingKeyMap: keyMap };
}

/** radius.full from Figma may be number; pipeline expects dimension for pill alias. */
function fixRadiusPrimitives(radius) {
  if (!radius?.full || radius.full.$type !== "number") return radius;
  const { $value, $description } = radius.full;
  return {
    ...radius,
    full: {
      $type: "dimension",
      $value: { value: $value, unit: "px" },
      ...($description ? { $description } : {}),
    },
  };
}

function parseMs(str) {
  const m = String(str).match(/^(\d+(?:\.\d+)?)ms$/);
  if (!m) return { value: 700, unit: "ms" };
  return { value: Number(m[1]), unit: "ms" };
}

function buildSpacing() {
  const px = (n) => ({ value: n, unit: "px" });
  const keys = {
    0: 0,
    px: 1,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
  };
  const spacing = {};
  for (const [k, v] of Object.entries(keys)) {
    spacing[k] = primitive("dimension", px(v));
  }
  return spacing;
}

function buildRadii() {
  const px = (n) => ({ value: n, unit: "px" });
  return {
    none: primitive("dimension", px(0)),
    sm: primitive("dimension", px(4)),
    base: primitive("dimension", px(8)),
    md: primitive("dimension", px(12)),
    lg: primitive("dimension", px(16)),
    xl: primitive("dimension", px(20)),
    "2xl": primitive("dimension", px(24)),
    full: primitive("dimension", px(9999)),
  };
}

function primitive(type, value, description) {
  const t = {
    $type: type,
    $value: value,
    $extensions: { layer: "primitive", source: SOURCE },
  };
  if (description) t.$description = description;
  return t;
}

function tagSemantics(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if (node.$value !== undefined && node.$type !== undefined) {
    const aliasOf =
      typeof node.$value === "string" && node.$value.startsWith("{")
        ? node.$value.slice(1, -1)
        : undefined;
    return {
      $type: node.$type,
      $value: node.$value,
      ...(node.$description ? { $description: node.$description } : {}),
      $extensions: {
        ...(node.$extensions?.figma ? { figma: node.$extensions.figma } : {}),
        layer: "semantic",
        source: SOURCE,
        ...(aliasOf ? { aliasOf } : {}),
      },
    };
  }
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    out[k] = tagSemantics(v);
  }
  return out;
}

function buildPipelineAction(ml) {
  const p = ml.primary;
  const s = ml.secondary;
  return {
    primary: {
      default: {
        background: sem("color", p.default.$value, p.default.$value.slice(1, -1)),
        label: sem("color", p.label.$value, p.label.$value.slice(1, -1)),
      },
      hover: {
        background: sem("color", p.hover.$value, p.hover.$value.slice(1, -1)),
        label: sem("color", p.label.$value, p.label.$value.slice(1, -1)),
      },
      active: {
        background: sem("color", p.pressed.$value, p.pressed.$value.slice(1, -1)),
        label: sem("color", p.label.$value, p.label.$value.slice(1, -1)),
      },
      focused: {
        background: sem("color", p.default.$value, p.default.$value.slice(1, -1)),
        label: sem("color", p.label.$value, p.label.$value.slice(1, -1)),
        border: sem("color", "{color.orange.500}", "color.orange.500"),
      },
      disabled: {
        background: sem("color", "{color.neutral.200}", "color.neutral.200"),
        label: sem("color", "{color.neutral.700}", "color.neutral.700"),
      },
    },
    secondary: {
      default: {
        background: sem("color", s.default.$value, s.default.$value.slice(1, -1)),
        label: sem("color", s["label-default"].$value, s["label-default"].$value.slice(1, -1)),
      },
      hover: {
        background: sem("color", s.hover.$value, s.hover.$value.slice(1, -1)),
        label: sem("color", s["label-hover"].$value, s["label-hover"].$value.slice(1, -1)),
      },
      active: {
        background: sem("color", s.pressed.$value, s.pressed.$value.slice(1, -1)),
        label: sem("color", s["label-hover"].$value, s["label-hover"].$value.slice(1, -1)),
      },
      focused: {
        background: sem("color", s.default.$value, s.default.$value.slice(1, -1)),
        label: sem("color", s["label-default"].$value, s["label-default"].$value.slice(1, -1)),
        border: sem("color", s.border.$value, s.border.$value.slice(1, -1)),
      },
      disabled: {
        background: sem("color", "{color.neutral.100}", "color.neutral.100"),
        label: sem("color", "{color.neutral.700}", "color.neutral.700"),
      },
    },
    tertiary: {
      default: {
        background: sem("color", "{color.neutral.0}", "color.neutral.0"),
        label: sem("color", "{color.navy.500}", "color.navy.500"),
      },
      hover: {
        background: sem("color", "{color.neutral.50}", "color.neutral.50"),
        label: sem("color", "{color.navy.600}", "color.navy.600"),
      },
      active: {
        background: sem("color", "{color.neutral.100}", "color.neutral.100"),
        label: sem("color", "{color.navy.600}", "color.navy.600"),
      },
      focused: {
        background: sem("color", "{color.neutral.0}", "color.neutral.0"),
        label: sem("color", "{color.navy.500}", "color.navy.500"),
        border: sem("color", "{color.navy.500}", "color.navy.500"),
      },
      disabled: {
        background: sem("color", "{color.neutral.100}", "color.neutral.100"),
        label: sem("color", "{color.neutral.700}", "color.neutral.700"),
      },
    },
    danger: {
      default: {
        background: sem("color", "{color.red.500}", "color.red.500"),
        label: sem("color", "{color.neutral.0}", "color.neutral.0"),
      },
      hover: {
        background: sem("color", "{color.red.500}", "color.red.500"),
        label: sem("color", "{color.neutral.0}", "color.neutral.0"),
      },
      active: {
        background: sem("color", "{color.red.500}", "color.red.500"),
        label: sem("color", "{color.neutral.0}", "color.neutral.0"),
      },
      focused: {
        background: sem("color", "{color.red.500}", "color.red.500"),
        label: sem("color", "{color.neutral.0}", "color.neutral.0"),
        border: sem("color", "{color.red.500}", "color.red.500"),
      },
      disabled: {
        background: sem("color", "{color.neutral.200}", "color.neutral.200"),
        label: sem("color", "{color.neutral.700}", "color.neutral.700"),
      },
    },
  };
}

function buildPipelineSemantics(semanticColor) {
  const ml = stripMeta(semanticColor.color);
  const mlAction = ml.action;
  const { action: _a, ...mlColorRest } = ml;

  const bg = ml.background;

  return {
    color: {
      ...tagSemantics(mlColorRest),
      surface: {
        canvas: sem("color", bg.page.$value, "color.background.page"),
        raised: sem("color", bg.surface.$value, "color.background.surface"),
        sunken: sem("color", bg.subtle.$value, "color.background.subtle"),
        muted: sem("color", bg["surface-warm"].$value, "color.background.surface-warm"),
        inverse: sem("color", bg.dark.$value, "color.background.dark"),
        "inverse-muted": sem("color", "{color.neutral.700}", "color.neutral.700"),
      },
      border: {
        default: sem("color", "{color.neutral.200}", "color.neutral.200"),
        subtle: sem("color", "{color.neutral.100}", "color.neutral.100"),
        strong: sem("color", "{color.neutral.800}", "color.neutral.800"),
        focus: sem("color", "{color.orange.500}", "color.orange.500"),
        success: sem("color", "{color.green.500}", "color.green.500"),
        warning: sem("color", "{color.orange.500}", "color.orange.500"),
        error: sem("color", "{color.red.500}", "color.red.500"),
        info: sem("color", "{color.navy.500}", "color.navy.500"),
      },
      action: buildPipelineAction(mlAction),
      input: {
        surface: sem("color", "{color.neutral.0}", "color.neutral.0"),
        border: sem("color", "{color.neutral.200}", "color.neutral.200"),
        "placeholder-dim": sem("color", "{color.neutral.700}", "color.neutral.700"),
        icon: {
          default: sem("color", "{color.neutral.700}", "color.neutral.700"),
          error: sem("color", "{color.red.500}", "color.red.500"),
          disabled: sem("color", "{color.neutral.200}", "color.neutral.200"),
        },
        default: {
          empty: {
            border: sem("color", "{color.neutral.200}", "color.neutral.200"),
            placeholder: sem("color", "{color.neutral.700}", "color.neutral.700"),
            value: sem("color", "{color.neutral.900}", "color.neutral.900"),
            helper: sem("color", "{color.neutral.800}", "color.neutral.800"),
            surface: sem("color", "{color.neutral.0}", "color.neutral.0"),
          },
          focused: {
            border: sem("color", "{color.orange.500}", "color.orange.500"),
            placeholder: sem("color", "{color.neutral.700}", "color.neutral.700"),
            value: sem("color", "{color.neutral.900}", "color.neutral.900"),
            helper: sem("color", "{color.neutral.800}", "color.neutral.800"),
            surface: sem("color", "{color.neutral.0}", "color.neutral.0"),
          },
          filled: {
            border: sem("color", "{color.neutral.200}", "color.neutral.200"),
            placeholder: sem("color", "{color.neutral.700}", "color.neutral.700"),
            value: sem("color", "{color.neutral.900}", "color.neutral.900"),
            helper: sem("color", "{color.neutral.800}", "color.neutral.800"),
            surface: sem("color", "{color.neutral.0}", "color.neutral.0"),
          },
          error: {
            border: sem("color", "{color.red.500}", "color.red.500"),
            placeholder: sem("color", "{color.neutral.700}", "color.neutral.700"),
            value: sem("color", "{color.neutral.900}", "color.neutral.900"),
            helper: sem("color", "{color.red.500}", "color.red.500"),
            surface: sem("color", "{color.neutral.0}", "color.neutral.0"),
          },
          disabled: {
            border: sem("color", "{color.neutral.100}", "color.neutral.100"),
            placeholder: sem("color", "{color.neutral.200}", "color.neutral.200"),
            value: sem("color", "{color.neutral.700}", "color.neutral.700"),
            helper: sem("color", "{color.neutral.200}", "color.neutral.200"),
            surface: sem("color", "{color.neutral.50}", "color.neutral.50"),
          },
        },
      },
      feedback: {
        success: {
          background: sem("color", "{color.green.500}", "color.green.500"),
          foreground: sem("color", "{color.neutral.0}", "color.neutral.0"),
          border: sem("color", "{color.green.500}", "color.green.500"),
          icon: sem("color", "{color.green.500}", "color.green.500"),
        },
        warning: {
          background: sem("color", "{color.orange.500}", "color.orange.500"),
          foreground: sem("color", "{color.neutral.0}", "color.neutral.0"),
          border: sem("color", "{color.orange.500}", "color.orange.500"),
          icon: sem("color", "{color.orange.500}", "color.orange.500"),
        },
        error: {
          background: sem("color", "{color.red.500}", "color.red.500"),
          foreground: sem("color", "{color.neutral.0}", "color.neutral.0"),
          border: sem("color", "{color.red.500}", "color.red.500"),
          icon: sem("color", "{color.red.500}", "color.red.500"),
        },
        info: {
          background: sem("color", "{color.navy.500}", "color.navy.500"),
          foreground: sem("color", "{color.neutral.0}", "color.neutral.0"),
          border: sem("color", "{color.navy.500}", "color.navy.500"),
          icon: sem("color", "{color.navy.500}", "color.navy.500"),
        },
      },
      focus: {
        ring: sem("color", "{color.orange.500}", "color.orange.500"),
        "ring-error": sem("color", "{color.red.500}", "color.red.500"),
        "ring-info": sem("color", "{color.navy.500}", "color.navy.500"),
      },
    },
    space: {
      xs: sem("dimension", "{spacing.4}", "spacing.4"),
      sm: sem("dimension", "{spacing.8}", "spacing.8"),
      md: sem("dimension", "{spacing.16}", "spacing.16"),
      lg: sem("dimension", "{spacing.24}", "spacing.24"),
      xl: sem("dimension", "{spacing.32}", "spacing.32"),
      "2xl": sem("dimension", "{spacing.40}", "spacing.40"),
      "3xl": sem("dimension", "{spacing.64}", "spacing.64"),
      gap: sem("dimension", "{spacing.12}", "spacing.12"),
      gutter: sem("dimension", "{spacing.16}", "spacing.16"),
      section: sem("dimension", "{spacing.64}", "spacing.64"),
    },
    radius: {
      control: sem("dimension", "{radius.8}", "radius.8"),
      surface: sem("dimension", "{radius.8}", "radius.8"),
      panel: sem("dimension", "{radius.20}", "radius.20"),
      pill: sem("dimension", "{radius.full}", "radius.full"),
      sharp: sem("dimension", "{radius.0}", "radius.0"),
    },
    shadow: {
      sm: sem("shadow", "{shadow.card}", "shadow.card"),
      md: sem("shadow", "{shadow.card-elevated}", "shadow.card-elevated"),
      lg: sem("shadow", "{shadow.card-elevated}", "shadow.card-elevated"),
      focus: sem("shadow", "{shadow.card}", "shadow.card"),
    },
  };
}

function collectAliasRefs(typographyTree) {
  const refs = new Set();
  function walk(obj) {
    if (!obj || typeof obj !== "object") return;
    if (obj.$type === "typography" && obj.$value) {
      for (const v of Object.values(obj.$value)) {
        if (typeof v === "string" && /^\{[a-zA-Z0-9_.-]+\}$/.test(v)) refs.add(v.slice(1, -1));
      }
      return;
    }
    for (const v of Object.values(obj)) {
      if (v && typeof v === "object") walk(v);
    }
  }
  walk(typographyTree.typography ?? typographyTree);
  return refs;
}

const FONT_FAMILY_NAMES = { satoshi: "Satoshi", inter: "Inter" };

function buildFontPrimitivesFromRefs(typographyTree) {
  const refs = collectAliasRefs(typographyTree);
  const family = {};
  const size = {};
  const weight = {};
  const lineHeight = {};
  const letterSpacing = {};

  for (const path of refs) {
    const [root, group, key] = path.split(".");
    if (root !== "font" || !group || !key) continue;
    if (group === "family" && !family[key]) {
      const name = FONT_FAMILY_NAMES[key] ?? key;
      family[key] = primitive("fontFamily", [name, "system-ui", "sans-serif"]);
    }
    if (group === "size" && !size[key]) {
      const n = Number(key.replace("-", "."));
      size[key] = primitive("dimension", { value: n, unit: "px" });
    }
    if (group === "weight" && !weight[key]) {
      weight[key] = primitive("fontWeight", Number(key));
    }
    if (group === "lineHeight" && !lineHeight[key]) {
      lineHeight[key] = primitive("number", Number(key.replace("-", ".")));
    }
    if (group === "letterSpacing" && !letterSpacing[key]) {
      letterSpacing[key] = primitive("dimension", {
        value: Number(key.replace("-", ".")),
        unit: "px",
      });
    }
  }

  return { family, size, weight, lineHeight, letterSpacing };
}

function typographyUsesAliases(typographyTree) {
  let found = false;
  function walk(obj) {
    if (!obj || typeof obj !== "object" || found) return;
    if (obj.$type === "typography" && obj.$value?.fontFamily) {
      found = String(obj.$value.fontFamily).startsWith("{font.");
      return;
    }
    for (const v of Object.values(obj)) walk(v);
  }
  walk(typographyTree.typography ?? typographyTree);
  return found;
}

function tagTypographySemantics(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if (node.$type === "typography") {
    const { fontStyle: _fontStyle, ...value } = node.$value ?? {};
    return {
      $type: "typography",
      $value: value,
      ...(node.$description ? { $description: node.$description } : {}),
      $extensions: { layer: "semantic", source: SOURCE },
    };
  }
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    out[k] = tagTypographySemantics(v);
  }
  return out;
}

function convertTypographyLiterals(node) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if (node.$type === "typography") {
    const v = node.$value;
    const fk = familyKey(v.fontFamily);
    const sk = String(v.fontSize?.value ?? 16).replace(".", "-");
    const wk = String(v.fontWeight ?? 400);
    const lk =
      typeof v.lineHeight === "number"
        ? String(v.lineHeight).replace(".", "-")
        : String(v.lineHeight?.value ?? 1.5).replace(".", "-");
    const out = {
      $type: "typography",
      $value: {
        fontFamily: `{font.family.${fk}}`,
        fontSize: `{font.size.${sk}}`,
        fontWeight: `{font.weight.${wk}}`,
        lineHeight: `{font.lineHeight.${lk}}`,
      },
      $extensions: { layer: "semantic", source: SOURCE },
    };
    if (v.letterSpacing?.value != null) {
      const ak = String(v.letterSpacing.value).replace(".", "-");
      out.$value.letterSpacing = `{font.letterSpacing.${ak}}`;
    }
    return out;
  }
  const out = {};
  for (const [k, val] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    out[k] = convertTypographyLiterals(val);
  }
  return out;
}

function familyKey(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function prepareTypography(typographyRaw, letterspacingKeyMap = {}) {
  const stripped = stripMeta(typographyRaw.typography ?? typographyRaw);
  const patched = patchLetterspacingRefs(stripped, letterspacingKeyMap);
  const tree = { typography: patched };
  const body = typographyUsesAliases(tree)
    ? tagTypographySemantics(patched)
    : convertTypographyLiterals(patched);
  return { typography: body };
}

function patchLetterspacingRefs(node, keyMap) {
  if (!node || typeof node !== "object" || Array.isArray(node)) return node;
  if (node.$type === "typography" && node.$value) {
    const value = { ...node.$value };
    if (typeof value.letterSpacing === "string" && value.letterSpacing.startsWith("{font.letterspacing.")) {
      const oldKey = value.letterSpacing.slice("{font.letterspacing.".length, -1);
      const newKey = keyMap[oldKey] ?? oldKey;
      value.letterSpacing = `{font.letterspacing.${newKey}}`;
    }
    return { ...node, $value: value };
  }
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    out[k] = patchLetterspacingRefs(v, keyMap);
  }
  return out;
}

function buildMotion(motion) {
  const m = motion.motion;
  return {
    duration: {
      default: primitive("duration", parseMs(m.duration.default.$value), m.duration.default.$description),
      "step-delay": primitive("duration", parseMs(m.duration["step-delay"].$value), m.duration["step-delay"].$description),
      "auto-advance-delay": primitive(
        "duration",
        parseMs(m.duration["auto-advance-delay"].$value),
        m.duration["auto-advance-delay"].$description,
      ),
    },
    easing: {
      "ease-in": primitive("cubicBezier", m.easing["ease-in"].$value, m.easing["ease-in"].$description),
      "ease-out": primitive("cubicBezier", m.easing["ease-out"]?.$value ?? [0, 0, 0.58, 1], "ease-out"),
    },
  };
}

// --- main ---
const primitivesColor = loadIfExists("primitives-color.json", "archive/ml-travel-export/primitives-color.json");
const primitivesFont = loadIfExists("primitives-font.json", "archive/ml-travel-export/primitives-font.json");
const primitivesSpacing = loadIfExists(
  "primitives-spacing.json",
  "archive/ml-travel-export/primitives-spacing.json",
);
const primitivesRadius = loadIfExists(
  "primitives-radius.json",
  "archive/ml-travel-export/primitives-radius.json",
);
const semanticColor = loadIfExists("semantic-color.json", "archive/ml-travel-export/semantic-color.json");
const shadows = loadIfExists("shadows.json", "archive/ml-travel-export/shadows.json");
const typographyRaw = loadIfExists("typography.json", "archive/ml-travel-export/typography.json");
const motion = loadOptional("motion-tokens.json", "archive/ml-travel-export/motion-tokens.json");

const fontRaw = fixFontPrimitives(stripMeta(primitivesFont.font));
const letterspacingKeyMap = fontRaw.__letterspacingKeyMap ?? {};
const { __letterspacingKeyMap: _m, ...fontFixed } = fontRaw;
const radiusFixed = fixRadiusPrimitives(stripMeta(primitivesRadius.radius));

const primitives = {
  $schema: "https://tr.designtokens.org/format/",
  color: tagPrimitives(stripMeta(primitivesColor.color)),
  shadow: tagPrimitives(stripMeta(shadows.shadow)),
  spacing: tagPrimitives(stripMeta(primitivesSpacing.spacing)),
  radius: tagPrimitives(radiusFixed),
  font: tagPrimitives(fontFixed),
  ...(motion ? { motion: tagPrimitives(buildMotion(motion)) } : {}),
};

const semantics = {
  $schema: "https://tr.designtokens.org/format/",
  ...buildPipelineSemantics(semanticColor),
};

const typography = {
  $schema: "https://tr.designtokens.org/format/",
  ...prepareTypography(typographyRaw, letterspacingKeyMap),
};

writeFileSync(join(TOKENS, "primitives.json"), JSON.stringify(primitives, null, 2) + "\n");
writeFileSync(join(TOKENS, "semantics.json"), JSON.stringify(semantics, null, 2) + "\n");
writeFileSync(join(TOKENS, "typography.json"), JSON.stringify(typography, null, 2) + "\n");

mkdirSync(ARCHIVE, { recursive: true });
for (const f of SOURCE_FILES) {
  const from = join(TOKENS, f);
  const to = join(ARCHIVE, f);
  if (existsSync(from)) renameSync(from, to);
}

console.log("✔ Merged ML Travel tokens → primitives.json, semantics.json, typography.json");
console.log("✔ Archived sources → tokens/archive/ml-travel-export/");
console.log("  Motion tokens live in primitives.motion.* (duration + easing)");
console.log("  Run: npm run tokens:validate && npm run tokens:build");
