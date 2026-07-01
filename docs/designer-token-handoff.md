# Design token handoff — ML Travel (designer fix list)

**Audience:** Designer / design-system owner  
**Current fix list (short):** [`designer-token-validation-ask.md`](./designer-token-validation-ask.md) — send this for the June 2026 upload  
**Pipeline spec:** W3C DTCG · three-file Tokens Studio convention · `design-tokens` skill  
**Figma file:** `h6BqI1ZRMSJxR7jESNF0Ep` — [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?p=f&m=dev)

This document is the **canonical token syntax** (shapes, groups, metadata). The validation-ask doc is the **delta list** for the latest upload only.

---

## 0. Your 8 uploaded files — per-file audit (historical)

> **Superseded** by the June 2026 three-file upload in `tokens/`. For what to fix **now**, use [`designer-token-validation-ask.md`](./designer-token-validation-ask.md).  
> Section kept for audit history only.

These were the files dropped into `tokens/` at project start. They were preserved in `tokens/archive/ml-travel-export/` (since removed for re-upload).

| # | File | Type | Leaves | Verdict |
|---|------|------|--------|---------|
| 1 | `primitives-color.json` | JSON | 16 | ⚠️ Colors OK — missing spacing, radii, font, motion |
| 2 | `semantic-color.json` | JSON | 47 | ⚠️ Color aliases OK — missing pipeline groups + wrong action shape |
| 3 | `typography.json` | JSON | 51 | ❌ Originally literals, not aliases; no font primitives to resolve |
| 4 | `shadows.json` | JSON | 5 | ⚠️ DTCG shadow shape OK — missing `layer` metadata |
| 5 | `layout-grid.json` | JSON | 2 | ℹ️ Reference only — not a compile token |
| 6 | `motion-tokens.json` | JSON | 5 | ❌ Duration `"700ms"` strings; no `$extensions` |
| 7 | `HIW-motion-tokens.json` | JSON | 4 | ❌ Duplicate of #6; same duration format issues |
| 8 | `MOTION-SPEC.md` | Markdown | — | ✅ Keep as motion behaviour doc for engineering |

**Also in archive (9th file):** `HIW-MOTION-SPEC.md` — same as #8, page-specific motion notes. ✅

**Not in your upload:** `primitives.json` / `semantics.json` / `typography.json` as a 3-file set — you shipped **6 JSON + 2 markdown** instead.

---

### File 1 — `primitives-color.json`

**What’s good**
- 16 color primitives, all valid DTCG srgb objects (no hex strings)
- Orange, navy, red, teal, green, neutral ramps present

**What’s missing (entire groups)**
| Group | Status |
|-------|--------|
| `spacing.*` | ❌ Not in file |
| `radii.*` / `radius.*` | ❌ Not in file |
| `font.family.*` | ❌ Not in file |
| `font.size.*` | ❌ Not in file |
| `font.weight.*` | ❌ Not in file |
| `font.lineHeight.*` | ❌ Not in file |
| `font.letterSpacing.*` | ❌ Not in file |
| `shadow.*` | ❌ In separate `shadows.json` — must merge into primitives |
| `motion.*` | ❌ In separate `motion-tokens.json` |

**Metadata**
- ❌ Every leaf: missing `$extensions.layer: "primitive"`
- ⚠️ Has `$extensions.figma` only — add `"source": "tokens-studio"`

**Primitives present (complete list)**
```
color.orange.500, .600, .700
color.navy.500, .600
color.red.500
color.teal.500
color.green.500
color.neutral.0, .50, .100, .150, .200, .700, .800, .900
```

---

### File 2 — `semantic-color.json`

**What’s good**
- 47 semantic colors; every `{color.*}` alias resolves to file 1 ✅
- Product naming useful: `background`, `text`, `border`, `pill`, `icon`

**What’s missing (pipeline-required groups)**
| Group | In your file? |
|-------|----------------|
| `color.surface.*` | ❌ (you have `color.background.*` instead) |
| `color.action.tertiary.*` | ❌ |
| `color.action.danger.*` | ❌ |
| `color.input.*` | ❌ (needed for Contact form) |
| `color.feedback.{success,warning,error,info}.*` | ❌ |
| `color.focus.{ring, ring-error, ring-info}` | ❌ |
| `space.*` | ❌ |
| `radius.*` | ❌ |
| `shadow.*` (semantic aliases) | ❌ |

