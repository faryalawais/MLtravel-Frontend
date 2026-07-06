#!/usr/bin/env bash
# Publish CP-002 slices to GitHub after: gh auth login
# Run from repo root: bash features/CP-002/tickets/publish-issues.sh

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

# #13 — Hero
cat > "$TMP/13.md" <<'EOF'
## Parent

CP-002 — Contact Us (`docs/features/CP-002/brief.md`)

## What to build

Figma-matched contact hero on `/contact`: headline and subhead from frame `5185:4332`. `component.contact.hero`. Desktop 1440px pixel match; mobile fluid. Tokens only.

## Acceptance criteria

- [ ] `component.contact.hero` shows Figma headline and subhead at 1440px
- [ ] Hero visible in fluid mobile layout at 393px
- [ ] `screen.contact.page` present; token lint passes

## Blocked by

- LP-001 #3 Navbar, LP-001 #12 Footer
EOF
echo "Creating #13 (hero)..."
ISSUE13=$(create_issue "CP-002-FE · Contact hero — headline and subhead" "$TMP/13.md")
echo "$ISSUE13"

# #14 — Calendly embed (blocked by #13 — add comment after)
cat > "$TMP/14.md" <<'EOF'
## Parent

CP-002 — Contact Us

## What to build

Calendly embed on `/contact`: native iframe from `NEXT_PUBLIC_CALENDLY_URL`; skeleton until load; fallback on error/unset URL. `component.contact.embed` + skeleton + fallback. No react-calendly.

## Acceptance criteria

- [ ] Iframe loads from env URL; skeleton → loaded transition
- [ ] Fallback on unset URL or load failure
- [ ] No custom calendar UI outside iframe

## Blocked by

- #13
EOF
echo "Creating #14 (embed)..."
ISSUE14=$(create_issue "CP-002-FE · Calendly embed — iframe, skeleton, error fallback" "$TMP/14.md")
echo "$ISSUE14"

# #15 — Email fallback
cat > "$TMP/15.md" <<'EOF'
## Parent

CP-002 — Contact Us

## What to build

Email fallback below embed: "Not ready to book a slot?" + body copy + mailto CTA from `NEXT_PUBLIC_CONTACT_EMAIL`. `component.contact.fallback`.

## Acceptance criteria

- [ ] Figma copy for heading and body
- [ ] mailto: uses env email; keyboard accessible

## Blocked by

- #14
EOF
echo "Creating #15 (fallback)..."
ISSUE15=$(create_issue "CP-002-FE · Email fallback — Not ready to book a slot?" "$TMP/15.md")
echo "$ISSUE15"

echo ""
echo "Done. Update features/CP-002/tickets/issues.md with issue numbers from output above."
