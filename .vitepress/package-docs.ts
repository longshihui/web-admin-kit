import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type PackageDocConfigPage = {
  file: string
  title: string
}

export type PackageDocConfig = {
  summary: string
  pages: PackageDocConfigPage[]
}

export type PackageDocPage = {
  relativePath: string
  routePath: string
  title: string
}

export type PackageDoc = {
  dirName: string
  displayName: string
  description: string
  summary: string
  routeSegment: string
  pages: PackageDocPage[]
}

const rootDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const packagesDir = path.join(rootDir, 'packages')
const packageDocConfigFileName = 'config.json'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readJson(filePath: string): Record<string, unknown> {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(content) as unknown
    return isRecord(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function readMarkdownTitle(filePath: string, fallback: string): string {
  const content = fs.readFileSync(filePath, 'utf8')
  const title = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  return title || fallback
}

function walkMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      return walkMarkdownFiles(entryPath)
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : []
  })
}

function isDocEntry(relativePath: string): boolean {
  return relativePath === 'README.md' || relativePath === 'index.md'
}

function routeFromMarkdownPath(routeSegment: string, relativePath: string): string {
  const withoutExt = relativePath.replace(/\.md$/, '')

  if (withoutExt === 'README' || withoutExt === 'index') {
    return `/packages/${routeSegment}/`
  }

  return `/packages/${routeSegment}/${withoutExt}`
}

function packageRouteSegment(packageName: string, dirName: string): string {
  return packageName.startsWith('@lsh/') ? packageName.slice('@lsh/'.length) : dirName
}

function readPackageDocConfig(docsDir: string): PackageDocConfig | null {
  const configPath = path.join(docsDir, packageDocConfigFileName)
  const rawConfig = readJson(configPath)
  const pages = rawConfig.pages

  if (!Array.isArray(pages)) {
    return null
  }

  const normalizedPages = pages.flatMap((page): PackageDocConfigPage[] => {
    if (!isRecord(page)) {
      return []
    }

    const file = typeof page.file === 'string' ? page.file.trim().split(path.sep).join('/') : ''
    const title = typeof page.title === 'string' ? page.title.trim() : ''

    if (!file || !file.endsWith('.md') || !title) {
      return []
    }

    return [{ file, title }]
  })

  if (normalizedPages.length === 0) {
    return null
  }

  return {
    summary: typeof rawConfig.summary === 'string' ? rawConfig.summary.trim() : '',
    pages: normalizedPages
  }
}

function listConfiguredPages(
  docsDir: string,
  routeSegment: string,
  config: PackageDocConfig
): PackageDocPage[] {
  return config.pages.flatMap((page): PackageDocPage[] => {
    const filePath = path.join(docsDir, page.file)

    if (!fs.existsSync(filePath)) {
      return []
    }

    return [
      {
        relativePath: page.file,
        routePath: routeFromMarkdownPath(routeSegment, page.file),
        title: page.title
      }
    ]
  })
}

function listDiscoveredPages(docsDir: string, routeSegment: string): PackageDocPage[] {
  return walkMarkdownFiles(docsDir)
    .map((filePath) => {
      const relativePath = path.relative(docsDir, filePath).split(path.sep).join('/')
      const fallbackTitle = path.basename(relativePath, '.md')

      return {
        relativePath,
        routePath: routeFromMarkdownPath(routeSegment, relativePath),
        title: readMarkdownTitle(filePath, fallbackTitle)
      }
    })
    .sort((a, b) => {
      if (isDocEntry(a.relativePath)) return -1
      if (isDocEntry(b.relativePath)) return 1
      return a.relativePath.localeCompare(b.relativePath)
    })
}

export function listPackageDocs(): PackageDoc[] {
  if (!fs.existsSync(packagesDir)) return []

  return fs.readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packageDir = path.join(packagesDir, entry.name)
      const packageJson = readJson(path.join(packageDir, 'package.json'))
      const packageName = typeof packageJson.name === 'string' ? packageJson.name : entry.name
      const routeSegment = packageRouteSegment(packageName, entry.name)
      const docsDir = path.join(packageDir, 'docs')
      const packageDocConfig = readPackageDocConfig(docsDir)
      const pages = packageDocConfig
        ? listConfiguredPages(docsDir, routeSegment, packageDocConfig)
        : listDiscoveredPages(docsDir, routeSegment)

      return {
        dirName: entry.name,
        displayName: packageName,
        description: typeof packageJson.description === 'string' ? packageJson.description : '',
        summary: packageDocConfig?.summary || '',
        routeSegment,
        pages
      }
    })
    .filter((pkg) => pkg.pages.length > 0)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}
