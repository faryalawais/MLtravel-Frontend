# CLAUDE.md — MLtravel Frontend

## What this repo is
Frontend-only Next.js repo for MLtravel. No API routes, no database, no server logic here.
UI spec comes from Figma; data contracts come from MLtravel-Backend (consumed via HTTP client).

## Skills
Sync from sldc-skills:
```bash
cd ../sldc-skills && ./scripts/sync.sh ../MLtravel-Frontend
```

## FE flow
See `docs/feature-pipeline-quickref.md` for the full pipeline.

```
/figma-extract → /design-tokens → /ui-registry-build → /registry-validate → /design-contract → /fe-implement
```

## Figma setup
Desktop MCP: `.cursor/mcp.json` + Figma Desktop Dev Mode MCP on port 3845.
REST token: `.env` (`FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`). Verify: `npm run figma:check`.
Scripts: `figma:extract:rest`, `figma:export-image`. Full guide: `docs/figma-setup.md`.

Design file: `h6BqI1ZRMSJxR7jESNF0Ep` — [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?p=f&m=dev) (per-page frame links live in each feature brief)

## Tech stack
- Next.js App Router, TypeScript, Tailwind CSS
- Stack manifest: `.claude/stack.yaml` (`stack: nextjs`, frontend only)

## Hard rules
1. No raw hex colours or px values — use design tokens
2. No `app/api/`, no ORM, no DB — backend is MLtravel-Backend
3. No `any`, no `@ts-ignore`, no skipped tests
