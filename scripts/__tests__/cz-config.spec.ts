import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import config from '../../cz.config.mjs'

interface PackageMeta {
  dirName: string
  packageName: string
}

const rootDir = join(import.meta.dirname, '..', '..')
const packagesDir = join(rootDir, 'packages')
const fixedScopeValues = ['repo', 'docs', 'release', 'deps', 'ci']

function listWorkspacePackages(): PackageMeta[] {
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packageJsonPath = join(packagesDir, entry.name, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
        name: string
      }

      return {
        dirName: entry.name,
        packageName: packageJson.name,
      }
    })
    .sort((left, right) => left.dirName.localeCompare(right.dirName))
}

describe('cz config', () => {
  it('scope 列表覆盖当前所有 workspace 包并移除过期包名', () => {
    const packages = listWorkspacePackages()
    const expectedScopeValues = [
      fixedScopeValues[0],
      ...packages.map((pkg) => pkg.dirName),
      ...fixedScopeValues.slice(1),
    ]

    expect(config.scopes.map((scope) => scope.value)).toEqual(expectedScopeValues)
  })

  it('包级 scope 文案展示真实包名', () => {
    const packages = listWorkspacePackages()
    const scopeMap = new Map(config.scopes.map((scope) => [scope.value, scope.name]))

    for (const pkg of packages) {
      expect(scopeMap.get(pkg.dirName)).toBe(`${pkg.dirName}: ${pkg.packageName} 包`)
    }
  })
})