**Wrong shape — `color.action`**
Your file uses **flat** tokens:
```
color.action.primary.default      (single color)
color.action.primary.hover
color.action.primary.pressed
color.action.primary.label
```
Pipeline requires **nested slots** — see §5.

**Metadata**
- ❌ All 47 leaves: missing `$extensions.layer: "semantic"`

**Semantics present (complete list)**
```
color.background.page, .surface, .surface-warm, .subtle, .dark, .dark-deep
color.text.primary, .secondary, .muted, .inverse, .brand-navy, .brand-orange, .brand-teal, .success, .danger
color.border.default, .brand-navy, .brand-teal, .brand-orange, .danger, .inverse, .success
color.action.primary.{default, hover, pressed, label}
color.action.secondary.{default, hover, pressed, label-default, label-hover, border}
color.action.nav
color.pill.{problem,solution,feature}.{background, text, border}
color.icon.{dark, navy, orange, teal, green}
```

---

### File 3 — `typography.json` (original upload)

**Important:** When you first uploaded, each compound used **literal values**, for example:

```json
"fontFamily": "Satoshi",
"fontSize": { "value": 40, "unit": "px" },
"fontWeight": 700,
"lineHeight": 3
```

That is **not pipeline-valid**. Required form:

```json
"fontFamily": "{font.family.satoshi}",
"fontSize": "{font.size.40}",
"fontWeight": "{font.weight.700}",
"lineHeight": "{font.lineHeight.3}"
```

**What’s good (structure)**
- 51 compounds under `display`, `heading`, `body`, `label` × `desktop` / `mobile` ✅

**What’s wrong (original)**
- ❌ ~255 sub-properties were literals, not aliases
- ❌ No `$extensions.layer: "semantic"` on compounds
- ❌ **65 unique `font.*` references** would be needed — **zero** exist in `primitives-color.json`

**Missing font primitives** (typography points at these — none exist in file 1):

| Category | Count | Examples |
|----------|-------|----------|
| `font.family.*` | 2 | `satoshi`, `inter` |
| `font.size.*` | 17 | `7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 26, 28, 32, 36, 40, 48` |
| `font.weight.*` | 4 | `400, 500, 600, 700` |
| `font.lineHeight.*` | 22 | `1, 1-5, 1-75, 2, 2-5, 3, 3-75, …` |
| `font.letterSpacing.*` | 22 | `-2, -1, -0-5, 0, 1, …` (many float-heavy keys from export) |

---

### File 4 — `shadows.json`

**What’s good**
- 5 shadows with valid DTCG shadow objects ✅
```
shadow.card, .card-elevated, .card-navy, .glass, .navbar
```

**What’s wrong**
- ❌ Missing `$extensions.layer: "primitive"` on all 5
- ❌ Should live inside `primitives.json`, not a separate file

---

### File 5 — `layout-grid.json`

**Contents**
- `layout.grid.desktop` — 12 cols, gutter `20px`, margin `64px`
- `layout.grid.mobile` — 2 cols, gutter `16px`, margin `16px`

**Verdict**
- ℹ️ **Reference documentation** — `$type: layoutGrid` is not compiled by the token pipeline
- ❌ No `$extensions` on leaves
- ⚠️ Gutter/margin are strings (`"20px"`) not dimension tokens
- **Designer action:** Add matching `spacing.*` primitives (20, 64, 16) in `primitives.json`; keep this file optional for humans

---

### File 6 — `motion-tokens.json`

**What’s good**
- `motion.easing.ease-in` / `ease-out` — valid `cubicBezier` arrays ✅
- `transitionType: smart-animate` note is useful with `MOTION-SPEC.md`

