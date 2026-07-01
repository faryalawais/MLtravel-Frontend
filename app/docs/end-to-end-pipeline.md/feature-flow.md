# End-to-End SDLC Feature Pipeline — Rules and Structure

> **Purpose of this file:** Every skill, agent, and human participant reads this
> document to understand the pipeline structure. When you build a new skill,
> your first action is to read this file. It tells you what memory exists, what
> your inputs are, what you must produce, and what you must write back to memory.

---

## 0. Core Concepts

### Smart Zone vs Dumb Zone

LLMs degrade past ~100k tokens regardless of context window size. Every skill
in this pipeline is scoped to stay inside the smart zone:

| Smart Zone ✅ | Dumb Zone ❌ |
|---|---|
| One feature per skill run | Multiple features in one run |
| One Gherkin scenario per `speckit-implement` task | All scenarios in one pass |
| One API endpoint per `openapi-author` path block | Entire API in one generation |
| One component per `fe-implement` task | Entire page in one generation |
| One slice per `to-issues` issue | "Homepage" as a single issue |

**Enforcement:** If you find yourself reading more than ~5 large files, writing
more than ~200 lines of code, or covering more than one user-visible element in
a single skill invocation — **stop, split, and re-run on a smaller unit.**
The pipeline architecture enforces this through vertical slicing: small slices
→ small Gherkins → small implementation tasks → always in the smart zone.

---

### Day Shift vs Night Shift

| Day Shift — you must be present (HITL) | Night Shift — agent runs AFK |
|---|---|
| `/feature-brief` — capture the feature idea | `/prd-update` — enrich PRD with Figma + Swagger |
| `/grill-me` — stress-test the idea before PRD | `/openapi-author` — generate Swagger from Gherkins |
| `/prd-author` — grilling session + PRD v1 draft | `/business-logic-author` — derive rules from Swagger |
| `/prd-review` — approve PRD v1 and v2 | `/orm-schema-author` — schema from OpenAPI |
| `/ticket-generate` — review FE + BE child tickets | `/be-implement` — route handlers + tests |
| `/to-issues` — define and review vertical slices | `/figma-extract` — pull measurements from Figma |
| `/grill-me` — stress-test slices before Gherkins | `/design-tokens` — compile token pipeline |
| `/scenario-review` — human Gherkin review | `/ui-registry-build` + `/registry-validate` |
| `/gherkin-validate` — sign off on validated Gherkins | `/design-contract` — FE contract from Figma + Gherkins |
| Gate report review (BE + FE) | `/fe-implement` — pages + components |
| Final visual comparison (Figma vs app) | |
| Setting `status: approved` — only a human | |

**Invest in the day shift. Night shift quality is determined before it starts.**
The grilling sessions and slice reviews are where defects are cheapest to fix.
If a night shift skill warns about smart zone limits, start a fresh chat — don't push through.

---

### ID Convention
**Every `<id>` = Jira ticket ID.** One parent ticket per feature. `ticket-generate`
creates a FE child ticket (`<fe-jira-id>`) and a BE child ticket (`<be-jira-id>`)
from the parent. These IDs appear in every file path, folder name, branch name,
and skill reference from that point forward.

```
<parent-id>       e.g. PROJ-42      parent feature ticket
<fe-jira-id>      e.g. PROJ-43      frontend child ticket
<be-jira-id>      e.g. PROJ-44      backend child ticket
```

### Repo Architecture
FE and BE live in **separate repositories**. They never share code.
- FE repo owns: `app/`, `components/`, `tokens/`, `features/<fe-jira-id>/`
- BE repo owns: `app/api/`, `db/`, `docs/openapi/`, `features/<be-jira-id>/`

### Sequence — BE first, then FE
BE must be fully implemented before FE repo setup begins. The completed
OpenAPI spec (Swagger) is a required input for FE. FE never unblocks BE.

### ORM
DB schema and relations live in `db/schema.ts` in the BE repo. Agents read this
file directly — no DB introspection at any point.

---

## 1. Project Memory — The Single Source of Truth

### What project memory is
**Project memory is one Markdown file per feature.** Every skill that runs
appends its output to this file. Future skills read this file first to answer
the question: *"Do I understand this feature?"* before doing any other work.

