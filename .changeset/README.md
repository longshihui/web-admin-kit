# Changesets 目录说明

该目录用于存放工作区包的待发布说明。

## 常用命令

- `pnpm changeset`：为发生变更的包创建 changeset 条目
- `pnpm release:notes`：根据待发布的 changeset 构建仓库级 Release Notes
- `pnpm release:notes:print`：把仓库级 Release Notes 输出到标准输出
- `pnpm release:version`：应用版本变更并生成各包的 changelog
- `pnpm release`：通过 `release-it` 创建发布提交、git tag 和 GitHub Release
- `pnpm publish:ci`：在标签推送后的 CI 中把变更包发布到 npm