**What’s wrong**
| Token | Issue |
|-------|--------|
| `motion.duration.default` | `"700ms"` → need `{ "value": 700, "unit": "ms" }` |
| `motion.duration.step-delay` | `"120ms"` → same |
| `motion.duration.auto-advance-delay` | `"300ms"` → same |
| All 5 leaves | ❌ No `$extensions` object at all |

---

### File 7 — `HIW-motion-tokens.json`

**Verdict**
- ❌ Same duration format issues as file 6
- ⚠️ **Duplicate** of file 6 (same 700/120/300 ms; HIW only has `ease-in`, no `ease-out`)
- **Designer action:** One `motion` block in `primitives.json` for the whole site

---

### File 8 — `MOTION-SPEC.md`

**Verdict:** ✅ **No token violations** — engineering reference for hover / smart-animate sequences. Not a substitute for DTCG motion primitives in file 6.

---

### Cross-file issues (all 8 files)

| Issue | Detail |
|-------|--------|
| **File count** | 6 JSON files — pipeline needs **3** merged files |
| **Color mapping** | File 2 → File 1: **0 broken aliases** ✅ |
| **Typography → primitives** | **65 missing `font.*` primitives** ❌ |
| **Shadows orphaned** | In file 4, not in file 1 ❌ |
| **Motion orphaned** | In files 6–7, not in file 1 ❌ |
| **Metadata** | Files 1, 2, 4, 6, 7: no `layer` on any leaf ❌ |

---

## 1. Target deliverable (required)

Export **exactly three JSON files** from Token Press:

| File | Contents | `$extensions.layer` on every leaf |
|------|----------|-----------------------------------|
| `primitives.json` | Raw scales only — no aliases | `"primitive"` |
| `semantics.json` | Intent aliases only — every `$value` is `{path.to.primitive}` | `"semantic"` |
| `typography.json` | Compound `$type: typography` only — sub-properties are aliases | `"semantic"` |

Also add on every leaf:

```json
"$extensions": {
  "layer": "primitive",
  "source": "tokens-studio"
}
```

(`"figma"` is acceptable instead of `"tokens-studio"`.)

**Do not ship:** split files (`primitives-color.json`, `semantic-color.json`, `shadows.json`, etc.) — merge into the three files above.

**Reference only (not compiled):** `layout-grid.json`, `MOTION-SPEC.md` — keep as design docs or paste motion into `primitives.json` under `motion.*`.

---

## 2. What you already have (keep)

### 2.1 Color primitives — correct DTCG shape

These **16** primitives in `primitives-color.json` are valid (srgb objects, not hex):

```
color.orange.500, .600, .700
color.navy.500, .600
color.red.500
color.teal.500
color.green.500
color.neutral.0, .50, .100, .150, .200, .700, .800, .900
```

### 2.2 Semantic colors — aliases resolve

All **47** semantic colors in `semantic-color.json` point at existing color primitives. **No broken color aliases.**

Your product naming is fine to keep **in addition** to pipeline groups (see §4):

- `color.background.*`, `color.text.*`, `color.border.*`
- `color.pill.*`, `color.icon.*`
- `color.action.*` (shape wrong — see §5)

### 2.3 Shadows — correct DTCG shape

In `shadows.json` (move into `primitives.json`):

```
shadow.card
shadow.card-elevated
shadow.card-navy
shadow.glass
shadow.navbar
```

### 2.4 Typography structure — roles present

`typography.json` has compounds under:

- `typography.display.{desktop,mobile}.*`
- `typography.heading.{desktop,mobile}.*`
- `typography.body.{desktop,mobile}.*`
- `typography.label.{desktop,mobile}.*`

**51** text styles — good coverage for the pipeline typography roles.

### 2.5 Motion easing

`motion.easing.ease-in` / `ease-out` as `cubicBezier` arrays are valid.

---

## 3. Missing primitives (must add to `primitives.json`)

Typography and layout reference primitives that **do not exist** in your color-only primitives file. Every `{font.*}` alias in typography must have a matching primitive.

### 3.1 Font families (2)

| Primitive path | Suggested value |
|----------------|-----------------|
| `font.family.satoshi` | `["Satoshi", "system-ui", "sans-serif"]` |
| `font.family.inter` | `["Inter", "system-ui", "sans-serif"]` |

