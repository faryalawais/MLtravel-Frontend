#!/usr/bin/env bash
# Publish HIW-003 slices to GitHub after: gh auth login
# Run from repo root: bash features/HIW-003/tickets/publish-issues.sh

set -euo pipefail
REPO="faryalawais/MLtravel-Frontend"
LABEL="${TRIAGE_LABEL:-enhancement}"

create_issue() {
  local title="$1"
  local body_file="$2"
  gh issue create --repo "$REPO" --title "$title" --body-file "$body_file" --label "$LABEL"
}

DIR="$(cd "$(dirname "$0")" && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cat > "$TMP/17.md" <<'EOF'
## Parent

HIW-003 — How It Works (`docs/features/HIW-003/brief.md`)

## What to build

HIW page hero on `/how-it-works` covering Figma **desktop** `HIWHeroSection` (`5217:6699`) and **mobile** hero+stats top (`5217:7073` / `5217:7074`).

- **Desktop:** net-new `component.how-it-works.hero` — headline, subhead, primary CTA via reused `HeroPrimaryCta` → `/contact`
- **Mobile:** reuse `HeroSection` variant from LP-001 (`5164:7080` family) — single primary CTA, 4-tile stats grid (`$3,000/mo`, `40%`, `6 Weeks`, `500+`); **omit** product panel and logos strip per Figma
- Extract motion from Figma dev-mode for desktop hero; mobile inherits LP-001 hero motion where nodes match
- `figma-extract` → reuse audit → `design-contract` → `fe-implement`

## Acceptance criteria

- [ ] Desktop `5217:6699` copy, spacing, and CTA match Figma at 1440px
- [ ] Mobile `5217:7073` headline, single CTA, and stats grid match Figma at 393px
- [ ] `HeroPrimaryCta` navigates to `/contact`
- [ ] `screen.how-it-works.page` test id present
- [ ] Section motion per Figma / motion fixture (desktop); LP-001 hero motion passes on mobile variant
- [ ] Token lint passes; visual baseline for hero regions

## Blocked by

- LP-001 #3 Navbar, LP-001 #4 Hero, LP-001 #12 Footer
EOF

cat > "$TMP/18.md" <<'EOF'
## Parent

HIW-003 — How It Works

## What to build

Compose LP-001 `HowItWorksTeaserSection` on `/how-it-works` — full Figma coverage of three-step block:

- Desktop: `5217:6700` (reference) = LP-001 `5164:6567`
- Mobile: `5217:6717` subtree = LP-001 `5164:6690`
- Hide teaser footer link to `/how-it-works` when already on that route
- Retain LP-001 card cascade hover motion (`component.landing.howItWorksTeaser.motion.*`)

## Acceptance criteria

- [ ] Three step cards, header pill, and copy match Figma desktop + mobile
- [ ] Hover motion matches landing (`hiw-motion.spec.ts` patterns)
- [ ] No footer "learn more" link on `/how-it-works`
- [ ] Visual baselines vs `5164:6567` / `5164:6690`

## Blocked by

- #17
- LP-001 #7 How-it-works teaser
EOF

cat > "$TMP/19.md" <<'EOF'
## Parent

HIW-003 — How It Works

## What to build

Mid-page demo CTA band `S4-MidCTA` (`5217:6701`) — desktop only unless mobile frame adds it:

- Copy: *"Seen enough? Let's show you a live demo."*
- Primary button via `HeroPrimaryCta` → `/contact`
- `component.how-it-works.midCta`
- Figma motion for band entrance (extract via `figma-extract`)

## Acceptance criteria

- [ ] Desktop `5217:6701` layout and copy match Figma at 1440px
- [ ] CTA → `/contact`
- [ ] **Not rendered on mobile** if absent from `5217:6715` (per PRD v2)
- [ ] Motion spec + Playwright test for mid CTA
- [ ] Token lint passes

## Blocked by

- #18
EOF

cat > "$TMP/20.md" <<'EOF'
## Parent

HIW-003 — How It Works

## What to build

Six-week onboarding timeline — Figma `SixWeekSection`:

- Desktop: `5217:6705` (Week 1, 2–3, 4–5, 6 cards + section header pill *"6-week Onboarding"*)
- Mobile: `5217:6812` (vertical timeline with progress line)
- `component.how-it-works.sixWeek` (+ `.mobile`)
- Section scroll/progress motion per Figma dev-mode

## Acceptance criteria

- [ ] All 4 week cards + header match Figma desktop `5217:6705`
- [ ] Mobile timeline `5217:6812` matches Figma at 393px
- [ ] Motion fixture + Playwright spec for timeline animation
- [ ] Visual baselines desktop + mobile for six-week section

## Blocked by

- #19
EOF

cat > "$TMP/21.md" <<'EOF'
## Parent

HIW-003 — How It Works

## What to build

