# Feature Pipeline — Quick Reference

> Skills in execution order. BE runs first and must be `be-implemented` before
> FE opens. Both repos share the same parent ID and memory file.

> **Smart Zone Rule:** LLMs degrade past ~100k tokens. Every skill runs on ONE unit —
> one feature, one scenario, one component, one endpoint. Skills warn (never silently
> degrade) when scope is too large and ask whether to continue or start a fresh chat.
>
> **Day Shift (you must be present):** `/feature-brief`, `/grill-me` (×2), `/prd-author`, `/prd-review`, `/ticket-generate`, `/to-issues`, `/scenario-review`, `/gherkin-validate` sign-off, gate reviews, **per-slice human review inside `/fe-implement` (Step 7)**, final visual sign-off, `status: approved`.
> **Night Shift (agent runs AFK):** `/prd-update`, `/openapi-author`, `/business-logic-author`, `/orm-schema-author`, `/be-implement`, `/figma-extract` (+ chain walk), `build:motion-from-cache`, `/design-tokens`, `/ui-registry-build`, `/registry-validate`, `/design-contract`, `/fe-implement`.
> Invest in the day shift. Night shift quality is determined before it starts.

---

## PHASE 1 — Planning (run in `MLtravel-Frontend` for this project)

> Skills can run in any repo with skills installed. For solo/test mode we run planning here.
> Production teams may use `MLtravel-Backend` instead — same skill order.

| # | Skill | Repo | Output |
|---|-------|------|--------|
| 1 | `/feature-brief` | MLtravel-Frontend | `docs/features/<id>/brief.md` · `features/<id>/memory.md` |
| 1a | `/grill-me` _(recommended)_ | MLtravel-Frontend | Stress-test the feature idea before committing to PRD |
| 2 | `/prd-author` | MLtravel-Frontend | `docs/features/<id>/prd-v1.md` |
| 3 | `/prd-update` | MLtravel-Frontend | `docs/features/<id>/prd-v2.md` (Figma screen detail added) |
| 4 | `/ticket-generate` | MLtravel-Frontend | `features/<id>/tickets/fe-ticket.md` · `be-ticket.md` |
| 5 | `/to-issues` | MLtravel-Frontend | GitHub issues — one per vertical slice (tracer bullet, end-to-end) |
| 5a | `/grill-me` _(recommended)_ | MLtravel-Frontend | Stress-test the slices — are they small enough? Can each be demoed standalone? |
| 6 | `/spec-author` | MLtravel-Frontend | `features/<id>/<id>.feature` (Gherkins with `@fe` / `@be` tags) |
| 7 | `/gherkin-validate` | MLtravel-Frontend | Validation report — planning complete |

> **Gate:** `/to-issues` must run before `/spec-author`. Gherkins are written 1:1 against the issues — no issues = no Gherkins.
> **Gate:** Gherkins must pass `gherkin-validate` before BE work starts.
>
> **Vertical slicing rules (strict):**
> - One issue = one user-visible element OR one API endpoint. Never a whole page.
> - Even small components (a badge, a dropdown, a search input) get their own issue if they have independent demoable value.
> - The demo test: _"Can I show this slice working without building anything else first?"_ If no → split further.
> - A page is a container, not a feature. Homepage ≠ one issue. Navbar, sidebar, category list, hero — each is its own issue.
> - Use `/grill-me` after `/to-issues` to pressure-test slice granularity before writing Gherkins.

---

## PHASE 2 — Backend (run in `MLtravel-Backend`)

| # | Skill | Repo | Output |
|---|-------|------|--------|
| 8 | `/openapi-author` | MLtravel-Backend | `docs/openapi/paths/<be-id>.yaml` — Contract 1 (Swagger) |
| 9 | `/business-logic-author` | MLtravel-Backend | `docs/features/<be-id>/business-logic.md` — Contract 2 |
| 10 | `/orm-schema-author` | MLtravel-Backend | `db/schema.ts` updated — Contract 3 |
| 11 | `/be-implement` | MLtravel-Backend | Route handlers in `app/api/` · Vitest tests in `tests/api/` |

> **Gate:** `npm run gate:api` must pass (typecheck + openapi:validate + test:api).
> Status → `be-implemented`. FE may now begin.

---

## PHASE 3 — Frontend (run in `MLtravel-Frontend`)