### 3.2 Font sizes (17) — from your typography export

Create `font.size.*` as **dimension** primitives (`{ "value": N, "unit": "px" }`):

```
font.size.7, .8, .9, .10, .11, .12, .13, .14, .15, .16,
.font.size.18, .20, .24, .26, .28, .32, .36, .40, .48
```

### 3.3 Font weights (4)

| Primitive path | `$type` | `$value` |
|----------------|---------|----------|
| `font.weight.400` | `fontWeight` | `400` |
| `font.weight.500` | `fontWeight` | `500` |
| `font.weight.600` | `fontWeight` | `600` |
| `font.weight.700` | `fontWeight` | `700` |

### 3.4 Line heights (22) — unitless numbers

Your typography uses **unitless** line heights (e.g. `3`, `3.75`, `1.5`). Use `$type: "number"`:

```
font.lineHeight.0-625, .0-75, .0-875, .0-9375, .1, .1-0625, .1-125, .1-25,
.1-375, .1-5, .1-625, .1-75, .2, .2-25, .2-5, .2-75, .3, .3-25, .3-75
```

Use keys that match typography aliases exactly (dots in numbers become hyphens in paths, e.g. `3.75` → `font.lineHeight.3-75`).

### 3.5 Letter spacing (22) — dimensions in px

```
font.letterSpacing.-2, .-1, .-0-5, .0, .1, .1-5,
.-0-15… (and other export-specific keys — align keys with typography aliases)
```

Each `$value`: `{ "value": -2, "unit": "px" }` (negative allowed).

**Designer action:** In Token Press, define **font primitives first**, then bind typography styles to them so keys stay consistent (avoid float noise like `-0.4490000009536743` — round to design intent).

### 3.6 Spacing scale (missing entirely)

Add a numeric scale under `spacing.*` (dimension, px). Minimum set for pipeline semantics:

| Primitive | px value (suggested — align to Figma 8px grid) |
|-----------|-----------------------------------------------|
| `spacing.0` | 0 |
| `spacing.1` | 4 |
| `spacing.2` | 8 |
| `spacing.3` | 12 |
| `spacing.4` | 16 |
| `spacing.5` | 20 |
| `spacing.6` | 24 |
| `spacing.8` | 32 |
| `spacing.12` | 48 |
| `spacing.16` | 64 |

Add more steps if Figma variables use them (0.5, 1.5, etc.).

**Source in Figma:** Layout grid desktop gutter `20px`, margin `64px` (`layout-grid.json`).

### 3.7 Border radii (missing entirely)

Add under `radii.*` (dimension, px):

| Primitive | Suggested |
|-----------|-----------|
| `radii.none` | 0 |
| `radii.sm` | 4 |
| `radii.base` | 8 |
| `radii.md` | 12 |
| `radii.lg` | 16 |
| `radii.xl` | 20 |
| `radii.full` | 9999 |

Pull exact values from Figma corner radius on buttons, cards, pills.

### 3.8 Motion durations (wrong format today)

**Current (invalid):**

```json
"$value": "700ms"
```

**Required:**

```json
"$type": "duration",
"$value": { "value": 700, "unit": "ms" }
```

| Primitive path | Value |
|----------------|-------|
| `motion.duration.default` | 700 ms |
| `motion.duration.step-delay` | 120 ms |
| `motion.duration.auto-advance-delay` | 300 ms |

Merge `motion-tokens.json` and `HIW-motion-tokens.json` into one `motion` group (values are identical).

### 3.9 Optional color ramp gaps

Only needed if you add hover/active semantics later:

| Missing primitive | Used when |
|-------------------|-----------|
| `color.red.600`, `color.red.700` | Danger button hover/active |
| `color.neutral.300`–`.600` | Disabled / placeholder states |

Not blocking if design only uses `.500` reds and existing neutrals.

---

## 4. Missing semantic groups (must add to `semantics.json`)

Pipeline requires these **in addition** to your ML Travel names. You can **alias** from existing tokens (examples below).

### 4.1 `color.surface.*` (flat)

