import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

interface PackageMeta {
  dirName: string;
  packageName: string;
}

interface CzOption {
  value: string;
  name: string;
}

interface CzConfig {
  scopes: CzOption[];
}

const rootDir = join(import.meta.dirname, "..", "..");
const packagesDir = join(rootDir, "packages");
const fixedScopeValues = ["repo", "docs", "release", "deps", "ci"];

async function loadCzConfig(): Promise<CzConfig> {
  const modulePath = new URL("../../cz.config.mjs", import.meta.url).href;
  const configModule = (await import(modulePath)) as { default: CzConfig };

  return configModule.default;
}

function listWorkspacePackages(): PackageMeta[] {
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packageJsonPath = join(packagesDir, entry.name, "package.json");
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
        name: string;
      };

      return {
        dirName: entry.name,
        packageName: packageJson.name,
      };
    })
    .sort((left, right) => left.dirName.localeCompare(right.dirName));
}

describe("cz config", () => {
  it("scope 列表覆盖当前所有 workspace 包并移除过期包名", async () => {
    const config = await loadCzConfig();
    const packages = listWorkspacePackages();
    const expectedScopeValues = [
      fixedScopeValues[0],
      ...packages.map((pkg) => pkg.dirName),
      ...fixedScopeValues.slice(1),
    ];

    expect(config.scopes.map((scope) => scope.value)).toEqual(
      expectedScopeValues,
    );
  });

  it("包级 scope 文案展示真实包名", async () => {
    const config = await loadCzConfig();
    const packages = listWorkspacePackages();
    const scopeMap = new Map(
      config.scopes.map((scope) => [scope.value, scope.name]),
    );

    for (const pkg of packages) {
      expect(scopeMap.get(pkg.dirName)).toBe(
        `${pkg.dirName}: ${pkg.packageName} 包`,
      );
    }
  });
});