Mobile-only testimonial block (`5217:6867` / `test` frame):

- **Reuse** `SocialProofSection` testimonial card — Moazam Arshad quote + attribution from `landing.constants`
- Render **only below `md`** — not in DOM at 1440px
- No duplicate testimonial component

## Acceptance criteria

- [ ] Mobile `5217:6867` quote and attribution match Figma at 393px
- [ ] Component reuses `component.landing.socialProof` testimonial paths
- [ ] Absent from DOM at desktop 1440px
- [ ] Visual baseline mobile testimonial region

## Blocked by

- #20
- LP-001 #9 Social proof
EOF

cat > "$TMP/22.md" <<'EOF'
## Parent

HIW-003 — How It Works

## What to build

Mobile-only benefits stats row (`5217:6883` / `stat` frame) — **distinct from** hero `$3,000/mo` grid:

- Four benefit tiles: *Zero booking fees*, *Full white-label*, *Multi-GDS search*, (+ fourth per Figma)
- `component.how-it-works.benefitsStats`
- Mobile only (`5217:6715`); not rendered desktop

## Acceptance criteria

- [ ] All 4 benefit tiles match Figma `5217:6883` at 393px
- [ ] Icons, labels, and subcopy from `constants/how-it-works.constants.ts`
- [ ] Absent from DOM at desktop 1440px
- [ ] Visual baseline mobile benefits row

## Blocked by

- #21
EOF

cat > "$TMP/23.md" <<'EOF'
## Parent

HIW-003 — How It Works

## What to build

Final demo CTA section:

- Desktop: `FinalCTASection` `5217:7555`
- Mobile: `5217:7583`
- Closing headline + subcopy + `HeroPrimaryCta` → `/contact`
- `component.how-it-works.finalCta`
- Section motion per Figma

## Acceptance criteria

- [ ] Desktop `5217:7555` and mobile `5217:7583` copy/layout match Figma
- [ ] CTA → `/contact`
- [ ] Motion spec + Playwright test
- [ ] Visual baselines desktop + mobile final CTA

## Blocked by

- #22
EOF

cat > "$TMP/24.md" <<'EOF'
## Parent

HIW-003 — How It Works

## What to build

FAQ section — full Figma coverage:

- Desktop: `FAQSection` `5261:8072`
- Mobile: `5261:8150`
- Category tabs (filter question groups client-side)
- Single-open accordion; first question in default tab open on load
- All Q&A copy from Figma constants
- `component.how-it-works.faq`
- Tab/expand motion per Figma dev-mode

**Page completeness:** after this slice, full page visual regression vs `HIW-Desktop` (`5217:6697`) @ 1440px and `HIW-Mobile` (`5217:6715`) @ 393px.

## Acceptance criteria

- [ ] Tab labels and all FAQ copy match Figma desktop + mobile
- [ ] Tab switch filters visible questions
- [ ] Accordion: one open at a time; keyboard accessible
- [ ] Motion spec + Playwright for FAQ interactions
- [ ] Full-page visual sign-off: every region in `5217:6697` and `5217:6715` covered by slices #17–#24
- [ ] Navbar/Footer via layout (LP-001) — not duplicated in HIW slices

## Blocked by

- #23
EOF

echo "Creating #17 (hero)..."
ISSUE17=$(create_issue "HIW-003-FE · Hero — desktop wrapper + mobile reuse variant" "$TMP/17.md")
echo "$ISSUE17"

echo "Creating #18 (three-step)..."
ISSUE18=$(create_issue "HIW-003-FE · Three-step section — compose landing teaser" "$TMP/18.md")
echo "$ISSUE18"

echo "Creating #19 (mid CTA)..."
ISSUE19=$(create_issue "HIW-003-FE · Mid CTA — Seen enough? live demo" "$TMP/19.md")
echo "$ISSUE19"

echo "Creating #20 (six-week)..."
ISSUE20=$(create_issue "HIW-003-FE · Six-week onboarding timeline" "$TMP/20.md")
echo "$ISSUE20"

echo "Creating #21 (testimonial)..."
ISSUE21=$(create_issue "HIW-003-FE · Mobile testimonial — reuse social proof card" "$TMP/21.md")
echo "$ISSUE21"

echo "Creating #22 (benefits stats)..."
ISSUE22=$(create_issue "HIW-003-FE · Mobile benefits stats row" "$TMP/22.md")
echo "$ISSUE22"

echo "Creating #23 (final CTA)..."
ISSUE23=$(create_issue "HIW-003-FE · Final CTA — closing demo prompt" "$TMP/23.md")
echo "$ISSUE23"

echo "Creating #24 (FAQ)..."
ISSUE24=$(create_issue "HIW-003-FE · FAQ — category tabs + accordion" "$TMP/24.md")
echo "$ISSUE24"

echo ""
echo "Done. Issues #17–#24 published for HIW-003."
