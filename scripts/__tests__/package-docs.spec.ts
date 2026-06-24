import { describe, expect, it } from 'vitest'

import packageDocsLoader from '../../.vitepress/package-docs.data'
import { listPackageDocs } from '../../.vitepress/package-docs'

describe('package docs data', () => {
  it('从各包 package.json 读取版本号', () => {
    const packageDocs = listPackageDocs()

    expect(packageDocs.length).toBeGreaterThan(0)

    for (const pkg of packageDocs) {
      expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(?:[-+].+)?$/)
    }
  })

  it('首页包卡片数据包含版本号', async () => {
    const packageDocs = await packageDocsLoader.load([])

    expect(packageDocs.length).toBeGreaterThan(0)

    for (const pkg of packageDocs) {
      expect(pkg.version).toMatch(/^\d+\.\d+\.\d+(?:[-+].+)?$/)
    }
  })
})
