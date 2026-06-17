import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export type ReleaseLevel = 'major' | 'minor' | 'patch'

export interface ChangesetRelease {
  name: string
  type: ReleaseLevel
}

export interface ParsedChangeset {
  fileName: string
  summary: string
  releases: ChangesetRelease[]
}

interface PackageReleaseNote {
  fileName: string
  summary: string
  type: ReleaseLevel
}

const RELEASE_LEVEL_WEIGHT: Record<ReleaseLevel, number> = {
  major: 0,
  minor: 1,
  patch: 2,
}

const rootDir = fileURLToPath(new URL('../../', import.meta.url))
const changesetDir = path.join(rootDir, '.changeset')
const releaseNotesFile = path.join(rootDir, '.git', '.release-notes.md')

function normalizeSummary(summary: string): string {
  return summary
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
}

function parseReleaseLine(line: string, fileName: string): ChangesetRelease {
  const match = line.match(/^"?(?<name>[^"]+)"?\s*:\s*(?<type>major|minor|patch)\s*$/)

  if (match?.groups == null) {
    throw new Error(`Invalid release line in ${fileName}: ${line}`)
  }

  const { name, type } = match.groups

  return {
    name: name.trim(),
    type: type as ReleaseLevel,
  }
}

export function parseChangesetFile(fileName: string, source: string): ParsedChangeset {
  const normalizedSource = source.replace(/\r\n/g, '\n').trim()
  const match = normalizedSource.match(/^---\n(?<frontmatter>[\s\S]*?)\n---\n(?<summary>[\s\S]+)$/)

  if (match?.groups == null) {
    throw new Error(`Invalid changeset format in ${fileName}`)
  }

  const releases = match.groups.frontmatter
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => parseReleaseLine(line, fileName))

  if (releases.length === 0) {
    throw new Error(`No package releases found in ${fileName}`)
  }

  const summary = normalizeSummary(match.groups.summary)

  if (summary.length === 0) {
    throw new Error(`Missing summary in ${fileName}`)
  }

  return {
    fileName,
    summary,
    releases,
  }
}

function formatRepositoryName(packageName: string): string {
  return packageName
    .split('/')
    .at(-1)
    ?.split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ') ?? 'Repository'
}

export function renderReleaseNotes(packageName: string, changesets: ParsedChangeset[]): string {
  const packageReleaseMap = new Map<string, PackageReleaseNote[]>()

  for (const changeset of changesets) {
    for (const release of changeset.releases) {
      const notes = packageReleaseMap.get(release.name) ?? []

      notes.push({
        fileName: changeset.fileName,
        summary: changeset.summary,
        type: release.type,
      })
      packageReleaseMap.set(release.name, notes)
    }
  }

  const releaseLines = [
    `# ${formatRepositoryName(packageName)} Release`,
    '',
    '## Packages',
    '',
  ]

  const packageNames = [...packageReleaseMap.keys()].sort((left, right) => left.localeCompare(right))

  for (const packageNameEntry of packageNames) {
    releaseLines.push(`### \`${packageNameEntry}\``)
    releaseLines.push('')

    const notes = packageReleaseMap.get(packageNameEntry) ?? []

    notes
      .sort((left, right) => {
        const typeDiff = RELEASE_LEVEL_WEIGHT[left.type] - RELEASE_LEVEL_WEIGHT[right.type]

        if (typeDiff !== 0) {
          return typeDiff
        }

        return left.fileName.localeCompare(right.fileName)
      })
      .forEach((note) => {
        releaseLines.push(`- \`${note.type}\`: ${note.summary}`)
      })

    releaseLines.push('')
  }

  releaseLines.push('## Notes')
  releaseLines.push('')
  releaseLines.push('- Detailed package changelogs are generated into each package directory during `changeset version`.')

  return releaseLines.join('\n')
}

async function readPackageName(): Promise<string> {
  const packageJsonPath = path.join(rootDir, 'package.json')
  const packageJsonRaw = await readFile(packageJsonPath, 'utf8')
  const packageJson = JSON.parse(packageJsonRaw) as { name?: string }

  return packageJson.name ?? 'repository'
}

async function readPendingChangesets(): Promise<ParsedChangeset[]> {
  const entries = await readdir(changesetDir, { withFileTypes: true })
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith('.md') && fileName !== 'README.md')
    .sort((left, right) => left.localeCompare(right))

  const changesets = await Promise.all(
    files.map(async (fileName) => {
      const filePath = path.join(changesetDir, fileName)
      const source = await readFile(filePath, 'utf8')

      return parseChangesetFile(fileName, source)
    }),
  )

  if (changesets.length === 0) {
    throw new Error('No pending changesets found in .changeset directory.')
  }

  return changesets
}

async function main() {
  const packageName = await readPackageName()
  const changesets = await readPendingChangesets()
  const releaseNotes = renderReleaseNotes(packageName, changesets)

  if (process.argv.includes('--stdout')) {
    process.stdout.write(`${releaseNotes}\n`)
    return
  }

  await writeFile(releaseNotesFile, `${releaseNotes}\n`, 'utf8')
  process.stdout.write(`Release notes generated at ${releaseNotesFile}\n`)
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error'

  process.stderr.write(`${message}\n`)
  process.exitCode = 1
})
