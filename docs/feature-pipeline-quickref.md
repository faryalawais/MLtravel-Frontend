# Feature Pipeline — Quick Reference

> Skills in execution order. BE runs first and must be `be-implemented` before
> FE opens. Both repos share the same parent ID and memory file.

> **Smart Zone Rule:** LLMs degrade past ~100k tokens. Every skill runs on ONE unit —
> one feature, one scenario, one component, one endpoint. Skills warn (never silently
> degrade) when scope is too large and ask whether to continue or start a fresh chat.
>
> **Day Shift (you must be present):** `/feature-brief`, `/grill-me` (×2), `/prd-author`, `/prd-review`, `/ticket-generate`, `/to-issues`, `/scenario-review`, `/gherkin-validate` sign-off, gate reviews, **per-slice human review inside `/fe-implement` (Step 7)**, final visual sign-off, `status: approved`.
> **Night Shift (agent runs AFK):** `/prd-update`, `/openapi-author`, `/business-logic-author`, `/orm-schema-author`, `/be-implement`, `/figma-extract`, `/design-tokens`, `/ui-registry-build`, `/registry-validate`, `/design-contract`, `/fe-implement`.
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

| # | Skill | Repo | Input needed |
|---|-------|------|-------------|
| 12 | `/figma-extract` | MLtravel-Frontend | Figma node ID for this feature's frames |
| 13 | `/design-tokens` | MLtravel-Frontend | Runs token pipeline (validate → build) |
| 14 | `/ui-registry-build` | MLtravel-Frontend | Registers `screen.*` / `component.*` paths |
| 15 | `/registry-validate` | MLtravel-Frontend | Confirms all paths are valid |
| 16 | `/design-contract` | MLtravel-Frontend | `features/<fe-id>/contract.md` — FE Contract |
| 17 | `/fe-implement` | MLtravel-Frontend | Pages + components in `app/` · `components/` · **stops at Step 7 for human APPROVE per slice** |

> **Gate:** `npm run gate` must pass (typecheck + token-lint + ESLint + BDD + visual).
> **Per-slice gate (inside fe-implement):** After automated checks, the agent presents a
> review card and waits for **APPROVE** before memory / commit / next GitHub issue.
> Violations → fix via the correct upstream skill (`/figma-extract`, `/design-contract`, etc.),
> re-run gates, review again. Status → `fe-implemented` only after all slices approved.

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
  docs/openapi/paths/
    <be-id>.yaml              ← Contract 1
  docs/features/<be-id>/
    business-logic.md         ← Contract 2
  db/schema.ts                ← Contract 3

MLtravel-Frontend/
  features/<fe-id>/
    figma/
      spec.json               ← figma-extract structured data
      asset-manifest.json     ← figma-extract assets
      reference-*.png         ← visual reference per section
    contract.md               ← design-contract FE spec
  tokens/
    ui-registry.json          ← component paths
```

---

## Hard rules (summary)

1. **BE before FE** — FE never starts until BE status is `be-implemented`.
2. **No Figma on BE** — BE reads only Gherkins. Figma is FE-only.
3. **Swagger is produced, never an input** — `openapi-author` writes it from Gherkins.
4. **Screenshots ≠ data** — `figma-extract` stops if `get_design_context` fails. No fallback to screenshots.
5. **No self-approval** — only a human sets status to `approved`.
6. **No raw hex/px** — all visual values from design tokens.
7. **Slices before Gherkins** — `/to-issues` always runs before `/spec-author`. No exceptions.
8. **Slices are small** — a page is never a slice. Even a small component gets its own issue if it is independently demoable. Use `/grill-me` to enforce this.

Full rules: `docs/end-to-end-sdlc-feature-flow.md`