| # | Skill / command | Repo | Output |
|---|-----------------|------|--------|
| 12 | `/figma-extract` | MLtravel-Frontend | Static + mobile + animation twins → `nodes/*.json`, `spec.json`, `layout.json`, `reference-*.png`, `gifRef` assets; **chain walk** → `chain-walk-report.json` |
| 12b | `npm run build:motion-from-cache -- <id>` | MLtravel-Frontend | `motion-chains.json` · `motion-diffs.json` |
| 13 | `/design-tokens` | MLtravel-Frontend | `tokens/build/tokens.css` (incl. `motion.duration.*`, `motion.easing.*`) |
| 14 | `/ui-registry-build` | MLtravel-Frontend | `component.*` + `component.*.motion.*` paths (`$figmaLayerName` on motion rows) |
| 15 | `/registry-validate` | MLtravel-Frontend | Registry + motion testId coverage (Check 6) |
| **16** | **`/design-contract`** | MLtravel-Frontend | **`contract.md`** — anatomy, layout, tokens, states **+ Motion blocks** (see below) |
| 17 | `/fe-implement` | MLtravel-Frontend | TSX wired from `contract.md` + `motion-diffs.json` · **Step 7 APPROVE per GH slice** |

### When does `contract.md` get Motion?

**Motion is never written in steps 12–15.** Those steps only produce the inputs.

| Step | Touches `contract.md`? | What happens |
|------|--------------------------|--------------|
| 12 | No | Cache every animation **variant state**; chain walk lists missing `destinationId`s |
| 12b | No | Build `motion-chains.json` + `motion-diffs.json` offline |
| 13–15 | No | Tokens + `component.*.motion.*` registry paths for diff → testId binding |
| **16** | **Yes — Motion blocks added here** | `/design-contract` copies per-slice **Motion** + **Motion bindings** tables into `contract.md` §2 from JSON (0 MCP) |
| 17 | Read-only (normally) | `fe-implement` reads Motion block; wires code from `motion-diffs.json`. Re-open `/design-contract` only if motion JSON or block is wrong |

**Step 16 is the only skill that authors Motion text in `contract.md`.** Sources:

- `features/<id>/figma/motion-chains.json` — pattern, runner, trigger testId, timings, `status: closed`
- `features/<id>/figma/motion-diffs.json` — step · testId · helper · change table
- `features/<id>/figma/motion-state-poses.json` — per-state layer `translateYpx` matrix; `initialRender: staticTwin` rule
- `asset-manifest.json` — ambient `gifRef` rows in anatomy

**Never an input:** `tokens/MOTION-SPEC.md` (legacy). If it disagrees with `motion-chains.json`, JSON wins.

### Motion sub-flow (steps 12 → 16)

```
12  /figma-extract
      ├─ REST/MCP → nodes/<every-state>.json
      ├─ npm run figma:motion-chain-walk -- --feature <id>
      └─ figma:refresh-node for each missing destinationId (repeat until chains closed)

12b npm run build:motion-from-cache -- <id>
      → motion-chains.json + motion-diffs.json + motion-state-poses.json

12c npm run figma:export-motion-states -- <id>
      → reference-<chain>-animation-state-N.png per closed chain (REST; hero variants may need Playwright capture)

13  /design-tokens          motion.duration.* / motion.easing.* → CSS vars
14  /ui-registry-build     component.*.motion.* + $figmaLayerName
15  /registry-validate      motion testIds present

─── GATE ───
npm run validate:motion-chains -- <id>     # all chains closed (full contract)
# OR per GH slice while others incomplete:
npm run validate:motion-chains -- <id> --chain <AnimationName>

16  /design-contract
      └─ §2 per animated section:
           **Motion (motion-chains · nodeId):** pattern · runner · trigger · tokens
           **Motion bindings (motion-diffs):** step · testId · helper · change
           ambient gifRef rows in anatomy tree

17  /fe-implement
      └─ pattern runner + helpers from motion-diffs; Step 7 vs reference-*-animation-state-*.png
```

### Two ways to run step 16 (static + motion)

| Mode | When | Motion in contract |
|------|------|-------------------|
| **Full feature** | All slices extracted; all chains `closed` | Step 16 writes **entire** `contract.md` including every Motion block in one pass. Gate: `validate:motion-chains -- <id>` (no `--chain`) exits 0. |
| **Incremental (GH slice)** | LP-001-style: one GitHub issue at a time | Static anatomy/tokens for that GH slice can land in `contract.md` as the slice is specced. **Motion block for that slice** is added/updated in step 16 **only after** that slice's chain is `closed` and `validate:motion-chains -- <id> --chain <name>` passes. Do not `fe-implement` animated wiring until the Motion block exists. |