### Memory file location
```
features/<parent-id>/memory.md
```

### Memory file structure

```markdown
# Feature Memory — <parent-id>: <Feature Name>

## Feature Identity
- **Parent ticket:** <parent-id>
- **FE ticket:** <fe-jira-id>
- **BE ticket:** <be-jira-id>
- **Status:** <current pipeline status>
- **Last updated:** <ISO date>

---

## PRD v1
<!-- Written by: prd-author -->
<!-- Approved by: human via prd-review -->
<summary of initial PRD — problem, goals, screens, personas>
Full file: docs/features/<parent-id>/prd-v1.md

---

## PRD v2
<!-- Written by: prd-update -->
<!-- Approved by: human via prd-review -->
<enriched PRD — Figma analysis, Swagger review, data points FE needs, edge cases>
Full file: docs/features/<parent-id>/prd-v2.md

---

## Gherkins
<!-- Written by: spec-author -->
<!-- Reviewed by: human via scenario-review -->
<!-- Validated by: gherkin-validate (exit 0) -->
Full file: features/<parent-id>/<parent-id>.feature

### @fe scenarios (summary)
- Scenario: <name> — <what it tests>
- ...

### @be scenarios (summary)
- Scenario: <name> — <what it tests>
- ...

### Coverage notes
- AC covered: <list>
- Edge cases: <list>

---

## UI Registry
<!-- Written by: ui-registry-build -->
<!-- Validated by: registry-validate (exit 0) -->
Full file: tokens/ui-registry.json (FE repo)

### Components catalogued
- <component.path>: <description>
- ...

---

## FE Contract
<!-- Written by: design-contract -->
<!-- Validated by: validate:figma-coverage + validate:contract (exit 0) -->
Full file: features/<fe-jira-id>/contract.md (FE repo)

### Anatomy summary
- <section>: <brief description>
- ...

### API field bindings
- <field.path>: <endpoint> → <component path>
- ...

---

## BE Contract
<!-- Written by: openapi-author + business-logic-author + orm-schema-author -->
Full files:
  Contract 1 (OpenAPI): docs/openapi/paths/<be-jira-id>.yaml (BE repo)
  Contract 2 (Business Logic): docs/features/<be-jira-id>/business-logic.md (BE repo)
  Contract 3 (ORM Schema): db/schema.ts (BE repo)

### Endpoints
- <METHOD> <path>: <what it does>
- ...

### Key business rules
- <rule>
- ...

---

## Implementation Notes
<!-- Appended by: fe-implement and be-implement -->
### FE notes
- <any discoveries, deviations from contract, known gaps>

### BE notes
- <any discoveries, deviations from contract, known gaps>

---

## Gate Results
<!-- Appended by: impl-gate / governance-gate -->
### FE gate
- Status: pass / fail / blocked
- Run date: <ISO date>

### BE gate
- Status: pass / fail / blocked
- Run date: <ISO date>
```

### Memory rules for skill authors

Every skill MUST follow these rules:

1. **Read memory first.** Before any other action, read `features/<parent-id>/memory.md`.
   If it does not exist, create it with the Feature Identity section populated.

2. **Write to memory last.** After producing output, append the relevant section
   to memory. Use the section template for your skill (see §3 below). Never
   overwrite another skill's section.

3. **Memory is append-only per section.** A skill may only write to its own
   labelled section. Never delete or modify sections written by other skills.

4. **Memory is the context for "do you understand this feature?"** If a skill
   is asked to run and memory contains Gherkins, PRD v2, and contracts — the
   skill does not ask the user to re-explain the feature. It reads memory and
   proceeds. No re-grilling on settled decisions.

5. **Gherkins in memory = finalized Gherkins.** Once `gherkin-validate` exits 0
   and the Gherkins section is written to memory, no skill may modify Gherkins
   without running `gherkin-validate` again and re-writing the section.

---

## 2. Canonical Data Structures

### PRD v1 — Initial Brief
Written by `prd-author`. Located at `docs/features/<parent-id>/prd-v1.md`.

