import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

const PORT = process.env.PORT ?? '3000';
const baseURL = `http://localhost:${PORT}`;

const bddTestDir = defineBddConfig({
  features: 'features/CP-002/*.feature',
  steps: 'tests/steps/**/*.ts',
  outputDir: 'features-gen',
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'e2e', testMatch: /e2e\/.*\.spec\.ts/ },
    {
      name: 'visual',
      testMatch: /visual\/.*\.spec\.ts/,
      snapshotPathTemplate: '{testDir}/visual/__screenshots__/{testFilePath}/{arg}{ext}',
      fullyParallel: false,
    },
    {
      name: 'bdd',
      testDir: bddTestDir,
      testMatch: /.*\.spec\.(js|ts)/,
      grep: /@fe/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      NEXT_PUBLIC_E2E_MODE: '1',
    },
  },
});
