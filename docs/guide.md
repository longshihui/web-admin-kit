# 项目说明

`web-admin-kit` 是一个基于 `pnpm` 的 TypeScript monorepo，用于维护中后台项目可复用的共享包、SDK 和配套文档。

## 工作区约定

- 业务包统一放在 `packages/*`。
- 包名统一使用 `@colorless/*` 作用域。
- 每个包的文档统一放在 `packages/<name>/docs/`。
- 每个包使用 `docs/README.md` 作为文档入口。
- 每个包使用 `docs/config.json` 声明文档结构、标题和顺序。
- 根级 `.vitepress` 统一读取各包配置，构建 `/packages/<name>/` 下的文档站点。
- 测试统一使用 `Vitest`。

## 开发与发布

- 环境准备、日常分支、测试、changeset、提交和业务 PR 要求见[贡献手册](./development.md)。
- 版本 PR、npm 发布、包级 tag 和 GitHub 配置见[发版说明](./release.md)。