Required sections:
```markdown
# PRD v1 — <Feature Name>

## Problem
<What pain does this feature solve? Who experiences it?>

## Goals
- <measurable goal 1>
- <measurable goal 2>

## Personas
| Persona | Needs |
|---------|-------|
| <name> | <needs> |

## Screens
| Screen | What user can do | Figma frame | API-backed? |
|--------|-----------------|-------------|-------------|
| <name> | <actions> | <frame name / nodeId> | yes / no |

## Acceptance Criteria (initial)
- Given <state>, when <action>, then <outcome>
- ...

## Figma
- File URL: <url>
- Frames: <list of frame names and nodeIds>

## Out of scope
- <item>
```

### PRD v2 — Enriched PRD
Written by `prd-update`. Located at `docs/features/<parent-id>/prd-v2.md`.

Required sections (all of PRD v1 plus):
```markdown
## Figma Analysis
<What was found in Figma — components, layout, states, tokens>

## Swagger Analysis
<What endpoints exist, response shapes, fields FE needs>

## Data Points FE Needs from BE
| UI Component | Data field | Endpoint | Response path |
|-------------|-----------|----------|---------------|
| <component> | <field name> | <METHOD /path> | <$.data.field> |

## Edge Cases
- <edge case 1>
- <edge case 2>

## Updated Acceptance Criteria
<full list, refined from Figma + Swagger review>
```

### Gherkins — Shared Feature File
Written by `spec-author`. Located at `features/<parent-id>/<parent-id>.feature`.

Rules:
- One file per feature. Never split into separate FE/BE files.
- `@fe` tag: UI state and interaction scenarios consumed by FE.
- `@be` tag: endpoint behaviour scenarios consumed by BE.
- Tags are for **test execution only** — both sides read the full file.
- Each scenario is a self-contained vertical slice: `Given` sets up all state
  from scratch. No scenario depends on state from a prior scenario.
- Every `Given` that references a component uses `screen.*` or `component.*` paths.
- Every `Given` that references an endpoint uses the OpenAPI path.

Format:
```gherkin
Feature: <Feature Name> (<parent-id>)

  # ── FE scenarios ──────────────────────────────────────────────────────────
  @fe
  Scenario: <descriptive name — one complete behaviour>
    Given <full state set up from scratch>
    When <one user action>
    Then `component.<path>` is visible
    And `component.<path>` displays "<expected value>"

  @fe
  Scenario: <empty state>
    Given <empty state set up from scratch>
    When <action>
    Then `component.<path>.emptyState` is visible

  # ── BE scenarios ──────────────────────────────────────────────────────────
  @be
  Scenario: <endpoint behaviour name>
    Given <request state set up from scratch>
    When a <METHOD> request is made to "<path>"
    Then the response status is <code>
    And the response body matches the OpenAPI schema for "<operationId>"
```

### BE Contract — 3 Artifacts

**Contract 1 — OpenAPI spec** (produced by `openapi-author`)
Location: `docs/openapi/paths/<be-jira-id>.yaml` (BE repo)
- OpenAPI 3.1 format
- Every path, method, request body, response schema, error shape
- Derived entirely from `@be` Gherkins — no invented endpoints

**Contract 2 — Business Logic** (produced by `business-logic-author`)
Location: `docs/features/<be-jira-id>/business-logic.md` (BE repo)
```markdown
# Business Logic — <be-jira-id>

## Validation Rules
| Field | Rule | Error code |
|-------|------|-----------|
| <field> | <rule> | <code> |

## State Machines
<For any entity with lifecycle states — diagram + transitions>

## Calculations
<Any derived values, formulas, rounding rules>

## Authorization
<Who can do what — roles, ownership checks>

## Edge Cases
<Specific non-obvious behaviours the OpenAPI spec does not capture>
```

**Contract 3 — ORM Schema** (produced by `orm-schema-author`)
Location: `db/schema.ts` (BE repo)
- Drizzle ORM format (or project ORM)
- All tables, columns, types, relations
- Derived from OpenAPI schemas
- Agent reads this directly during implementation — no DB introspection

### FE Contract
Written by `design-contract`. Location: `features/<fe-jira-id>/contract.md` (FE repo).
Structure defined by `design-contract` skill. Must pass:
- `npm run validate:figma-coverage -- <fe-jira-id>` (exit 0)
- `npm run validate:contract -- <fe-jira-id>` (exit 0)

