# 开发流程

日常开发使用短期功能分支，不直接在 `main` 上修改。业务 PR 由开发者创建，版本 PR 由 GitHub Actions 创建。

## 阶段与职责

| 阶段 | 步骤 | 描述 | 执行人 |
| --- | --- | --- | --- |
| 准备 | 创建分支 | 更新本地 `main`，并创建 `feat/*`、`fix/*` 或其他任务分支。 | 开发者 |
| 实现 | 修改代码 | 阅读受影响模块，完成最小范围实现，并补充测试和必要文档。 | 开发者 |
| 变更记录 | 添加 changeset | 发布包的功能、行为、API、依赖或产物发生变化时执行一次 `pnpm changeset`。 | 开发者、Changesets CLI |
| 验证 | 本地检查 | 按影响范围执行测试、类型检查、lint、包构建或文档构建。 | 开发者 |
| 提交 | 提交代码 | 使用 `pnpm commit` 提交代码、测试、文档和 changeset；Git hooks 自动执行提交检查。 | 开发者、Husky |
| 推送 | 推送分支 | 推送前自动执行 `pnpm check:push`，通过后将任务分支推送到远端。 | 开发者、Husky |
| 业务 PR | 创建并合并 PR | 创建从任务分支到 `main` 的 PR，完成审核后合并。 | 开发者、维护者 |
| 发布交接 | 更新版本 PR | 业务 PR 合并后，自动校验和构建工作区，并创建或更新版本 PR。 | GitHub Actions、`changesets/action` |
| 发布 | 合并版本 PR | 维护者决定发布时间；后续步骤见[发版说明](./release.md)。 | 维护者 |

## Changeset 判断

需要 changeset：新增功能、修复用户可感知问题、修改公共 API 或默认行为、修改依赖要求或发布产物。

不需要 changeset：只改测试、开发文档或规范，以及不影响发布产物和用户行为的内部实现。

一个任务通常只添加一个 changeset，并与业务代码一起进入 PR；不需要在每次提交前重复执行。

## 常用命令

```bash
pnpm changeset
pnpm changeset:status
pnpm check:push
pnpm build
pnpm docs:build
pnpm commit
```
