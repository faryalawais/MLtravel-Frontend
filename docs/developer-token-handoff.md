# Design tokens — developer handoff (ML Travel Frontend)

**Audience:** Frontend / platform engineer  
**Repo:** `MLtravel-Frontend`  
**Figma:** `h6BqI1ZRMSJxR7jESNF0Ep` — [file](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?p=f&m=dev) · landing node `5164:6346` is **LP-001 only**  
**Designer fix list (forward to design):** [`docs/designer-token-handoff.md`](./designer-token-handoff.md)

---

## TL;DR

| Item | Status |
|------|--------|
| Designer uploaded **8 files** (6 JSON + 2 markdown) | Archived in `tokens/archive/ml-travel-export/` |
| Pipeline requires **3 JSON files** in `tokens/` | `primitives.json`, `semantics.json`, `typography.json` |
| Current `tokens/*.json` | **Engineering merge output** — passes validate today, **not** designer source of truth |
| **Block FE UI work** until | Clean designer re-export **or** explicit team sign-off to use merged tokens |
| **Your job when tokens land** | Drop files → `npm run tokens:validate` → `npm run tokens:build` → `/ui-registry-build` |

Do **not** implement pages with raw hex/px. All styling must come from compiled token CSS vars / Tailwind partial.

---

## 1. What was uploaded (designer export)

Original files are preserved here:

```
tokens/archive/ml-travel-export/
├── primitives-color.json    # 16 color primitives only
├── semantic-color.json      # 47 semantic colors
├── typography.json          # 51 text styles (original used literals — see below)
├── shadows.json             # 5 shadow primitives
├── layout-grid.json         # reference only — not compiled
├── motion-tokens.json       # motion primitives (wrong duration format)
├── HIW-motion-tokens.json   # duplicate motion set
├── MOTION-SPEC.md           # motion behaviour notes for engineering
└── HIW-MOTION-SPEC.md       # page-specific motion notes
```

### Per-file verdict (original upload)

| File | OK for pipeline? | Notes |
|------|------------------|-------|
| `primitives-color.json` | Partial | Colors valid DTCG; missing spacing, radii, font, motion, shadows |
| `semantic-color.json` | Partial | All color aliases resolve; missing required semantic groups; wrong `color.action` shape |
| `typography.json` | No | Sub-properties were **literals** (`"Satoshi"`, inline sizes), not `{font.*}` aliases; no font primitives exist |
| `shadows.json` | Partial | Valid shadow objects; wrong file; missing `$extensions.layer` |
| `layout-grid.json` | N/A | Human reference — `$type: layoutGrid` is not built by Style Dictionary |
| `motion-tokens.json` | No | Durations as `"700ms"` strings; needs DTCG duration objects |
| `HIW-motion-tokens.json` | No | Same issues as motion-tokens; consolidate to one `motion.*` group |
| `MOTION-SPEC.md` | Yes | Keep for component animation implementation |

**Cross-file:** Color semantics → color primitives = **0 broken aliases**. Typography → font primitives = **~65 missing references**.

> **Archive caveat:** `tokens/archive/ml-travel-export/typography.json` was partially rewritten by `scripts/merge-ml-travel-tokens.mjs`. For designer accountability, treat the **literal-value original** (described in the designer doc) as the audit baseline, not the archive copy on disk.

---

## 2. What the pipeline expects

Active token files (repo root):

| File | Layer | Rules |
|------|-------|--------|
| `tokens/primitives.json` | `"primitive"` on every leaf | Raw scales only — colors, spacing, radii, font, shadow, motion. No `{alias}` values. |
| `tokens/semantics.json` | `"semantic"` on every leaf | Every `$value` is `{path.to.primitive}`. Required groups below. |
| `tokens/typography.json` | `"semantic"` on every compound | `$type: typography`; sub-properties are aliases to `font.*` primitives. |

Every leaf needs:

```json
"$extensions": {
  "layer": "primitive",
  "source": "tokens-studio"
}
```

(`"figma"` is acceptable instead of `"tokens-studio"`.)

### Required semantic groups (validator fails if missing)

- `color.surface.*`
- `color.text.*`, `color.border.*`
- `color.action.{primary,secondary,tertiary,danger}.{default,hover,active,focused,disabled}.{background,label}`
- `color.input.*` (Contact form — multiple states)
- `color.feedback.{success,warning,error,info}.{background,foreground,border,icon}`
- `color.focus.{ring, ring-error, ring-info}`
- `space.*` → aliases to `spacing.*`
- `radius.*` → aliases to `radii.*`
- `shadow.*` → aliases to `shadow.*` primitives

Full shapes and suggested mappings: [`docs/designer-token-handoff.md`](./designer-token-handoff.md) §4–5.

### DTCG value shapes (no string shortcuts)

| Type | Required `$value` shape |
|------|-------------------------|
| color | `{ "colorSpace": "srgb", "components": [r,g,b], "alpha": 1 }` |
| dimension | `{ "value": 16, "unit": "px" }` |
| duration | `{ "value": 700, "unit": "ms" }` |
| shadow | offset/blur/spread as dimension objects |
| typography compound | sub-properties as `{font.family.satoshi}` style aliases |

---

## 3. Current repo state (do not confuse with designer export)

```
tokens/
├── primitives.json      ← merged / engineered (not original upload)
├── semantics.json       ← merged / engineered
├── typography.json      ← merged / engineered
├── build/
│   ├── tokens.css       ← CSS custom properties
│   └── tailwind-tokens.js
├── ui-registry.json     ← empty — run ui-registry-build after tokens pass
└── archive/ml-travel-export/   ← designer originals
```