---

## 3. Skill Contracts — Input / Output / Memory

Each skill below: what it reads, what it produces, and what it writes to memory.

---

### `feature-brief`
| | |
|---|---|
| **Reads** | User input (feature idea) |
| **Produces** | `docs/features/<parent-id>/brief.md` |
| **Memory write** | Creates `features/<parent-id>/memory.md` with Feature Identity section |
| **Status after** | `brief-created` on parent Jira ticket |

---

### `grill-me` _(recommended — run twice: after `feature-brief` and after `to-issues`)_
| | |
|---|---|
| **Reads** | Current conversation context — the brief or the proposed slice list |
| **Produces** | A hardened plan — assumptions challenged, gaps surfaced, slices validated |
| **Memory write** | None — grilling output stays in conversation |
| **When to run** | 1) After `feature-brief`, before `prd-author` — stress-test the feature idea. 2) After `to-issues`, before `spec-author` — stress-test slice granularity. Ask: is every slice independently demoable? Are any slices still page-sized? |
| **Key question for slices** | _"Can you demo this slice without building anything else?"_ If no → split. Even small components (badge, search input, dropdown) are their own slice if they have independent value. |

---

### `prd-author`
| | |
|---|---|
| **Reads** | `brief.md`, Figma URL, user answers (grilling session) |
| **Produces** | `docs/features/<parent-id>/prd-v1.md` |
| **Memory write** | Writes PRD v1 section to memory |
| **Blocks on** | Human approval via `prd-review` before writing memory |
| **Status after** | `prd-v1-approved` |

---

### `prd-update`
| | |
|---|---|
| **Reads** | `prd-v1.md`, Figma frame data, Swagger (if exists), memory PRD v1 section |
| **Produces** | `docs/features/<parent-id>/prd-v2.md` |
| **Memory write** | Writes PRD v2 section to memory |
| **Blocks on** | Human approval via `prd-review` before writing memory |
| **Status after** | `prd-v2-approved` |

---

### `ticket-generate`
| | |
|---|---|
| **Reads** | `prd-v2.md`, memory |
| **Produces** | Parent Jira ticket, `<fe-jira-id>` child ticket, `<be-jira-id>` child ticket |
| **Memory write** | Updates Feature Identity section with `<fe-jira-id>` and `<be-jira-id>` |
| **Status after** | `tickets-created` |

---

### `spec-author`
| | |
|---|---|
| **Reads** | `prd-v2.md`, Figma frame data, Swagger (if available), memory |
| **Produces** | `features/<parent-id>/<parent-id>.feature` (shared, stored in Jira / project memory) |
| **Memory write** | Writes Gherkins section (scenario summaries + `@fe`/`@be` split + coverage notes) |
| **Blocks on** | Human review via `scenario-review` + `gherkin-validate` exit 0 |
| **Status after** | `gherkins-ready` |
| **Key rule** | Gherkins are finalized only after both human review and `gherkin-validate` pass. Once in memory, no skill modifies them without re-validation. |

---

### `to-issues` (BE repo — after `ticket-generate`, before `spec-author`)
| | |
|---|---|
| **Reads** | `prd-v2.md`, `tickets/fe-ticket.md` + `be-ticket.md`, codebase (optional — prefactor scan) |
| **Produces** | GitHub issues — one per vertical slice, filed in dependency order |
| **Memory write** | No memory section — issues are the output |
| **Gate** | `spec-author` checks for these issues before writing any Gherkin. No issues = blocked. |
| **Status after** | `issues-created` on parent ticket |

**Vertical slicing rules (strict — enforce all of these):**
- One issue = one user-visible element OR one API endpoint. Never a whole page.
- A page is a container, not a feature. A homepage must become: navbar / sidebar / category list / hero / footer — each a separate issue.
- Even small components (a badge, a search input, a dropdown, a tab bar) get their own issue if they are independently demoable.
- The demo test: _"Can I show this working without building anything else on the page?"_ If no → split further.
- Prefactoring issues go first (blockers), then feature slices in dependency order.
- After producing the slice list, recommend running `/grill-me` to stress-test granularity before Gherkins are written.

