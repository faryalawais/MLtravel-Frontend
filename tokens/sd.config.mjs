/**
 * Style Dictionary build — compiles the 3-file DTCG token set into:
 *   tokens/build/tokens.css           CSS custom properties on :root
 *   tokens/build/tailwind-tokens.js   Tailwind theme partial (token -> var())
 *
 * Sources (one consolidated Style Dictionary document; merged in order):
 *   tokens/primitives.json   — raw scale tokens (object value forms)
 *   tokens/semantics.json    — semantic alias layer
 *   tokens/typography.json   — compound $type: typography aliases
 *
 * Custom transforms registered here translate the latest W3C DTCG object
 * value forms into Style Dictionary's flat-string expectations:
 *   - dimension `{ value, unit }`  → `"<value><unit>"`
 *   - shadow with nested dimension objects → CSS `box-shadow` string
 * Color object form (`{ colorSpace, components, alpha }`) is handled by
 * Style Dictionary v4's built-in `color/css` transform — no custom code.
 *
 * Custom format registered here:
 *   - `tailwind/tokens` — emits the project's Tailwind theme partial, with
 *     extra handling so compound typography tokens land in a structured
 *     `typography` key consumable by a future tailwind plugin.
 *
 * The CSS file is emitted with `outputReferences: true` so semantic aliases
 * compile to `var(--primitive)` references rather than inlined values. That
 * keeps the file small AND means a future `.dark { … }` block can override a
 * primitive and have every semantic/typography sub-property update
 * automatically.
 *
 * Run: `npm run tokens:build`
 */
import StyleDictionary from 'style-dictionary';

// ---------------------------------------------------------------------------
// CSS-name helper: replace dots inside JSON keys ("0.5") with dashes so the
// emitted CSS var name matches what Style Dictionary's name transform produces.
// ---------------------------------------------------------------------------
function toCssName(path) {
  return path
    .map((seg) =>
      String(seg)
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // colorDark -> color-Dark
        .replace(/\./g, '-')                    // "0.5"     -> "0-5"
        .toLowerCase(),
    )
    .join('-');
}

// ---------------------------------------------------------------------------
// CUSTOM TRANSFORMS
// ---------------------------------------------------------------------------

