#!/usr/bin/env node
/**
 * Post-extract validation orchestrator (used by token-validate skill).
 * Skips entirely when active token files are empty {}.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { isEmptyPlaceholder, loadActiveFiles } from "./lib/token-files.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const testMode = process.argv.includes("--test");

const loaded = loadActiveFiles();
if (isEmptyPlaceholder(loaded) && !process.argv.includes("--force")) {
  console.log("SKIP: tokens:validate — no tokens yet; run figma-extract tokens mode first.");
  process.exit(0);
}

function run(script, extraArgs = []) {
  const r = spawnSync(process.execPath, [join(__dirname, script), ...extraArgs], {
    cwd: ROOT,
    stdio: "inherit",
  });
  return r.status ?? 1;
}

if (testMode) {
  process.exit(run("validate-tokens-dtcg.mjs", ["--test"]));
}

let code = run("validate-token-source.mjs");
if (code !== 0) process.exit(code);
code = run("validate-tokens-dtcg.mjs");
process.exit(code);
