import { describe, expect, it } from 'vitest'

import {
  parseChangesetFile,
  renderReleaseNotes,
} from '../build-release-notes'

describe('build-release-notes', () => {
  it('parses a changeset and groups release notes by package', () => {
    const changesets = [
      parseChangesetFile(
        'alpha.md',
        `---
"@lsh/hooks": minor
"@lsh/shared": patch
---

新增 hooks 能力，并补充 shared 辅助方法。
`,
      ),
      parseChangesetFile(
        'beta.md',
        `---
"@lsh/hooks": patch
---

修复 hooks 边界场景。
`,
      ),
    ]

    const releaseNotes = renderReleaseNotes('web-admin-kit', changesets)

    expect(releaseNotes).toContain('# Web Admin Kit Release')
    expect(releaseNotes).toContain('### `@lsh/hooks`')
    expect(releaseNotes).toContain('- `minor`: 新增 hooks 能力，并补充 shared 辅助方法。')
    expect(releaseNotes).toContain('- `patch`: 修复 hooks 边界场景。')
    expect(releaseNotes).toContain('### `@lsh/shared`')
  })
})