// color: { colorSpace, components: [r,g,b], alpha }  ->  "#rrggbb" or "rgba(...)"
// Style Dictionary v4's built-in `color/css` only handles string $values
// (hex, rgb, named); the latest DTCG color object form needs its own pass.
StyleDictionary.registerTransform({
  name: 'color/dtcg-to-css',
  type: 'value',
  transitive: true,
  filter: (token) =>
    token.$type === 'color' &&
    token.$value &&
    typeof token.$value === 'object' &&
    Array.isArray(token.$value.components),
  transform: (token) => {
    const { components, alpha = 1 } = token.$value;
    const [r, g, b] = components.map((c) => Math.round(c * 255));
    if (alpha === 1) {
      const hex = [r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('');
      return `#${hex}`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
});

StyleDictionary.registerTransform({
  name: 'duration/object-to-string',
  type: 'value',
  transitive: true,
  filter: (token) =>
    token.$type === 'duration' &&
    token.$value &&
    typeof token.$value === 'object' &&
    'value' in token.$value &&
    'unit' in token.$value,
  transform: (token) => `${token.$value.value}${token.$value.unit}`,
});

StyleDictionary.registerTransform({
  name: 'cubicBezier/css',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'cubicBezier' && Array.isArray(token.$value),
  transform: (token) => `cubic-bezier(${token.$value.join(', ')})`,
});

// dimension: { value: 16, unit: "px" }  ->  "16px"
StyleDictionary.registerTransform({
  name: 'dimension/object-to-string',
  type: 'value',
  transitive: true,
  filter: (token) =>
    token.$type === 'dimension' &&
    token.$value &&
    typeof token.$value === 'object' &&
    'value' in token.$value &&
    'unit' in token.$value,
  transform: (token) => `${token.$value.value}${token.$value.unit}`,
});

function colorObjectToCss(color) {
  if (!color || typeof color !== 'object' || !Array.isArray(color.components)) {
    return String(color ?? '');
  }
  const { components, alpha = 1 } = color;
  const [r, g, b] = components.map((c) => Math.round(c * 255));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shadowLayerToString(layer) {
  const dim = (d) =>
    d && typeof d === 'object' && 'value' in d ? `${d.value}${d.unit ?? 'px'}` : String(d ?? 0);
  return `${dim(layer.offsetX)} ${dim(layer.offsetY)} ${dim(layer.blur)} ${dim(layer.spread)} ${colorObjectToCss(layer.color)}`;
}

// shadow with nested {value,unit} dimensions and DTCG color objects -> CSS box-shadow
StyleDictionary.registerTransform({
  name: 'shadow/object-to-string',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'shadow' && token.$value && typeof token.$value === 'object',
  transform: (token) => {
    const v = token.$value;
    if (Array.isArray(v)) {
      return v.map(shadowLayerToString).join(', ');
    }
    if ('offsetX' in v || 'offsetY' in v) {
      return shadowLayerToString(v);
    }
    return String(v);
  },
});

// fontFamily: ["system-ui", "sans-serif"]  ->  "system-ui, sans-serif"
StyleDictionary.registerTransform({
  name: 'fontFamily/css',
  type: 'value',
  transitive: true,
  filter: (token) => token.$type === 'fontFamily' && Array.isArray(token.$value),
  transform: (token) => token.$value.join(', '),
});

// ---------------------------------------------------------------------------
// CUSTOM TRANSFORM GROUPS — extend the built-ins with our DTCG handlers.
// ---------------------------------------------------------------------------

StyleDictionary.registerTransformGroup({
  name: 'css/dtcg',
  transforms: [
    'attribute/cti',
    'name/kebab',
    'time/seconds',
    'html/icon',
    'size/rem',
    'color/dtcg-to-css',
    'color/css',
    'asset/url',
    'fontFamily/css',
    'dimension/object-to-string',
    'duration/object-to-string',
    'cubicBezier/css',
    'shadow/object-to-string',
  ],
});

StyleDictionary.registerTransformGroup({
  name: 'js/dtcg',
  transforms: [
    'attribute/cti',
    'name/pascal',
    'size/rem',
    'color/dtcg-to-css',
    'color/hex',
    'fontFamily/css',
    'dimension/object-to-string',
    'duration/object-to-string',
    'cubicBezier/css',
    'shadow/object-to-string',
  ],
});

// ---------------------------------------------------------------------------
// CUSTOM FORMATS
// ---------------------------------------------------------------------------

/**
 * Expand compound `$type: typography` tokens into one CSS variable per
 * sub-property. The Style Dictionary `css/variables` format on its own would
 * stringify the compound $value as JSON which is unusable in CSS.
 *
 * Output shape, per compound token at path `typography.heading.lg.bold`:
 *   --typography-heading-lg-bold-font-family: <value>;
 *   --typography-heading-lg-bold-font-size:   <value>;
 *   --typography-heading-lg-bold-font-weight: <value>;
 *   --typography-heading-lg-bold-line-height: <value>;
 *
 * Aliases inside the compound (`fontFamily: "{font.family.heading}"`) are
 * resolved to `var(--font-family-heading)` when `outputReferences: true`,
 * else to the resolved value.
 */
function typographyCssVars(dictionary, outputReferences) {
  const lines = [];
  for (const token of dictionary.allTokens) {
    if (token.$type !== 'typography') continue;
    const baseName = toCssName(token.path);
    const v = token.$value;
    const original = token.original?.$value ?? {};
    const subProps = [
      ['font-family', v.fontFamily, original.fontFamily],
      ['font-size',   v.fontSize,   original.fontSize],
      ['font-weight', v.fontWeight, original.fontWeight],
      ['line-height', v.lineHeight, original.lineHeight],
    ];
    for (const [suffix, resolved, raw] of subProps) {
      if (resolved == null) continue;
      const aliasMatch = typeof raw === 'string' && raw.match(/^\{([^}]+)\}$/);
      const cssVal =
        outputReferences && aliasMatch
          ? `var(--${toCssName(aliasMatch[1].split('.'))})`
          : String(resolved);
      lines.push(`  --${baseName}-${suffix}: ${cssVal};`);
    }
  }
  return lines.join('\n');
}

StyleDictionary.registerFormat({
  name: 'css/variables-dtcg',
  format: ({ dictionary, options = {} }) => {
    const outputReferences = options.outputReferences !== false;
    const header = '/**\n * Do not edit directly, this file was auto-generated.\n */\n\n:root {\n';

    // Built-in vars for atomic tokens, but exclude typography compounds.
    const atomLines = [];
    for (const token of dictionary.allTokens) {
      if (token.$type === 'typography') continue;
      const name = toCssName(token.path);
      const raw = token.original?.$value;
      const aliasMatch = typeof raw === 'string' && raw.match(/^\{([^}]+)\}$/);
      const cssVal =
        outputReferences && aliasMatch
          ? `var(--${toCssName(aliasMatch[1].split('.'))})`
          : String(token.$value);
      const desc = token.$description ? ` /** ${token.$description} */` : '';
      atomLines.push(`  --${name}: ${cssVal};${desc}`);
    }

    const typoLines = typographyCssVars(dictionary, outputReferences);
    return (
      header +
      atomLines.join('\n') +
      (typoLines ? '\n\n  /* compound typography (expanded per-property) */\n' + typoLines : '') +
      '\n}\n'
    );
  },
});

/**
 * Tailwind theme partial. Atomic tokens (color, dimension, fontFamily,
 * fontWeight, shadow) land in Tailwind's standard `colors / spacing /
 * borderRadius / fontSize / fontFamily / fontWeight / lineHeight / boxShadow`
 * keys. Compound typography tokens land under a non-standard `typography`
 * key with each sub-property as a `var(--…)` reference, intended for a
 * future Tailwind plugin to consume.
 *
 * `colorDark.*` primitives are intentionally not exposed — Tailwind dark
 * mode should rely on `.dark { --color-x: … }` redefinitions, not a
 * parallel namespace. Tracked as W-1.
 */
StyleDictionary.registerFormat({
  name: 'tailwind/tokens',
  format: ({ dictionary }) => {
    const groups = {
      colors: {},
      spacing: {},
      borderRadius: {},
      fontSize: {},
      fontFamily: {},
      fontWeight: {},
      lineHeight: {},
      boxShadow: {},
      typography: {},
    };

    for (const token of dictionary.allTokens) {
      const cat = token.path[0];
      const cssVar = `var(--${toCssName(token.path)})`;
      const tailwindKey = token.path.slice(1).join('-');

      if (cat === 'color') {
        groups.colors[tailwindKey] = cssVar;
      } else if (cat === 'spacing' || cat === 'space') {
        groups.spacing[token.path.slice(1).join('.')] = cssVar;
      } else if (cat === 'radii' || cat === 'radius') {
        groups.borderRadius[tailwindKey] = cssVar;
      } else if (cat === 'font') {
        const sub = token.path[1];
        const key = token.path.slice(2).join('-');
        if (sub === 'size') groups.fontSize[key] = cssVar;
        else if (sub === 'family') groups.fontFamily[key] = cssVar;
        else if (sub === 'weight') groups.fontWeight[key] = cssVar;
        else if (sub === 'lineHeight') groups.lineHeight[key] = cssVar;
      } else if (cat === 'shadows' || cat === 'shadow') {
        groups.boxShadow[tailwindKey] = cssVar;
      } else if (cat === 'typography') {
        const baseName = toCssName(token.path);
        groups.typography[tailwindKey] = {
          fontFamily: `var(--${baseName}-font-family)`,
          fontSize: `var(--${baseName}-font-size)`,
          fontWeight: `var(--${baseName}-font-weight)`,
          lineHeight: `var(--${baseName}-line-height)`,
        };
      }
      // colorDark.* intentionally skipped; see file header.
    }

    return (
      '/** AUTO-GENERATED by Style Dictionary (npm run tokens:build). Do not edit. */\n' +
      `export default ${JSON.stringify(groups, null, 2)};\n`
    );
  },
});

// ---------------------------------------------------------------------------
// MAIN BUILD
// ---------------------------------------------------------------------------

const sd = new StyleDictionary({
  source: ['tokens/primitives.json', 'tokens/semantics.json', 'tokens/typography.json'],
  platforms: {
    css: {
      transformGroup: 'css/dtcg',
      buildPath: 'tokens/build/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables-dtcg',
          options: { outputReferences: true },
        },
      ],
    },
    tailwind: {
      transformGroup: 'js/dtcg',
      buildPath: 'tokens/build/',
      files: [{ destination: 'tailwind-tokens.js', format: 'tailwind/tokens' }],
    },
  },
});

await sd.buildAllPlatforms();
console.log('Tokens built: tokens/build/tokens.css, tokens/build/tailwind-tokens.js');
