# Figma extract notes — CP-002

**File:** `h6BqI1ZRMSJxR7jESNF0Ep` — [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?node-id=5185-4332&p=f&m=dev)  
**Extracted:** 2026-07-06 via dual-source (`figma:extract:rest` + MCP `get_design_context`) · `figmaLastModified` 2026-07-02T12:52:45Z

## Canonical frame & cache inventory

**Not LP-001 / F-001:** Contact frames use `5185:*` / `5186:*` / `5198:*` node IDs under `features/CP-002/figma/nodes/` only. Landing (LP-001, legacy ID F-001) caches are separate at `features/LP-001/figma/nodes/` (`5164:*`) — never deleted or shared.

| Role | nodeId | Cache file |
|------|--------|------------|
| Full page (canonical layout) | `5185:4332` | `nodes/5185-4332.json` |
| Hero slice (GH#14) | `5198:3440` | `nodes/5198-3440.json` |
| Embed slot slice (GH#15) | `5186:4368` | `nodes/5186-4368.json` |
| Email fallback slice (GH#16) | `5198:3429` | `nodes/5198-3429.json` |
| Choose hour (embed sizing ref) | `5186:4533` | `nodes/5186-4533.json` |
| Details (embed sizing ref) | `5186:4857` | `nodes/5186-4857.json` |
| Summary (Calendly admin copy) | `5198:4102` | `nodes/5198-4102.json` |

**Excluded:** `5198:3487` designer placeholder — not cached.

**Shared chrome:** `component.navbar` / `component.footer` from LP-001 (`5164:6559`, `5164:6565`) — not re-extracted per feature.

## Slices (GH#14–#16)

| GH# | Registry | Slice-root | Reference PNG |
|-----|----------|------------|---------------|
| #14 | `component.contact.hero` | `5198:3440` | `reference-contacthero.png` |
| #15 | `component.contact.embed` (+ skeleton / fallback states) | `5186:4368` | `reference-calendlyembedslot.png` |
| #16 | `component.contact.fallback` | `5198:3429` | `reference-emailfallback.png` |

Calendly calendar UI inside `5186:4368` is **visual reference only** — FE renders a native `<iframe>`; do not rebuild Calendly widgets in React.

## Dual-source reconciliation

| slice-root | REST | MCP | instanceVariants | action |
|------------|------|-----|------------------|--------|
| `5198:3440` | ✓ `5198-3440.json` | ✓ `get_design_context` | — (no component sets) | merged |
| `5186:4368` | ✓ `5186-4368.json` | ✓ `get_design_context` | — (Calendly mock; not implemented) | merged |
| `5198:3429` | ✓ `5198-3429.json` | ✓ `get_design_context` | ✓ `Button/Secondary2` State=Default, IconPosition=Right; `Icon/Button` Icon=Plane Arrow | merged |

## Token mapping (ML Travel chrome only)

| Node path | Property | Figma value | Token used | Resolved | Exact? |
|-----------|----------|-------------|------------|----------|--------|
| Hero / copy stack | gap | 8px | `space.sm` | 8px | YES |
| Fallback block | gap | 16px | `space.md` | 16px | YES |
| Fallback copy stack | gap | 8px | `space.sm` | 8px | YES |
| Hero headline | typography | 48/60 Satoshi Bold | `typography.display.desktop.lg` | 48/60 | YES |
| Hero subhead | typography | 16/24 Inter Regular | `typography.body.desktop.md` | 16/24 | YES |
| Fallback heading | typography | 26/32 Satoshi Bold | `typography.heading.desktop.h2` | 26/32 | YES |
| Fallback body | typography | 14/22 Inter Regular | `typography.body.desktop.xs` | 14/22 | YES |
| Email CTA | padding-x / padding-y | 28px / 12px | `spacing.28` / `spacing.12` | 28 / 12 | YES |
| Email CTA | border-radius | 6px | `radius.6` | 6px | YES |
| Email CTA label | color | navy | `color.action.secondary.label.default` | #003d82 | YES |
| Email CTA border | color | navy | `color.border.brand-navy` | #003d82 | YES |
| Embed slot | min width × height | 868×550 | layout constraint (not a spacing token) | — | N/A — iframe container |
| Calendly mock card | border-radius / stroke | 16.8px / 0.7px | — | — | **Out of scope** — Calendly chrome inside iframe, not rebuilt in React |

## Downloaded assets

| Node ID | Node name | Type | File saved |
|---------|-----------|------|------------|
| `I5198:3433;2780:1463` | Email CTA arrow | svg | `public/icons/icon-button-arrow.svg` (shared with LP-001) |

Calendly mock vectors inside `5186:4368` are **not** exported — replaced by live Calendly iframe.

## Environment

- `NEXT_PUBLIC_CALENDLY_URL` — iframe `src`
- `NEXT_PUBLIC_CONTACT_EMAIL` — email CTA label + `mailto:` (Figma shows `hello@maqsoodtravel.com` as visual ref only)
