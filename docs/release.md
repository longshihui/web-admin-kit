# 发版说明

本仓库使用混合发版流程：

- `changesets` 负责管理各个包的独立版本和包级 `CHANGELOG.md`
- `release-it` 负责创建仓库级发布提交、git tag 和 GitHub Release
- 推送 `v*` 标签后，GitHub Actions 负责把变更包发布到 npm

## 职责划分

### Changesets

- 发布意图的唯一来源是 `.changeset/*.md`
- `pnpm changeset` 用于创建待发布条目
- `pnpm release:version` 会执行 `changeset version`
- 每个发生变更的包都会生成自己的 `CHANGELOG.md`

### Release-It

- `pnpm release` 用于执行仓库级发版流程
- `pnpm release:notes` 用于构建仓库级 Release Notes 汇总
- `release-it` 负责创建发布提交
- `release-it` 负责创建 `v*` git tag
- `release-it` 负责创建 GitHub Release

### GitHub Actions

- `.github/workflows/publish-npm.yml` 监听 `v*` 标签
- CI 会执行 `pnpm publish:ci`
- `changeset publish` 只会发布发生版本变更的包

## 发版脚本

```bash
pnpm changeset
pnpm changeset:status
pnpm release:notes
pnpm release:notes:print
pnpm release:version
pnpm release
pnpm publish:ci
```

## 日常流程

### 1. 新增 changeset

执行：

```bash
pnpm changeset
```

选择受影响的包，指定 `patch` / `minor` / `major`，并填写简短说明。

示例：

```md
---
"@colorless/hooks": minor
"@colorless/shared": patch
---

新增 hooks 能力，并补充 shared 辅助方法。
```

### 2. 检查待发布范围

执行：

```bash
pnpm changeset:status
pnpm release:notes:print
```

- `pnpm changeset:status` 用于查看哪些包会升级版本
- `pnpm release:notes:print` 用于预览仓库级 GitHub Release 内容

## 发版流程

### 1. 开始发版

执行：

```bash
pnpm release
```

发版流程会依次执行以下步骤：

1. `pnpm release:notes`
2. `pnpm check:push`
3. `pnpm build`
4. `pnpm docs:build`
5. `pnpm release:version`
6. 创建发布提交
7. 创建 `v*` git tag
8. 推送提交和标签
9. 创建 GitHub Release

### 2. 产出内容

- 仓库级 Release Notes 文件：`.git/.release-notes.md`
- 包版本变更：`packages/*/package.json`
- 包级变更日志：`packages/*/CHANGELOG.md`
- 仓库级发布标签：`v*`

### 3. CI 中会发生什么

标签推送后：

- `publish-npm.yml` 会把变更包发布到 npm
- `deploy-pages.yml` 会重新构建并部署文档站点

## Release Notes 模型

本仓库维护两层变更记录：

- 包级：每个包各自维护 `CHANGELOG.md`
- 仓库级：GitHub Release 汇总本次发布涉及的所有包变更

仓库级 Release Notes 会在执行 `changeset version` 之前，根据待发布的 `.changeset/*.md` 文件聚合生成。

这样既能保持包级 changelog 与 GitHub Release 内容一致，又能保留各包独立版本管理能力。

## 常用命令

### 预览一次发布

```bash
pnpm changeset:status
pnpm release:notes:print
```

### 只应用版本号，不打标签

```bash
pnpm release:version
```

### 执行完整发版流程

```bash
pnpm release
```

## 注意事项

- 不要让 `release-it` 直接管理工作区包版本
- 不要使用 `release-it` 执行 npm 发布，npm 发布应由 `changeset publish` 负责
- git tag 表示的是仓库级发布，不一定对应单个包的某一个版本