---

### `figma-extract` (FE repo)
| | |
|---|---|
| **Reads** | Figma (via MCP), `<fe-jira-id>`, memory |
| **Produces** | `tokens/` (Mode A), `features/<fe-jira-id>/figma/spec.json`, `reference.png`, `notes.md`, `asset-manifest.json` (Mode B) |
| **Memory write** | No memory section — output consumed by downstream skills |
| **Status after** | `figma-extracted` on FE ticket |

---

### `design-tokens` (FE repo)
| | |
|---|---|
| **Reads** | `tokens/primitives.json`, `tokens/semantics.json`, `tokens/typography.json` |
| **Produces** | CSS variables, Tailwind theme, `reports/tokens-report.md` |
| **Memory write** | No memory section |
| **Status after** | `tokens-compiled` |

---

### `ui-registry-build` (FE repo)
| | |
|---|---|
| **Reads** | `features/<fe-jira-id>/figma/spec.json`, `tokens/`, memory Gherkins section |
| **Produces** | `tokens/ui-registry.json` |
| **Memory write** | Writes UI Registry section (components catalogued, token bindings) |
| **Blocks on** | `registry-validate` exit 0 |
| **Status after** | `ui-registry-ready` on FE ticket |

---

### `design-contract` (FE repo)
| | |
|---|---|
| **Reads** | Shared `.feature` (@fe), `figma/spec.json`, `tokens/ui-registry.json`, `tokens-report.md`, memory |
| **Produces** | `features/<fe-jira-id>/contract.md` |
| **Memory write** | Writes FE Contract section (anatomy summary, API field bindings) |
| **Blocks on** | `validate:figma-coverage` exit 0 AND `validate:contract` exit 0 |
| **Status after** | `fe-contract-ready` |

---

### `openapi-author` (BE repo)
| | |
|---|---|
| **Reads** | `@be` Gherkins (from memory), `prd-v2.md`, memory |
| **Produces** | `docs/openapi/paths/<be-jira-id>.yaml` + schemas |
| **Memory write** | Starts BE Contract section (endpoint list) |
| **Blocks on** | `openapi:validate` exit 0 |
| **Status after** | Partially — waits for all 3 BE contracts |
| **Key rule** | This is where Swagger is created. BE repo setup starts with Gherkins + PRD v2 — Swagger does not exist before this skill runs. |

---

### `business-logic-author` (BE repo)
| | |
|---|---|
| **Reads** | `@be` Gherkins (from memory), `docs/openapi/paths/<be-jira-id>.yaml`, memory |
| **Produces** | `docs/features/<be-jira-id>/business-logic.md` |
| **Memory write** | Appends to BE Contract section (key business rules) |
| **Status after** | Partially — waits for all 3 BE contracts |

---

### `orm-schema-author` (BE repo)
| | |
|---|---|
| **Reads** | `docs/openapi/paths/<be-jira-id>.yaml`, `@be` Gherkins, memory |
| **Produces** | `db/schema.ts` in BE repo |
| **Memory write** | Appends to BE Contract section (tables/columns) |
| **Blocks on** | `db:generate` + `db:migrate` exit 0 |
| **Status after** | `be-contract-ready` (all 3 contracts complete) |

---

### `fe-implement` (FE repo)
| | |
|---|---|
| **Reads** | `features/<fe-jira-id>/contract.md`, `figma/`, `@fe` Gherkins, OpenAPI spec from BE, memory |
| **Produces** | FE code in `app/`, `components/` |
| **Memory write** | Writes FE implementation notes to Implementation Notes section |
| **Internal flow** | `speckit-plan` → `speckit-tasks` → `speckit-implement` (one task per Gherkin scenario) |
| **Enforced reference** | Figma is the visual reference. Contract is the boundary. OpenAPI is the data contract. |
| **Blocks on** | `test:e2e` + `test:visual` pass |
| **Status after** | `fe-implemented` on FE ticket |

---

