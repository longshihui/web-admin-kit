import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export type PackageDocPage = {
  relativePath: string
  routePath: string
  title: string
}

export type PackageDoc = {
  dirName: string
  displayName: string
  routeSegment: string
  pages: PackageDocPage[]
}

const rootDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const packagesDir = path.join(rootDir, 'packages')

function readJson(filePath: string): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>
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

function routeFromMarkdownPath(routeSegment: string, relativePath: string): string {
  const withoutExt = relativePath.replace(/\.md$/, '')
  if (withoutExt === 'index') return `/packages/${routeSegment}/`
  return `/packages/${routeSegment}/${withoutExt}`
}

function packageRouteSegment(packageName: string, dirName: string): string {
  return packageName.startsWith('@lsh/') ? packageName.slice('@lsh/'.length) : dirName
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

      const pages = walkMarkdownFiles(docsDir)
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
          if (a.relativePath === 'index.md') return -1
          if (b.relativePath === 'index.md') return 1
          return a.relativePath.localeCompare(b.relativePath)
        })

      return {
        dirName: entry.name,
        displayName: packageName,
        routeSegment,
        pages
      }
    })
    .filter((pkg) => pkg.pages.length > 0)
    .sort((a, b) => a.displayName.localeCompare(b.displayName))
}