A one-off merge script exists:

```bash
npm run tokens:merge   # reads archive → overwrites tokens/primitives|semantics|typography.json
```

**Policy:** Prefer a **clean designer re-export** into the three-file layout. Use `tokens:merge` only as a temporary bridge if product accepts engineered gaps (invented spacing/radii/font scales, restructured `color.action`, etc.). Forward [`designer-token-handoff.md`](./designer-token-handoff.md) to design for the authoritative fix list.

---

## 4. When designer delivers — your checklist

### 4.1 Install files

1. Replace (do not append):
   - `tokens/primitives.json`
   - `tokens/semantics.json`
   - `tokens/typography.json`
2. Keep reference docs optional:
   - `tokens/archive/ml-travel-export/MOTION-SPEC.md`
   - `tokens/archive/ml-travel-export/layout-grid.json`

### 4.2 Validate and build

```bash
npm install                    # if not done
npm run tokens:validate        # must exit 0
npm run tokens:build           # writes tokens/build/*
```

`tokens:validate` runs:

1. `validate-token-source.mjs` — three-file structure, layers, required semantic groups, alias resolution  
2. `validate-tokens-dtcg.mjs` — DTCG object shapes (no hex/`"16px"`/`"700ms"` strings)

If validate fails, **send the error output + designer doc back to design**. Do not patch tokens in code to unblock UI unless explicitly agreed.

### 4.3 Continue design-system pipeline

```bash
# Skills (see docs/feature-pipeline-quickref.md)
/design-tokens          # or token-validate — same gate as above
/ui-registry-build
/registry-validate
```

Outputs you consume in components:

- `tokens/build/tokens.css` — `var(--color-text-primary)`, etc.
- `tokens/build/tailwind-tokens.js` — Tailwind theme extension
- `tokens/ui-registry.json` — component ↔ token mapping for `/design-contract`

### 4.4 Motion implementation

Token primitives give durations/easing CSS vars, e.g.:

- `--motion-duration-default`
- `--motion-easing-ease-in`

**Behaviour** (stagger, smart-animate, hover sequences) is documented in:

- `tokens/archive/ml-travel-export/MOTION-SPEC.md`
- `tokens/archive/ml-travel-export/HIW-MOTION-SPEC.md`

Implement in CSS/JS per spec; do not hard-code `700ms` in components if a motion token exists.

---

## 5. What you can do now (tokens still incomplete)

| Work | OK? |
|------|-----|
| Phase 1 planning (`/grill-me`, `/prd-author` for F-001) | Yes |
| Figma MCP / `npm run figma:check` | Yes |
| `/figma-extract` for structure reference | Yes |
| `/fe-implement` pixel UI using merged tokens | Only with team sign-off on engineered merge |
| Raw hex / px in TSX or CSS | **No** — repo rule |

Entry point: [`docs/START-HERE.md`](./START-HERE.md)  
Backlog: `features/backlog.yaml` — F-001 Landing first, Navbar frame `5164:6559`.

---

## 6. Hard rules (enforced in review / gate)

1. No `app/api/`, no DB — backend is `MLtravel-Backend`
2. No raw hex colours or px literals in UI code — use token CSS vars / Tailwind from `tailwind-tokens.js`
3. No `any`, no `@ts-ignore`, no skipped tests
4. Extract **sections** from Figma, not full scroll pages (`/figma-extract` frame mode)
5. One component per `/fe-implement` pass

---

## 7. Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| `tokens:validate` SKIP | Active files are empty `{}` | Run with files present or `tokens:merge` |
| Unresolved alias `{font.size.40}` | Missing primitive in `primitives.json` | Designer adds `font.size.40` |
| `color.action` flat key rejected | Old Token Press export shape | Designer restructures per §5 of designer doc |
| Style Dictionary collision warning | Duplicate top-level keys across files | Remove `$description` at file root; dedupe paths |
| `FIGMA_FILE_KEY` wrong file | Shell env overrides `.env` | Set `FIGMA_FILE_KEY=h6BqI1ZRMSJxR7jESNF0Ep` in `.env` |

---

## 8. Related docs

| Doc | Purpose |
|-----|---------|
| [`designer-token-handoff.md`](./designer-token-handoff.md) | Full audit + fix list — **send to designer** |
| [`feature-pipeline-quickref.md`](./feature-pipeline-quickref.md) | Skill order: tokens → registry → figma → implement |
| [`figma-setup.md`](./figma-setup.md) | Figma REST + Desktop MCP |
| [`START-HERE.md`](./START-HERE.md) | Project entry, feature IDs F-001–F-003 |
| `.claude/skills/design-tokens/SKILL.md` | Validator rules (source of truth for schema) |

---

## 9. Acceptance criteria (tokens done)

- [ ] Designer delivered exactly `primitives.json`, `semantics.json`, `typography.json`
- [ ] `npm run tokens:validate` exits **0** with no SKIP
- [ ] `npm run tokens:build` produces `tokens/build/tokens.css` and `tailwind-tokens.js`
- [ ] `npm run registry:validate` passes after `ui-registry-build`
- [ ] Team recorded decision: designer export vs engineered merge (for audit trail)

After that, proceed to `/design-contract` + `/fe-implement` on F-001 Navbar (`5164:6559`).