### `be-implement` (BE repo)
| | |
|---|---|
| **Reads** | `docs/openapi/paths/<be-jira-id>.yaml` (Contract 1), `business-logic.md` (Contract 2), `db/schema.ts` (Contract 3), `@be` Gherkins, memory |
| **Produces** | NestJS module + controller + service + DTOs in `src/<resource>/`, tests in `tests/api/<be-jira-id>/` |
| **Memory write** | Writes BE implementation notes to Implementation Notes section |
| **Internal flow** | One task per `@be` scenario — controller (routing) → service (logic) → DTO → test |
| **Enforced reference** | OpenAPI spec is the API contract. Business Logic is the rules reference. `db/schema.ts` is the data model (read directly, no introspection). Controllers contain NO business logic. |
| **Blocks on** | `test:api` + `openapi:validate` pass |
| **Status after** | `be-implemented` on BE ticket. **Triggers FE flow to begin.** |

---

### `jira-sync` (cross-cutting)
| | |
|---|---|
| **Reads** | Current stage completion status |
| **Produces** | Jira ticket status update |
| **Memory write** | Updates `Status` field in Feature Identity section |
| **When** | Runs after every stage completion |

---

### `figma-comment` (cross-cutting)
| | |
|---|---|
| **Reads** | Current stage output (Gherkins, PRD summary, etc.) |
| **Produces** | Comment on parent Jira ticket / Figma file |
| **Memory write** | No memory section |

---

## 4. Pipeline Status Lifecycle

```
parent ticket:  pending → brief-created → prd-v1-approved → prd-v2-approved
                → tickets-created → issues-created → gherkins-ready

be ticket:      pending → be-repo-ready → be-contract-ready → be-implemented

fe ticket:      pending → figma-extracted → ui-registry-ready
                → fe-contract-ready → fe-implemented → awaiting-approval → approved
```

Gate failures set status to `blocked`. Fix then re-run the gate to return to `implemented`.

---

## 5. Gate Rules

Every gate is a hard exit-0 check. No skill advances status past a gate unless the gate passes.

| Gate | Skill | Checks |
|---|---|---|
| `gherkin-validate` | `spec-author` | Syntax valid, every AC has a scenario, `@fe`/`@be` correctly tagged |
| `registry-validate` | `ui-registry-build` | Every Figma component covered, every data-bound component maps to a Swagger endpoint |
| `validate:figma-coverage` | `design-contract` | Every named Figma entity in `spec.json` appears in contract §2 |
| `validate:contract` | `design-contract` | Every `[component.*]` registered, every §1a path has ≥1 BDD step |
| `validate:assets` | `figma-extract` | Every static asset in manifest exists on disk with non-zero size |
| `openapi:validate` | `openapi-author` | OpenAPI spec is valid 3.1 |
| `test:api` | `be-implement` | All API tests pass against the OpenAPI contract |
| `test:e2e` | `fe-implement` | All BDD acceptance tests pass |
| `test:visual` | `fe-implement` | Visual regression within fidelity tolerance |

---

## 6. Rules for Building New Skills

If you are authoring a new skill, follow these rules:

1. **Start with a memory read.** Your first action is always:
   `Read features/<parent-id>/memory.md`
   If it does not exist, create it and populate Feature Identity.

2. **Know your inputs from memory.** Do not ask the user to provide data that
   already exists in memory (Gherkins, PRD, contracts). Read memory first.
   Only ask when memory is genuinely missing the data you need.

3. **Write your section to memory when done.** Append — never overwrite.
   Use the section template from §1 above for your skill type.

4. **One skill, one concern.** A skill that writes a contract does not also
   implement code. A skill that validates does not also write contracts.
   Stay within your defined input/output boundary.

5. **Gherkins are the source of truth for behaviour.** If a Gherkin scenario
   exists for a behaviour, implement it. If a behaviour is needed but has no
   Gherkin, stop and report — do not invent implementation without a scenario.

6. **IDs are immutable.** Never rename or reassign `<parent-id>`, `<fe-jira-id>`,
   or `<be-jira-id>` once `ticket-generate` has run.

7. **speckit is an internal tool inside `fe-implement` and `be-implement` only.**
   No other skill calls speckit directly. The pipeline manages tasks at the
   skill level, not inside speckit.

