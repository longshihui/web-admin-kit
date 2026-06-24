import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const packagesDir = join(rootDir, 'packages')

function listPackageScopes() {
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const packageDir = join(packagesDir, entry.name)
      const packageJsonPath = join(packageDir, 'package.json')
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

      return {
        value: entry.name,
        name: `${entry.name}: ${packageJson.name} 包`,
      }
    })
    .sort((left, right) => left.value.localeCompare(right.value))
}

const packageScopes = listPackageScopes()

export default {
  subjectLimit: 72,
  allowBreakingChanges: ['feat', 'fix', 'refactor'],
  allowCustomScopes: true,
  messages: {
    type: '请选择本次提交的变更类型：',
    scope: '请选择本次提交的作用范围：',
    customScope: '请输入自定义作用范围：',
    subject: '请填写简短的祈使句摘要：\n',
    body: '请填写更详细的描述（可选）。使用 "|" 表示换行：\n',
    breaking: '请填写破坏性变更说明（可选）。使用 "|" 表示换行：\n',
    footerPrefixesSelect: '请选择 issue 前缀（可选）：',
    customFooterPrefix: '请输入自定义 issue 前缀：',
    footer: '请填写本次关闭的 issue（可选），例如：#123\n',
    confirmCommit: '是否确认提交？'
  },
  types: [
    { value: 'feat', name: 'feat:     新增功能' },
    { value: 'fix', name: 'fix:      修复缺陷' },
    { value: 'docs', name: 'docs:     仅更新文档' },
    { value: 'style', name: 'style:    仅调整格式或样式' },
    { value: 'refactor', name: 'refactor: 在不改变行为的前提下重构代码' },
    { value: 'perf', name: 'perf:     优化性能' },
    { value: 'test', name: 'test:     新增或更新测试' },
    { value: 'build', name: 'build:    修改构建工具或依赖' },
    { value: 'ci', name: 'ci:       修改 CI 配置' },
    { value: 'chore', name: 'chore:    日常维护类改动' },
    { value: 'revert', name: 'revert:   回滚之前的提交' }
  ],
  scopes: [
    { value: 'repo', name: 'repo: 整个 workspace 范围改动' },
    ...packageScopes,
    { value: 'docs', name: 'docs: 文档站点或包文档' },
    { value: 'release', name: 'release: 发布与变更日志流程' },
    { value: 'deps', name: 'deps: 依赖更新' },
    { value: 'ci', name: 'ci: 自动化与流水线配置' }
  ]
}
