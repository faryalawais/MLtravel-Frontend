# Animation Guideline — How We Build Motion

> **Audience:** designers, FE devs, agents — anyone who needs the idea in one place.  
> **Pipeline home:** `docs/feature-pipeline-quickref.md` Phase 3 steps **12 → 12b → 13–17**.  
> **Deep spec:** `docs/motion-pipeline-plan.md` (implementation detail for engineers).

---

## The idea in one sentence

**Figma owns animation intent; we extract it into JSON; agents and devs implement from that JSON — not from hand-written motion docs or copied code from other sections.**

---

## Two places in Figma

| Place | What it defines |
|-------|-----------------|
| **Page frames** (Landing, Pricing, …) | Static layout — spacing, type, colours |
| **🎇 Animations page** | Prototype states — hover chains, timing, what moves |

Every animated section has a **static twin** and an **animation twin**:

```
ProblemSection          ↔  ProblemSection-animation
PricingSection          ↔  PricingSectionanimation
```

Naming must stay paired. Static frames feed layout; animation frames feed motion.

### Web entrance idle (required to specify — Figma/requirements decide)

Static twin = layout truth; animation chain = motion truth. **`productIdle` is
not a global hard-code.** Forcing every section to `hidden` rejects valid
“no empty state” designs; forcing every section to `staticTwin` causes flash
when a reveal was intended.

| Idle | Purpose | Who sees it |
|------|---------|-------------|
| **productIdle** | Explicit first paint: `staticTwin` \| `entryPose` \| `hidden` | Production / staging |
| **qaIdle** | Snapshot / fixture idle (often `staticTwin`) | Playwright / golden QA |

**Choose per slice from designer / Figma / PRD** (ask if ambiguous — never guess):

| productIdle | First paint | Typical demand |
|-------------|-------------|----------------|
| `staticTwin` | Finished layout, **no empty states** | Content always visible; motion on hover only |
| `entryPose` | Animation state 1 | Prototype idle is the live idle |
| `hidden` | Invisible until trigger | Scroll / nav reveal |

**Mandatory intent, flexible naming:** designers need not use the keys
`productIdle` / `qaIdle`. Prose, Figma comments, or Variables
(`firstPaint`, `webIdle`, `idleMode`, `e2eIdle`, …) are fine — pipeline skills
map them to the canonical enums in `notes.md` / `contract.md`. FE and QA only
read the contract. If intent cannot be mapped → STOP and ask.

Record **Web entrance** (`productIdle` + `qaIdle` + `source` + `triggers`) before
APPROVE. Triggers (`hover`, `inView`, `hash`, `load`) are also per-slice, not
global defaults.

Authoritative skill detail: `.claude/skills/figma-extract/SKILL.md` § Web entrance
idle · `design-contract` §5a-web · `fe-implement` idle checklist.

---

## Two kinds of motion

| Kind | What the user sees | Figma signal | How we build it |
|------|-------------------|--------------|-----------------|
| **Interactive** | Something changes on hover (cards cascade, section reveals) | `interactions[]` on animation variant chain | CSS transitions + small JS step runners |
| **Ambient** | Loop plays on its own (plane GIF, Lottie-style asset) | `gifRef` on an image fill | `<Image unoptimized />` — no hover handler |

Most sections use **interactive** only. **Ambient** is additive (e.g. a decorative GIF on a static layer).

---

## Where it sits in the pipeline

Motion is not a side project — it runs inside the normal FE phase:

```
12   /figma-extract          Pull static + animation frames; walk full variant chain
12b  build:motion-from-cache   Build motion-chains.json + motion-diffs.json
13   /design-tokens          motion.duration.* → CSS variables
14   /ui-registry-build       component.*.motion.* test-ids
15   /registry-validate
16   /design-contract         Motion summary in contract.md
17   /fe-implement            Wire code from motion JSON; human APPROVE (Step 7)
```

**Night shift (agent):** 12 → 12b → 13–16.  
**Day shift (human):** Step 7 — hover the slice, compare to Figma reference PNGs, APPROVE.

**Gate:** `validate:motion-chains` must pass before `design-contract` and before coding animation for a slice.

---

## The flow (extract → contract → code)

```
Figma 🎇 Animations page
        │
        ▼
┌─────────────────────┐
│ 12 figma-extract    │  Cache EVERY variant state (not just state 1)
│    + chain walk     │  + gifRef assets + reference PNGs per state
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 12b build motion    │  motion-chains.json  — when & how long
│    from cache       │  motion-diffs.json   — what moves per step
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 16 design-contract  │  Short Motion block per slice in contract.md
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│ 17 fe-implement     │  Pattern runner + helpers + test-ids
└─────────────────────┘
```

**No separate motion markdown spec is required.** If a human-readable catalog exists, it is generated from `motion-chains.json` for onboarding only — agents never read it.

---

## What each artifact contains

### `motion-chains.json` — timing and pattern

Answers: *How many steps? How long? What triggers it? Which code runner?*

