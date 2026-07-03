# START HERE — MLtravel Frontend

**Status:** Phase 1 · **LP-001** — `fe-implemented` · F-002 / F-003 — `brief-created`  
**Figma file:** `h6BqI1ZRMSJxR7jESNF0Ep` — [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?p=f&m=dev) (frame links are per feature — see LP-001 / F-002 / F-003 briefs)
**Pipeline:** [`docs/feature-pipeline-quickref.md`](./feature-pipeline-quickref.md)

---

## What you are building

Static marketing site from Figma — pixel-accurate, token-driven:

| Page | Feature ID | Brief | Figma frame |
|------|------------|-------|-------------|
| Landing | **LP-001** | `docs/features/LP-001/brief.md` | `5164:6346` (page) · sections in backlog |
| Contact | **F-002** | `docs/features/F-002/brief.md` | `5185:4332` … |
| How It Works | **F-003** | `docs/features/F-003/brief.md` | `5217:6697` |

Design system source pages: Color System `2864:1549`, Text Styles `2780:11647`, Components `2713:1937`.

---

## Phase 0 — One-time setup (this repo)

```bash
npm install
cp .env.example .env          # FIGMA_ACCESS_TOKEN + FIGMA_FILE_KEY=h6BqI1ZRMSJxR7jESNF0Ep
npm run figma:check           # REST API access
```

Figma Desktop: open the file above → **Dev Mode** → MCP on → Cursor MCP `figma-desktop` connected.

---

## Phase 1 — Planning (this repo)

**Current:** LP-001 — **BE `be-implemented`** (`feat(LP-001-BE)` merged) → **Phase 3 FE:** app shell [#1] → `figma-extract` Navbar [#3] → `fe-implement`

Planning runs **once per feature ID** — separate PRD, issues, and Gherkins per page:

| Feature | Page | Grill → PRD → … |
|---------|------|-----------------|
| **LP-001** | Landing | **start here** |
| F-002 | Contact | after LP-001 slices defined |
| F-003 | How It Works | after LP-001 slices defined |

Static pages: BE may be minimal (no API or stubs). Gate still expects `be-implemented` before FE page work.

---

## Phase 1 — Planning (legacy note: MLtravel-Backend)

Same skills — use Backend repo if your team splits planning there.

---

## Phase 2 — Design system (prerequisite for FE UI)

Tokens merged from your Token Press export. Re-merge after export changes:

```bash
npm run tokens:merge      # only if sources back in tokens/archive/ml-travel-export/
npm run tokens:validate
npm run tokens:build
```

Motion: primitives `motion.duration.{700,300,120}` + semantics `motion.duration.{default,stepDelay,autoAdvance}` compile to CSS vars. Behaviour: [`tokens/MOTION-SPEC.md`](../tokens/MOTION-SPEC.md).

**Designer fix list (missing tokens):** [`docs/designer-token-handoff.md`](./designer-token-handoff.md)

Night-shift skill (after planning): `/design-tokens` → `/ui-registry-build` → `/registry-validate`

---

## Phase 3 — Per sub-feature (this repo)

For each backlog row (`LP-001a`, `LP-001b`, …) after BE gate:

```
/figma-extract     — frame mode, one section at a time (not whole 6544px page)
/design-contract
/fe-implement      — one @fe scenario / component per pass
```

Gate: `npm run gate` → human visual sign-off → `status: approved` in `backlog.yaml`.

---

## Backlog — dependency order

```
LP-001  Landing (navbar + footer — shared chrome)
  ↓
F-002  Contact
F-003  How It Works
```

Full backlog: [`features/backlog.yaml`](../features/backlog.yaml)

**First implementation slice (after planning):** Landing Navbar `5164:6559` under LP-001.

---

## Hard rules

1. BE `be-implemented` before FE page work  
2. No raw hex or px — design tokens only  
3. One component per `/fe-implement` pass  
4. Extract sections, not full scroll pages  
5. Only a human sets `status: approved`

---

## Your next command

> **FE unblocked.** Start: issue [#1](https://github.com/faryalawais/MLtravel-Frontend/issues/1) app shell, then [#3](https://github.com/faryalawais/MLtravel-Frontend/issues/3) Navbar (`figma-extract` → `design-contract` → `fe-implement`)

Repeat the planning loop for F-002 and F-003 after LP-001 planning gates pass (or in parallel if slices are independent).

Do **not** skip to `/fe-implement` until planning gates pass.
