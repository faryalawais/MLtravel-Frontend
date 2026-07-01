#!/usr/bin/env node
/**
 * Verify Figma REST credentials (.env).
 *
 * Usage: npm run figma:check
 */

const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!TOKEN) {
  console.error("ERROR: FIGMA_ACCESS_TOKEN is not set. Copy .env.example → .env");
  process.exit(1);
}

if (!FILE_KEY) {
  console.error("ERROR: FIGMA_FILE_KEY is not set.");
  process.exit(1);
}

const headers = { "X-Figma-Token": TOKEN };

try {
  const meRes = await fetch("https://api.figma.com/v1/me", { headers });
  if (!meRes.ok) {
    console.error(`ERROR: Token invalid (${meRes.status})`);
    process.exit(1);
  }
  const me = await meRes.json();
  console.log(`✓ Token valid — ${me.email ?? me.handle ?? "authenticated"}`);

  const fileRes = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}?depth=1`, { headers });
  if (fileRes.status === 403) {
    console.error("ERROR: Token lacks File content: Read-only scope.");
    process.exit(1);
  }
  if (!fileRes.ok) {
    console.error(`ERROR: File fetch failed (${fileRes.status})`);
    process.exit(1);
  }
  const file = await fileRes.json();
  console.log(`✓ File access — "${file.name}" (${FILE_KEY})`);
  console.log("\nREST API ready. Example:");
  console.log("  npm run figma:extract:rest -- --feature <id> --frame <node-id>");
  console.log("  npm run figma:export-image -- --feature <id>");
} catch (err) {
  console.error("ERROR:", err.message);
  process.exit(1);
}
