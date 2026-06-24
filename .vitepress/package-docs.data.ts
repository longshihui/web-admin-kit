import { defineLoader } from 'vitepress'
import { listPackageDocs } from './package-docs'

export interface PackageDocData {
  name: string
  link: string
  version: string
  summary: string
  pageCount: number
}

declare const data: PackageDocData[]
export { data }

export default defineLoader({
  watch: ['packages/*/package.json', 'packages/*/docs/config.json', 'packages/*/docs/**/*.md'],
  load(): PackageDocData[] {
    return listPackageDocs().map((pkg) => ({
      name: pkg.displayName,
      link: `/packages/${pkg.routeSegment}/`,
      version: pkg.version,
      summary: pkg.summary || pkg.description,
      pageCount: pkg.pages.length
    }))
  }
})