**Navbar exception (GH#3):** no prototype chain — Motion block documents **component-variant** CTA hover (`5164:10334` reference frame), not `motion-chains.json`.

### What goes in each contract Motion block (step 16)

Copied from JSON — not hand-written:

```markdown
**Motion (motion-chains · `5164:10344`):** pattern `rapid-four-step` · status `closed` —
`onMouseEnter` on `component.landing.problem.motion.root` → 5 states;
`motion.duration.default` + `motion.easing.default`; runner `runRapidFourStepMotion`; one-way.

**Motion bindings (motion-diffs):**
| Step | testId | Helper | Change |
|------|--------|--------|--------|
| 0 | …problem.motion.card1 | getMotionCascadeCardSurfaceStyle | border + shadow |
```

Hybrid sections (e.g. Social proof): **one Motion block per `subgraphId`** in `motion-chains.json`.

### Gates (Phase 3)

| Gate | When | Command |
|------|------|---------|
| Extract complete | Before 12b | `validate:figma-extract` · `validate:layout` |
| Motion extract | Before step 16 (full) or before Motion block for a slice | `validate:motion-chains -- <id>` or `--chain <name>` |
| Contract | After step 16 draft | `validate:figma-coverage` · `validate:contract` |
| FE ship | After step 17 per slice | `test:e2e` · `test:visual` · human Step 7 APPROVE |
| Full feature | Before `fe-implemented` | `npm run gate` |

> **Motion gate:** `validate:motion-chains` must pass before **writing Motion blocks** in step 16 (full or per-chain). `fe-implement` must not guess timing or layers — violation routes to step 12 + 12b, not ad-hoc CSS.
>
> **Per-slice gate (inside fe-implement):** After automated checks, the agent presents a
> review card and waits for **APPROVE** before memory / commit / next GitHub issue.
> Violations → fix via the correct upstream skill (`/figma-extract`, `/design-contract`, etc.),
> re-run gates, review again. Status → `fe-implemented` only after all slices approved.

**Docs:** human overview → `docs/motion-guideline.md` · engineering spec → `docs/motion-pipeline-plan.md`

---

## PHASE 4 — Approval (human)

Human reviews gate report + visual comparison (Figma vs app).
Sets status → `approved` in `features/<id>/tickets/status.md`.

---

## Status lifecycle

```
brief-created
    → prd-ready
    → gherkins-ready          ← planning complete
    → issues-created          ← vertical slices filed as GitHub issues
    → be-implemented          ← BE gate passed, FE may start
    → fe-implemented          ← FE gate passed, awaiting human
    → approved                ← human sign-off, feature done
```

`contracted` (backlog) is set when step 16 completes with `validate:contract` pass — static **and** motion blocks for all in-scope chains (or human-approved partial).

---

## Key files per feature

```
MLtravel-Backend/
  docs/features/<id>/
    brief.md                  ← feature-brief
    prd-v1.md                 ← prd-author
    prd-v2.md                 ← prd-update
  features/<id>/
    memory.md                 ← single source of truth, every skill appends here
    <id>.feature              ← Gherkins (@fe + @be tags)
    tickets/
      status.md
      fe-ticket.md
      be-ticket.md
      issues.md               ← GH# index (slice order)
  docs/openapi/paths/
    <be-id>.yaml              ← Contract 1
  docs/features/<be-id>/
    business-logic.md         ← Contract 2
  db/schema.ts                ← Contract 3

MLtravel-Frontend/
  features/<fe-id>/
    contract.md               ← design-contract (step 16) — static + Motion blocks
    figma/
      spec.json               ← figma-extract structured data
      layout.json             ← composition tree
      nodes/<nodeId>.json     ← every static + animation variant state
      asset-manifest.json     ← png · svg · gif (gifRef)
      chain-walk-report.json  ← step 12 chain walk
      motion-chains.json      ← step 12b — pattern, runner, timings, status
      motion-diffs.json       ← step 12b — per-layer Smart Animate deltas
      motion-inferred-overlays.json  ← optional — close chains when REST lacks interactions
      reference-*.png         ← static section refs
      reference-*-animation-state-*.png  ← per-state motion refs (step 12)
      notes.md                ← dual-source + motion reconciliation tables
  tokens/
    ui-registry.json          ← component paths incl. component.*.motion.*
```

---

## Hard rules (summary)

1. **BE before FE** — FE never starts until BE status is `be-implemented`.
2. **No Figma on BE** — BE reads only Gherkins. Figma is FE-only.
3. **Swagger is produced, never an input** — `openapi-author` writes it from Gherkins.
4. **Screenshots ≠ data** — `figma-extract` stops if `get_design_context` fails. No fallback to screenshots.
5. **No self-approval** — only a human sets status to `approved`.
6. **No raw hex/px** — all visual values from design tokens (motion diffs may store Figma px as metadata; TSX uses tokens).
7. **Slices before Gherkins** — `/to-issues` always runs before `/spec-author`. No exceptions.
8. **Slices are small** — a page is never a slice. Even a small component gets its own issue if it is independently demoable. Use `/grill-me` to enforce this.
9. **Motion in contract only at step 16** — from `motion-chains.json` + `motion-diffs.json` + `motion-state-poses.json`; never `MOTION-SPEC.md`; never invented in `fe-implement`.
10. **Re-open step 16 when motion JSON changes** — Figma prototype edits → 12 → 12b → update Motion blocks → then 17.

Full rules: `docs/end-to-end-sdlc-feature-flow.md`
