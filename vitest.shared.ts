import { defineConfig, type UserConfig } from 'vitest/config'

export const packageTestInclude = ['__tests__/**/*.{spec,test}.ts']

export const workspaceTestInclude = [
  'packages/*/__tests__/**/*.{spec,test}.ts',
  'scripts/**/__tests__/**/*.{spec,test}.ts',
]

export const workspaceCoverageInclude = ['packages/*/src/**/*.ts']

export const workspaceCoverageExclude = ['packages/*/__tests__/**']

type TestEnvironment = NonNullable<UserConfig['test']>['environment']

export function definePackageVitestConfig(environment: TestEnvironment) {
  return defineConfig({
    test: {
      environment,
      include: packageTestInclude,
    },
  })
}
