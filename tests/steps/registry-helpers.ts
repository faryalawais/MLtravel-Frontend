import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { testIds, type RegistryPath } from '@/tokens/build/test-ids';

const registry = JSON.parse(
  readFileSync(resolve(process.cwd(), 'tokens/ui-registry.json'), 'utf8'),
) as { $metadata: { gherkinAliases?: Record<string, string> } };

const GHERKIN_ALIASES = registry.$metadata.gherkinAliases ?? {};

const SUB_COMPONENT_KEYS: Record<string, string> = {
  'email cta': 'emailCta',
};

export function resolveRegistryPath(gherkinPath: string): RegistryPath {
  const canonical = (GHERKIN_ALIASES[gherkinPath] ?? gherkinPath) as RegistryPath;
  if (!(canonical in testIds)) {
    throw new Error(`Unknown registry path: "${gherkinPath}" (resolved: "${canonical}")`);
  }
  return canonical;
}

export function resolveSubComponentPath(
  baseGherkinPath: string,
  subLabel: string,
): RegistryPath {
  const subKey = SUB_COMPONENT_KEYS[subLabel.toLowerCase()];
  if (!subKey) {
    throw new Error(`Unknown sub-component label: "${subLabel}"`);
  }
  const base = resolveRegistryPath(baseGherkinPath);
  const parent = base.endsWith('.root') ? base.slice(0, -'.root'.length) : base;
  const full = `${parent}.${subKey}` as RegistryPath;
  if (!(full in testIds)) {
    throw new Error(`Unknown sub-component path: "${full}"`);
  }
  return full;
}

export function testIdFor(gherkinPath: string): string {
  return testIds[resolveRegistryPath(gherkinPath)];
}

export function testIdForSub(baseGherkinPath: string, subLabel: string): string {
  return testIds[resolveSubComponentPath(baseGherkinPath, subLabel)];
}
