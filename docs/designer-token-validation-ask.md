# Token fixes — designer

**Figma:** [ML Travel Project (faryal)](https://www.figma.com/design/h6BqI1ZRMSJxR7jESNF0Ep/ML-Travel-Project--faryal-updated-?p=f&m=dev)  
**Re-upload:** `primitives.json`, `semantics.json`, `typography.json`

---

## Important — remove Claude-made tokens

Parts of the current files were **auto-filled by Claude** (not from Figma Variables). **Delete those and replace with a clean Token Press / Tokens Studio DTCG export.**

Look for `"source"` values like:

- `claude-generated-alias`
- `claude-generated-alias-needs-design-confirm`
- `claude-derived-from-figma-style-name`
- `figma-variables` (hex dump — not DTCG)

**Also remove** `$description` notes that say *"Claude's best-guess mapping"* or *"VERIFY with design"*.

| Area | Action |
|------|--------|
| `color.surface.*` | Re-export from Figma — was Claude alias layer |
| `color.action.*` focused / disabled slots | Re-export from Figma variables (not guessed) |
| `color.focus.*` | Define in Figma or alias from real variables |
| `space.*` scale | Re-export from Figma spacing variables |
| `font.weight.*` (4 tokens) | Re-export from Figma — was Claude-derived |

**Rule:** Every token must come from **Figma Variables** → **DTCG JSON** export. No hand-typed or AI-filled values.

---

## 1. Every leaf — metadata

```json
"$extensions": {
  "layer": "primitive",
  "source": "figma"
}
```

- `primitives.json` → `"layer": "primitive"`
- `semantics.json` + `typography.json` → `"layer": "semantic"`
- `"source"`: **`"figma"`** or **`"tokens-studio"`** only — remove all `claude-*` and `figma-variables`

---

## 2. Colors — DTCG srgb (not hex)

**Wrong:** `"$value": "#f97316"`

**Right:**

```json
"$type": "color",
"$value": {
  "colorSpace": "srgb",
  "components": [0.9765, 0.451, 0.0863],
  "alpha": 1
},
"$extensions": {
  "layer": "primitive",
  "source": "figma"
}
```

---

## 3. Invalid type `font.style.*` (5 tokens) 

Delete from `primitives.json` (invalid `$type: "string"`):

- `font.style.bold`, `.medium`, `.medium-italic`, `.regular`, `.semi-bold`

Typography already uses `font.weight.*` — no replacement needed.

---

## No need — skip (dev handles in code)

| Token group | Note |
|-------------|------|
| `color.action.tertiary.*` | **No need** — no tertiary/outline buttons on site |
| `color.action.danger.*` | **No need** — no destructive buttons on site |
| `color.input.*` | **No need** — Contact uses Calendly |
| `color.feedback.*` | **No need** — no toast/banner UI in v1 |

Do **not** create Figma variables for these. Engineering adds pipeline placeholders after your re-upload.