8. **Status advances on exit 0.** A skill writes `status: <next-status>` to
   Jira via `jira-sync` only after all required gates pass. Never advance
   status optimistically.

9. **Human approval is mandatory at PRD v1, PRD v2, Gherkins, and FE gate.**
   Skills do not self-approve. The `approved` status on any ticket is set by
   a human only.

10. **Figma = FE spec. Swagger = BE spec.**

11. **Slices before Gherkins — always.** `to-issues` must run before `spec-author`.
    No Gherkin may be written without a corresponding GitHub issue. This is
    enforced by `spec-author` blocking on missing issues.

12. **Slices are small — no exceptions.** A page is never a slice. Even a small
    component (badge, search input, tab bar, dropdown) gets its own issue if it
    is independently demoable. The test: _"Can I demo this without anything else
    on the page?"_ If no → split. Use `/grill-me` after `to-issues` to enforce this
    before Gherkins are written.

13. **Stay in the smart zone.** Every skill invocation targets exactly ONE unit:
    one feature, one Gherkin scenario, one endpoint, one component. If a skill
    detects the scope is too large (>10 scenarios, >15 issues, >~200 lines in one
    pass) it warns and asks the user whether to continue or split into a fresh chat.
    It never silently degrades — always surfaces the warning so the user can decide.

14. **Day shift is mandatory before night shift.** Skills that run AFK
    (`be-implement`, `fe-implement`, `openapi-author`, etc.) depend on day-shift
    work being complete: grilling done, slices reviewed, Gherkins validated.
    No AFK skill may start on a feature that has not passed its preceding human
    gates. A shortcut here degrades the entire night shift output. FE skills read Figma as authority
    on UI, layout, components, and data points. BE skills read Gherkins + PRD v2
    as authority on behaviour. BE never reads Figma directly.

---

## 7. Pipeline Flow Overview

```
         Feature Brief (initial idea)
                    ↓
              /grill-me  ← stress-test the idea before PRD
              (recommended — catches gaps early)
                    ↓
              PRD v1 — Initial Brief
              [Human approval]
                    ↓
              PRD v2 — Enriched PRD
              (Figma analysis + Swagger review)
              [Human approval]
                    ↓
           Ticket Generation
           (parent + FE child + BE child)
                    ↓
         Vertical Slice Issues (to-issues)
         one issue per UI element / API endpoint — never a whole page
         even small components (badge, input, dropdown) = own issue
         ← GATE: spec-author blocks until issues exist
                    ↓
              /grill-me  ← stress-test slices before Gherkins
              ("Can each slice be demoed standalone?" If no → split)
                    ↓
              Gherkins (shared @fe + @be)
              one scenario per vertical slice issue
              [Human review + gherkin-validate]
              → saved to memory
                    ↓
            ┌───────────────────────┐
            │  BE Flow starts first │
            └───────────────────────┘
         BE Repo Setup (Gherkins + PRD v2)
                    ↓
         BE Contract:
           Contract 1: openapi-author → OpenAPI spec
           Contract 2: business-logic-author → business-logic.md
           Contract 3: orm-schema-author → db/schema.ts
                    ↓
         BE Implementation (be-implement)
         → test:api + openapi:validate pass
                    ↓
         BE complete. OpenAPI spec published.
                    ↓
            ┌───────────────────────┐
            │  FE Flow starts       │
            └───────────────────────┘
         FE Repo Setup (Figma + Swagger)
                    ↓
         Figma Extract → design-tokens
                    ↓
         UI Registry (ui-registry-build + registry-validate)
                    ↓
         FE Contract (design-contract)
         → validate:figma-coverage + validate:contract pass
                    ↓
         FE Implementation (fe-implement)
         → test:e2e + test:visual pass
                    ↓
         Awaiting human approval
```

---

## 8. Related Documents

- [pipeline-fe-be-flows.md](pipeline-fe-be-flows.md) — Full stage-by-stage tables
  (Common Flow, FE Flow, BE Flow) with every skill, input, output, and test
- [pipeline-detail.md](pipeline-detail.md) — Unified detail table covering all
  stages in one sequence
- [SDLC-table.md](SDLC-table.md) — High-level stage table by role
  (Product / FE / BE / QA / Tech Review)
