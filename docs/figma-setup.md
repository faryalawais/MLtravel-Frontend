# Figma setup

This repo connects to Figma through **two channels**:

| Channel | Config | Used for |
|---------|--------|----------|
| **Figma Desktop MCP** | `.cursor/mcp.json` | Cursor agent tools, `/figma-extract` skill |
| **Figma REST API** | `.env` | `figma:extract:rest`, `figma:export-image` |

Screenshots and binary assets **always** go through REST, even when MCP is used for structure.

---

## Quick start (REST — recommended for scripts)

```bash
cp .env.example .env
# Edit .env — token already copied from sdlc-feature-frontend if you set up earlier

npm run figma:check
npm run figma:extract:rest -- --feature <id> --frame <frame-node-id>
npm run figma:export-image -- --feature <id>
```

Outputs land under `features/<id>/figma/`.

---

## REST credentials (`.env`)

```bash
FIGMA_ACCESS_TOKEN=figd_...
FIGMA_FILE_KEY=h6BqI1ZRMSJxR7jESNF0Ep
```

### Create the token

Figma → **Settings → Security → Personal access tokens → Generate new token**.

| Task | Required scope |
|------|----------------|
| `npm run figma:check` | Valid PAT |
| `npm run figma:export-image` | Any valid PAT (image export) |
| `npm run figma:extract:rest` | **File content: Read-only** |
| Token enrichment (later) | Also **`file_variables:read`** |

File key from URL: `https://www.figma.com/design/<FIGMA_FILE_KEY>/...`

---

## Figma Desktop MCP (Cursor)

### Enable in Figma

1. Install **Figma Desktop**.
2. Open: [ML Travel Project (faryal-updated)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?p=f&m=dev) (navigate to the page frame for each feature — see feature briefs)
3. **Dev Mode** → enable **MCP server** (`http://127.0.0.1:3845/mcp`).

### Enable in Cursor

`.cursor/mcp.json` is committed. Confirm **Settings → MCP → `figma-desktop`** is connected.

---

## NPM scripts

| Script | Purpose |
|--------|---------|
| `npm run figma:check` | Verify token + file access |
| `npm run figma:extract:rest` | Pull node tree via REST → `features/<id>/figma/nodes/` |
| `npm run figma:export-image` | PNG screenshots + static assets via REST |

All scripts load `.env` automatically via `node --env-file=.env`.

---

## Which path to use?

| Situation | Setup |
|-----------|--------|
| Agent `/figma-extract` in Cursor | Desktop MCP + `.cursor/mcp.json` |
| Deterministic extract / MCP hangs | `.env` → `figma:extract:rest` |
| Screenshots + icons | `.env` → `figma:export-image` |
| Both MCP + assets | MCP for structure, REST for images |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `FIGMA_ACCESS_TOKEN is not set` | Create `.env` from `.env.example` |
| REST extract 403 | Token needs **File content: Read-only** |
| MCP tools missing | Figma Desktop open, Dev Mode MCP on, reload Cursor MCP |
| `connection refused` on 3845 | Start Figma Desktop MCP server |
| MCP `get_design_context` hangs / times out | **Never** call the full landing frame (`5164:6346`). Use navbar slice-roots only, or sub-chunks in `features/<id>/figma/mcp-chunks.json` (one node per call). Prefer `npm run figma:extract:rest` for bulk cache. |
| Refresh one drifted node | `npm run figma:refresh-node -- --feature LP-001 --refresh-node <nodeId>` |

---

## Related

- `docs/feature-pipeline-quickref.md` — FE skill order
- `.claude/skills/figma-extract/SKILL.md` — extract skill behaviour
