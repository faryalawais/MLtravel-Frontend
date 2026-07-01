# MLtravel Frontend — Guide

## Figma

The **Figma Dev Mode MCP server** must be connected before running `/figma-extract`.

Full setup: [`docs/figma-setup.md`](docs/figma-setup.md)

**Design file:** [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?p=f&m=dev) · file key `h6BqI1ZRMSJxR7jESNF0Ep`

**Quick checklist:**
1. Figma Desktop open → Dev Mode → MCP server enabled (`127.0.0.1:3845`)
2. Cursor → Settings → MCP → `figma-desktop` connected
3. `cp .env.example .env` — REST token + file key (see `docs/figma-setup.md`)
4. `npm run figma:check` — verify REST API access

## Pipeline

See [`docs/feature-pipeline-quickref.md`](docs/feature-pipeline-quickref.md).