You have `color.background.*` — add parallel `surface.*` or rename. Required keys:

| Semantic path | Suggested alias |
|---------------|-----------------|
| `color.surface.canvas` | `{color.background.page}` |
| `color.surface.raised` | `{color.background.surface}` |
| `color.surface.sunken` | `{color.background.subtle}` |
| `color.surface.muted` | `{color.background.surface-warm}` |
| `color.surface.inverse` | `{color.background.dark}` |
| `color.surface.inverse-muted` | `{color.neutral.700}` |

### 4.2 `color.action.*` — wrong nesting (see §5)

Variants **tertiary** and **danger** are missing entirely.

### 4.3 `color.input.*` (form fields — Contact page)

**No need — ignore (v1).** Contact page uses **Calendly embed**; form field UI is not part of the ML Travel design system. Engineering adds a pipeline stub so `npm run tokens:validate` passes. Designer does **not** export `color.input.*`.

<details>
<summary>Reference structure (dev stub only — not a designer task)</summary>

```
color.input.surface
color.input.border
color.input.placeholder-dim
color.input.icon.default
color.input.icon.error
color.input.icon.disabled

color.input.default.empty.{border, placeholder, value, helper, surface}
color.input.default.focused.{…}
color.input.default.filled.{…}
color.input.default.error.{…}
color.input.default.disabled.{…}
```

</details>

### 4.4 `color.feedback.*` (toast / alert pattern)

**No need — ignore (v1).** No designed toast/banner components in scope. Engineering adds a pipeline stub. Designer does **not** export `color.feedback.*`.

<details>
<summary>Reference structure (dev stub only — not a designer task)</summary>

For each severity `success`, `warning`, `error`, `info` — four slots:

```
color.feedback.success.background
color.feedback.success.foreground
color.feedback.success.border
color.feedback.success.icon
```

(repeat for `warning`, `error`, `info`)

</details>

### 4.5 `color.focus.*`

```
color.focus.ring          → e.g. {color.orange.500}
color.focus.ring-error    → e.g. {color.red.500}
color.focus.ring-info     → e.g. {color.navy.500}
```

### 4.6 `space.*` (aliases → spacing primitives)

```
space.xs   → {spacing.1}
space.sm   → {spacing.2}
space.md   → {spacing.4}
space.lg   → {spacing.6}
space.xl   → {spacing.8}
space.2xl  → {spacing.12}
space.3xl  → {spacing.16}
space.gap  → {spacing.5}
space.gutter → {spacing.5}
space.section → {spacing.16}
```

### 4.7 `radius.*` (aliases → radii primitives)

```
radius.control → {radii.base}
radius.surface → {radii.md}
radius.panel   → {radii.lg}
radius.pill    → {radii.full}
radius.sharp   → {radii.none}
```

### 4.8 `shadow.*` (semantic scale → your shadow primitives)

```
shadow.sm    → {shadow.card}
shadow.md    → {shadow.card-elevated}
shadow.lg    → {shadow.card-elevated}
shadow.focus → {shadow.card}
```

---

## 5. Wrong shape: `color.action` (must restructure)

### Current (flat — not accepted)

```
color.action.primary.default      → single color
color.action.primary.hover
color.action.primary.pressed      ← rename to "active"
color.action.primary.label        ← must be per-state slot
```

### Required (nested state + slot)

```
color.action.primary.default.background
color.action.primary.default.label
color.action.primary.hover.background
color.action.primary.hover.label
color.action.primary.active.background
color.action.primary.active.label
color.action.primary.focused.background
color.action.primary.focused.label
color.action.primary.focused.border
color.action.primary.disabled.background
color.action.primary.disabled.label
```

Repeat for **`secondary`**, **`tertiary`**, **`danger`**.

**Mapping from your export:**

| Your token | Maps to |
|------------|---------|
| `primary.default` | `primary.default.background` |
| `primary.label` | `primary.default.label` (and hover/active as needed) |
| `primary.hover` | `primary.hover.background` |
| `primary.pressed` | `primary.active.background` |
| `secondary.label-default` | `secondary.default.label` |
| `secondary.label-hover` | `secondary.hover.label` |
| `secondary.border` | `secondary.focused.border` |