```json
{
  "name": "ProblemSection-animation",
  "pattern": "rapid-four-step",
  "runner": "runRapidFourStepMotion",
  "trigger": {
    "event": "onMouseEnter",
    "targetTestId": "component.landing.problem.motion.root"
  },
  "states": [
    { "index": 1, "nodeId": "…", "label": "idle" },
    { "index": 5, "nodeId": "…", "label": "final" }
  ],
  "transitions": [
    {
      "trigger": "MOUSE_ENTER",
      "durationToken": "motion.duration.default",
      "easingToken": "motion.easing.default"
    },
    {
      "trigger": "AFTER_TIMEOUT",
      "delayToken": "motion.duration.stepDelay",
      "durationToken": "motion.duration.default"
    }
  ],
  "status": "closed"
}
```

### `motion-diffs.json` — what moves

Answers: *Which layer? Which property? Which helper at which step?*

```json
{
  "chain": "ProblemSection-animation",
  "from": "state-1",
  "to": "state-2",
  "layers": [
    {
      "name": "header-wrap",
      "testId": "component.landing.problem.motion.headerWrap",
      "stepIndex": 0,
      "changes": {
        "translateY": { "fromPx": 24, "toPx": 0, "token": "spacing.24" }
      },
      "helper": "getMotionSlideRevealStyle"
    },
    {
      "name": "card-1",
      "testId": "component.landing.problem.motion.card1",
      "stepIndex": 0,
      "changes": {
        "borderColor": { "toToken": "color.border.brand-navy" },
        "boxShadow": { "toToken": "shadow.card" }
      },
      "helper": "getMotionCascadeCardSurfaceStyle"
    }
  ]
}
```

Figma stores raw `px` / `ms` in extract files only. **Components use design tokens** (`var(--spacing-24)`, `var(--motion-duration-default)`).

---

## Animation patterns (catalog)

The build step classifies each animation chain into one pattern. Implementation is mechanical from the pattern name.

| Pattern | Figma shape | Example sections | Implementation |
|---------|-------------|------------------|----------------|
| `simple-one-step` | Hover → one transition → hold | Comparison, Pricing, Social proof strip | `useOneWayMotion` + reveal helper |
| `rapid-four-step` | Hover → 3 auto-steps @ **120ms** | Problem, How-it-works | `runRapidFourStepMotion` |
| `staged-sequence` | Hover → 1–3 auto-steps @ **300ms** | Hero, Feature grid | `runHeroMotion` or `runFeatureGridMotion` |
| `ambient-gif` | `gifRef` fill | Route plane, decorative loops | `<Image unoptimized />` |
| `custom` | Does not fit catalog | Carousel auto-advance, unusual timings | Contract step table + human APPROVE |

**Global rules (product, same for all patterns):**

- Trigger: hover (`MOUSE_ENTER` / `ON_HOVER`)
- One-way: animation plays once, does not reverse on mouse leave
- Transition type: Smart Animate → CSS `transition` on opacity, transform, border, shadow

---

## Pattern examples

### 1. Simple one-step (Pricing)

**Figma prototype:**

```
[Idle] --(hover, 700ms, ease-in)--> [Revealed] -- holds
```

**motion-chains:** `pattern: "simple-one-step"`, one transition.

**Code shape:**

```tsx
const [revealed, setRevealed] = useState(false);
const trigger = useOneWayMotion(() => () => setRevealed(true));

<div onMouseEnter={trigger} data-testid={ids.landing.pricing.motion.root}>
  <div style={getMotionSlideRevealStyle(revealed, DEFAULT_MOTION_STYLE)}>
    …
  </div>
</div>
```

---

### 2. Rapid four-step (Problem)

**Figma prototype:**

```
[1] --(hover, 700ms)--> [2]
[2] --(auto 120ms)--> [3] --(auto 120ms)--> [4] --(auto 120ms)--> [5] -- holds
```

**motion-chains:** `pattern: "rapid-four-step"`, `runner: "runRapidFourStepMotion"`.

**Code shape:**

```tsx
const [revealedUpTo, setRevealedUpTo] = useState(-1);
const [activeIndex, setActiveIndex] = useState<number | null>(null);
const [motionEngaged, setMotionEngaged] = useState(false);
// … headerEmphasized, ctaEmphasized per motion-diffs steps

const play = useCallback(
  () =>
    runRapidFourStepMotion([
      () => { /* step 0: from motion-diffs */ },
      () => { /* step 1 */ },
      () => { /* step 2 */ },
      () => { /* step 3 */ },
    ]),
  [],
);
const trigger = useOneWayMotion(play);

// Each card: style from getMotionCascadeCardSurfaceStyle per motion-diffs row
```

Step bodies come from **`motion-diffs.json`**, not from copying another section.

---

### 3. Staged sequence (Hero)

**Figma prototype (`hero-animation` — 3 states, 2 transitions):**

```
[1 idle] --(hover, 700ms, ease-out)--> [2 text settled]
[2] --(auto 300ms)--> [3 CTA partial] -- holds
```

