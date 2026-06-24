# 贡献手册

本手册说明如何参与 `web-admin-kit` 的开发，包括环境准备、代码修改、测试、文档、changeset 和 Pull Request 流程。日常开发使用短期任务分支，不直接在 `main` 上修改。

## 开始之前

本项目是基于 `pnpm workspace` 的 TypeScript monorepo，主要使用 Vue 3、Vite 和 Vitest。开始开发前请准备与根目录 `package.json` 中 `packageManager` 字段一致的 pnpm 版本，并安装依赖：

```bash
pnpm install
```

所有包位于 `packages/*`，包名使用 `@colorless/*` 作用域。修改包之前，至少阅读该包的 `package.json`、`src/index.ts`、相关源码、测试、README 和 `docs/`。包之间只能通过公开入口引用，不要直接依赖其他包的内部源码。

仓库开发规则按以下顺序生效：

1. 根目录 `AGENTS.md` 规定 AI 和自动化开发工具的行为边界。
2. `project-standards/` 规定当前工作区、包、命令和发布流程。
3. `code-standards/` 规定通用的编码、API、测试、文档和重构要求。

## 创建任务分支

从最新的 `main` 创建短期分支。分支名应体现变更类型和目标，例如 `feat/menu-keyboard-navigation`、`fix/permission-guard` 或 `docs/contribution-guide`。

一个分支只处理一个明确任务。不要在同一个 Pull Request 中混入无关重构、依赖升级或格式化改动。

## 实现变更

开始编码前先明确受影响的包、公共 API、依赖方向和兼容性要求。优先复用仓库已有能力，并使用能够解决问题的最小改动。

开发时遵循以下要求：

- 新增能力或修复缺陷时，先添加能够表达预期行为或复现问题的测试。
- 正常场景、边界输入和错误路径应按实际影响补充覆盖。
- 不得为了让检查通过而删除、跳过或削弱已有测试。
- 修改公共 API、默认行为、错误行为或使用方式时，同步更新包 README 或 `docs/`。
- 新增包文档页面时，同步更新该包的 `docs/config.json`。
- 不新增非必要依赖；确需新增时，应在 Pull Request 中说明原因。

## 运行验证

根据变更范围选择验证命令：

| 变更范围 | 最低验证要求 |
| --- | --- |
| 仅修改文档站或包文档 | `pnpm docs:build` |
| 修改单个包实现 | `pnpm --filter <package-name> test` |
| 修改公共类型、导出、构建配置或跨包能力 | `pnpm check:push` |
| 准备推送完整业务变更 | `pnpm check:push` 和受影响包构建 |

常用命令如下：

```bash
pnpm --filter @colorless/hooks test
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
pnpm docs:build
```

提交 Pull Request 时，应在描述中列出实际执行的命令和结果。如果某项检查未执行，也需要说明原因和剩余风险。

## 更新文档

包级文档放在 `packages/<name>/docs/`，其中 `README.md` 是入口，`config.json` 声明页面标题和顺序。根级 VitePress 会读取这些配置，自动生成包路由、API 文档导航和侧边栏。

文档应面向使用者说明适用场景、推荐用法、参数与返回值、错误行为和边界条件。示例必须与当前导出和类型保持一致，不要记录尚未实现的能力。

本地预览和构建命令：

```bash
pnpm docs:dev
pnpm docs:build
```

## 添加 changeset

以下变更需要添加 changeset：

- 新增功能或修复用户可感知的问题。
- 修改公共 API、默认行为、错误行为或依赖要求。
- 修改会影响 npm 发布产物的内容。

只修改测试、开发文档、规范或不影响发布产物的内部实现时，通常不需要 changeset。

执行以下命令，选择受影响的包和版本级别，并填写面向使用者的变更说明：

```bash
pnpm changeset
pnpm changeset:status
```

一个任务通常只需要一个 changeset，并与对应代码、测试和文档一起提交。

## 提交与 Pull Request

使用仓库提供的提交命令生成符合 Conventional Commits 的提交信息：

```bash
pnpm commit
```

推送前 Git hooks 会执行 `pnpm check:push`。创建从任务分支到 `main` 的 Pull Request 后，请确保：

- 标题和描述能够说明问题、解决方案及影响范围。
- 代码、测试、文档和 changeset 保持同步。
- CI 检查全部通过。
- 没有包含生成产物、临时文件或与任务无关的改动。
- 对公共 API 或兼容性有影响时，在描述中明确说明。

业务 Pull Request 经审核合并后，GitHub Actions 会创建或更新版本 Pull Request。版本发布由维护者负责，具体流程见[发版说明](./release.md)。
