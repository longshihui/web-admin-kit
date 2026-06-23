# 发版说明

本仓库采用 Changesets 的多包独立版本模式。各包独立维护版本、`CHANGELOG.md`、git tag 和 GitHub Release；仓库不维护项目级版本或 `v*` tag。

开发阶段如何添加 changeset 见[开发流程](./development.md)。

## 自动化职责

| 环节 | 行为 | 执行人 |
| --- | --- | --- |
| 版本准备 | 根据 `main` 中未消费的 changeset 创建或更新 `chore(release): version packages` PR。 | `changesets/action` |
| 版本更新 | 更新包版本、`CHANGELOG.md` 和内部依赖，并删除已消费的 changeset。 | Changesets CLI |
| 发布校验 | 执行安装、类型检查、lint、测试、包构建和文档构建。 | GitHub Actions |
| npm 发布 | 发布 npm registry 中尚不存在的包版本。 | Changesets CLI |
| 发布记录 | 推送 `包名@版本` tag，并为每个已发布包创建 GitHub Release。 | Changesets CLI、`changesets/action` |
| 文档部署 | `main` 更新后独立构建并部署文档站点。 | GitHub Actions、GitHub Pages |

## 发布操作

维护者审核版本 PR 中的以下内容：

- 需要发布的包及目标版本
- 各包 `CHANGELOG.md`
- workspace 内部依赖版本

确认后合并版本 PR。GitHub Actions 会执行：

```bash
pnpm install --frozen-lockfile
pnpm check:push
pnpm build
pnpm docs:build
pnpm publish:ci
```

`pnpm publish:ci` 只供 CI 使用，不应在本地执行。不同包可以在同一次版本 PR 中使用不同版本，也可以只发布一个包。

包级 tag 示例：

```text
@colorless/hooks@1.1.0
@colorless/menu-kit@0.2.0
```

## GitHub 配置

- Actions 的 `GITHUB_TOKEN` 需要 `contents: write` 和 `pull-requests: write` 权限
- 仓库需要允许 GitHub Actions 创建 pull request
- npm 发布需要配置 `NPM_TOKEN` secret
- 版本 PR 遵循与业务 PR 相同的分支保护和审核规则
