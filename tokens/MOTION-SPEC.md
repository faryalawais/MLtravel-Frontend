# Motion & Interaction Spec — ML Travel Project

Source: Figma page "🎇 Animations" — extracted from Prototype settings on 2026-06-30.  
Covers: Landing page (8 components) + How It Works page (5 components) — 13 components total.

**Token naming:** Figma numeric primitives live in `tokens/primitives.json` (`motion.duration.700`, etc.). App code and Gherkin use semantic aliases in `tokens/semantics.json` (`motion.duration.default`, `motion.duration.stepDelay`, `motion.easing.hero`).

---

## Motion Tokens Reference

| Primitive (Figma) | Semantic (Gherkin / app) | Value | Used for |
|-------------------|--------------------------|-------|----------|
| `motion.duration.700` | `motion.duration.default` | 700ms | Every animation transition |
| `motion.duration.300` | `motion.duration.autoAdvance` | 300ms | Step delay — hero, feature, onboarding, six-week |
| `motion.duration.120` | `motion.duration.stepDelay` | 120ms | Step delay — problem, how-it-works sequences |
| `motion.easing.ease-out` | `motion.easing.hero` | `[0, 0, 0.58, 1]` | hero-animation (landing only) |
| `motion.easing.ease-in` | `motion.easing.default` | `[0.42, 0, 1, 1]` | Everything else |

---

## Global Behavior Rules

- **Trigger:** `MOUSE_ENTER` (hover) on all components
- **One-way only:** no animation reverses on hover-out — once triggered, the component holds its final state
- **No mouse-leave handler needed** in code
- **Smart Animate** is the transition type throughout (Figma interpolates between variant states)

---

## Landing Page Components

### 1. hero-animation
```
[State 1] --(hover, 700ms, ease-out)--> [State 2]
[State 2] --(auto after 300ms, 700ms, ease-out)--> [State 3]
[State 3] -- holds here
```
2-step reveal. Note: this is the only component using `ease-out` — all others use `ease-in`.

---

### 2. ProblemSection-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] --(auto after 120ms, 700ms, ease-in)--> [3]
[3] --(auto after 120ms, 700ms, ease-in)--> [4]
[4] --(auto after 120ms, 700ms, ease-in)--> [5]
[5] -- holds here
```
4-step rapid-fire reveal sequence using the 120ms step delay.

---

### 3. ComparisonSection-animation
```
[Default] --(hover, 700ms, ease-in)--> [State 2]
[State 2] -- holds here
```
Simple one-step reveal.

---

### 4. HowItWorks-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] --(auto after 120ms, 700ms, ease-in)--> [3]
[3] --(auto after 120ms, 700ms, ease-in)--> [4]
[4] --(auto after 120ms, 700ms, ease-in)--> [5]
[5] -- holds here
```
Same structure as ProblemSection — 4-step, 120ms step delay.

---

### 5. clients-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] -- holds here
```
Simple one-step reveal.

---

### 6. PricingSectionanimation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] -- holds here
```
Simple one-step reveal.

---

### 7. FeatureGrid-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] --(auto after 300ms, 700ms, ease-in)--> [3]
[3] --(auto after 300ms, 700ms, ease-in)--> [4]
[4] -- holds here
```
3-step reveal using the slower 300ms step delay.

---

### 8. SocialProof-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] -- holds here
```
Simple one-step reveal.

---

## How It Works Page Components

### 9. HIW-hero-animation
```
[1] --(hover, 700ms, ease-in)--> [Variant 2]
[Variant 2] --(auto after 300ms, 700ms, ease-in)--> [Variant 3]
[Variant 3] -- holds here
```
2-step reveal, 300ms step delay. Mirrors landing hero structure but uses ease-in.

---

### 10. HIW-HowItWorks-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] --(auto after 120ms, 700ms, ease-in)--> [3]
[3] --(auto after 120ms, 700ms, ease-in)--> [4]
[4] --(auto after 120ms, 700ms, ease-in)--> [5]
[5] -- holds here
```
4-step rapid reveal, 120ms step delay. Same pattern as landing ProblemSection/HowItWorks.

---

### 11. HIW-Onboarding-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] --(auto after 300ms, 700ms, ease-in)--> [3]
[3] --(auto after 300ms, 700ms, ease-in)--> [4]
[4] --(auto after 300ms, 700ms, ease-in)--> [5]
[5] -- holds here
```
4-step reveal, slower 300ms step delay.

---

### 12. HIW-FinalCTA-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] -- holds here
```
Simple one-step reveal.

---

### 13. HIW-SixWeek-animation
```
[1] --(hover, 700ms, ease-in)--> [2]
[2] --(auto after 300ms, 700ms, ease-in)--> [3]
[3] --(auto after 300ms, 700ms, ease-in)--> [4]
[4] --(auto after 300ms, 700ms, ease-in)--> [5]
[5] -- holds here
```
4-step reveal, 300ms step delay. Same pattern as HIW-Onboarding and HIW-SixWeek.

---

## Quick Pattern Reference

| Pattern | Step delay | Components |
|---------|-----------|------------|
| Simple (1-step) | — | ComparisonSection, clients, PricingSection, SocialProof, HIW-FinalCTA |
| Rapid sequence (4-step) | 120ms | ProblemSection, HowItWorks, HIW-HowItWorks |
| Staged sequence (2–4 step) | 300ms | hero, FeatureGrid, HIW-hero, HIW-Onboarding, HIW-SixWeek |