**motion-chains:** `pattern: "staged-sequence"`, `runner: "runHeroMotion"`, `HERO_MOTION_STYLE`.

**motion-state-poses:** per-state `translateYpx` for `Frame 1561553827` (text) and `Frame 1561553830` (CTA+proof).

**Idle / initial render (from contract Web entrance — not a global rule):**
- **Production:** match `productIdle` — `staticTwin` (visible finished layout /
  no empty states), `entryPose`, or `hidden` until the contracted triggers fire.
- **QA:** when `productIdle ≠ qaIdle`, use `NEXT_PUBLIC_E2E_MODE=1` so fixtures
  can keep `qaIdle` (often static twin). When both are `staticTwin`, modes align.

**Code shape:**

```tsx
const [motionEngaged, setMotionEngaged] = useState(false);
const [motionStep, setMotionStep] = useState<0 | 1 | 2>(0);

const playMotion = useCallback(() => {
  setMotionEngaged(true);
  setMotionStep(0);
  return runHeroMotion(
    () => setMotionStep(1), // text 370→0
    () => setMotionStep(2), // CTA 370→284
  );
}, []);

// !motionEngaged → pose from contract productIdle (staticTwin | entryPose | hidden)
// dual-mode only when productIdle ≠ qaIdle (E2E flag → qaIdle)
// motionEngaged → absolute shared-origin + getHeroColumnMotionStyle
```

Product image and stats/logos stay **static** across all 3 Figma states — do not animate from legacy prose specs.

**Timing:** step 2 fires at `transitionMs + autoAdvanceMs` from hover (1000ms default), **not** `delay × stepIndex`.

---

### 4. Ambient GIF

**Figma:** static layer with `gifRef` on fill — no animation frame needed.

**asset-manifest:**

```json
{
  "localPath": "public/images/route-plane.gif",
  "type": "gif",
  "width": 150,
  "height": 22
}
```

**Code shape:**

```tsx
<Image
  src="/images/route-plane.gif"
  width={150}
  height={22}
  unoptimized
  alt=""
  aria-hidden
/>
```

No `useOneWayMotion`. GIF loops by itself.

---

### 5. Hybrid section (two subgraphs)

One UI section can have **two independent** motion graphs — e.g. testimonials carousel + integrations strip hover.

`motion-chains.json` holds **two** `chains[]` entries with different `subgraphId`. `fe-implement` wires each separately. Do not force one pattern on the whole section.

---

## Skills — who does what

| Step | Skill / command | Motion responsibility |
|------|-----------------|----------------------|
| 12 | `/figma-extract` | Cache all variant states; chain walk; gifRef; per-state reference PNGs |
| 12b | `build:motion-from-cache` | Emit `motion-chains.json` + `motion-diffs.json` + `motion-state-poses.json` |
| 13 | `/design-tokens` | `motion.duration.default`, `stepDelay`, `autoAdvance`, easing → CSS vars |
| 14–15 | `/ui-registry-build` | Register `component.*.motion.*` paths for every moving layer |
| 16 | `/design-contract` | Copy Motion block into `contract.md` from JSON (0 MCP calls) |
| 17 | `/fe-implement` | Implement from pattern + diffs; Step 7 visual review |

No new skill is required beyond extending these six touchpoints.

---

## contract.md — what Motion block looks like

Short human summary — sourced from JSON, not written from scratch:

```markdown
**Motion (motion-chains):** pattern `rapid-four-step` · status `closed` —
`onMouseEnter` on `component.landing.problem.motion.root`;
`motion.duration.default` + `motion.easing.default`; one-way.

**Motion bindings (motion-diffs):**
| Step | testId | Helper | Change |
|------|--------|--------|--------|
| 0 | …problem.motion.headerWrap | getMotionSlideRevealStyle | translateY spacing.24 → 0 |
| 0 | …problem.motion.card1 | getMotionCascadeCardSurfaceStyle | border + shadow |
```

---

## Rules everyone follows

1. **Figma is the source** — Animations page prototypes, not a separate motion doc.
2. **Extract before code** — chain must be `closed` in `motion-chains.json`.
3. **Tokens in UI** — durations and spacing from CSS variables, never raw `700ms` or `24px` in components.
4. **No sibling cloning** — do not copy Problem’s motion into Feature grid; read that slice’s diffs.
5. **Desktop motion by default** — mobile stays static unless an animation mobile twin exists in Figma.
6. **Human sign-off** — Step 7 compares live hover to `reference-*-animation-state-*.png`.

---

## When something is wrong

| Problem | Go back to |
|---------|------------|
| Missing variant state in cache | `/figma-extract` (chain walk) |
| Wrong timing or pattern | `build:motion-from-cache` |
| Wrong layer binding | `/ui-registry-build` then rebuild diffs |
| Wrong Motion text in contract | `/design-contract` |
| Animation looks wrong in browser | `/fe-implement` Step 7 — or fix upstream JSON, not guess in CSS |

---