Define **tertiary** (outline/ghost) and **danger** (destructive) in Figma variables, then export.

---

## 6. Metadata violations (every leaf)

| Issue | Current | Required |
|-------|---------|----------|
| Layer marker | Only `$extensions.figma` on colors | `$extensions.layer`: `"primitive"` or `"semantic"` |
| Source | Missing on most leaves | `$extensions.source`: `"tokens-studio"` |
| Motion tokens | No `$extensions` | Full `$extensions` on all motion leaves |
| Shadow tokens | No `layer` | `"primitive"` |

---

## 7. Typography rules

1. **Every** sub-property must be an alias — not `"Satoshi"` or `{ "value": 48, "unit": "px" }` inline.
2. Aliases must resolve to primitives in **`primitives.json`** (§3.1–3.5).
3. Each compound token needs `$extensions.layer: "semantic"`.

**Example compound (correct):**

```json
"typography.heading.desktop.h1": {
  "$type": "typography",
  "$value": {
    "fontFamily": "{font.family.satoshi}",
    "fontSize": "{font.size.48}",
    "fontWeight": "{font.weight.700}",
    "lineHeight": "{font.lineHeight.1-2}"
  },
  "$extensions": {
    "layer": "semantic",
    "source": "tokens-studio"
  }
}
```

---

## 8. Motion & layout (sidecar)

| Asset | Status | Action |
|-------|--------|--------|
| `motion-tokens.json` | Durations wrong format; duplicate HIW file | Fix §3.8; one file in `primitives.json` |
| `MOTION-SPEC.md` | Good | Keep for engineering — not a token file |
| `layout-grid.json` | Reference only (`layoutGrid`, string px) | Optional; spacing primitives §3.6 should match 20px gutter / 64px margin |

---

## 9. Re-export checklist

- [ ] Three files: `primitives.json`, `semantics.json`, `typography.json`
- [ ] Every leaf has `$extensions.layer` + `$extensions.source`
- [ ] All colors: DTCG srgb objects (no `#hex`)
- [ ] All dimensions/durations: `{ value, unit }` objects (no `"16px"` / `"700ms"` strings)
- [ ] Font primitives §3.1–3.5 exist for every typography alias
- [ ] Spacing §3.6 and radii §3.7 added
- [ ] Motion §3.8 in primitives
- [ ] Semantic groups §4 complete
- [ ] `color.action` restructured §5 (primary, secondary, tertiary, danger)
- [ ] **No need:** `color.input.*` — Calendly; dev stub
- [ ] **No need:** `color.feedback.*` — dev stub
- [ ] Run handback: dev runs `npm run tokens:validate` — must PASS with zero errors

> **Current upload delta:** see [`designer-token-validation-ask.md`](./designer-token-validation-ask.md)

---

## 10. Summary counts

> **June 2026 upload:** most rows below are **fixed** in the current `tokens/` set. See validation-ask for remaining gaps.

| Category | In export | Missing / wrong |
|----------|-----------|-----------------|
| Color primitives | 16 | hex format → need srgb (current upload) |
| Font primitives | 70 | `font.style.*` invalid type |
| Spacing / radius primitives | ✅ | — |
| Shadow / motion primitives | ✅ | — |
| Semantic colors (product) | ✅ | alias mapping OK |
| Pipeline groups | partial | **tertiary/danger null**; input/feedback = **dev stub, no need** |
| Typography compounds | 51 | ✅ aliases OK |
| File structure | 3 files | ✅ |

---

## 11. Questions for design

1. **Tertiary & danger buttons** — confirm Figma variables for outline and destructive actions (handoff §5).
2. ~~**Contact form**~~ — **No need** (Calendly).
3. **Letter-spacing keys** — can Token Press export rounded keys (e.g. `-0.5`) instead of long floats?
4. **Spacing & radii** — confirm against Figma Variables on Components page (`2713:1937`).

---

*After re-export, place files in `tokens/` and notify dev to run `npm run tokens:validate`. Do not edit merged/engineered files in the repo — designer export is source of truth.*
