# Changelog

根仓库不再维护统一的发布日志。

从 `Changesets` 迁移后，各 npm 包会在自己的包目录下生成独立的 `CHANGELOG.md`：

- `packages/hooks/CHANGELOG.md`
- `packages/menu-kit/CHANGELOG.md`
- `packages/permission-kit/CHANGELOG.md`
- `packages/shared/CHANGELOG.md`

仓库级别的变更概览会在每次 GitHub Release 中生成，内容来自待发布的 `.changeset/*.md` 聚合结果。
