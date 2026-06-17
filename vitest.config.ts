import { defineConfig } from 'vitest/config'

import {
  workspaceCoverageExclude,
  workspaceCoverageInclude,
  workspaceTestInclude,
} from './vitest.shared'

export default defineConfig({
  test: {
    environment: 'node',
    include: workspaceTestInclude,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: workspaceCoverageInclude,
      exclude: workspaceCoverageExclude,
    },
  },
})
