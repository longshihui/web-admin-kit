# Web Admin Kit 项目说明

`web-admin-kit` 是一个基于 `pnpm` 的 TypeScript monorepo，用于维护中后台项目可复用的共享包、SDK 和配套文档。

## 工作区约定

- 业务包统一放在 `packages/*`。
- 包名统一使用 `@lsh/*` 作用域。
- 每个包的文档统一放在 `packages/<name>/docs/`。
- 每个包使用 `docs/README.md` 作为文档入口。
- 每个包使用 `docs/config.json` 声明文档结构、标题和顺序。
- 根级 `.vitepress` 统一读取各包配置，构建 `/packages/<name>/` 下的文档站点。
- 测试统一使用 `Vitest`。

## 常用命令

```bash
pnpm install
pnpm commit
pnpm test:run
pnpm build
pnpm docs:dev
pnpm docs:build
pnpm changeset
pnpm release:notes:print
pnpm release
```

## 提交流程

- 执行 `pnpm commit` 打开基于 `cz-git` 的 Commitizen 交互式提交流程。
- 提交流程会依次引导填写 `type`、`scope`、`subject`、可选正文和 issue footer。
- `Husky` 的 `commit-msg` 钩子仍会执行 `commitlint`，手动提交也会被校验。

## 发版流程

- 修改一个或多个包后执行 `pnpm changeset`。
- 使用 `pnpm changeset:status` 查看待发布的版本变更。
- 使用 `pnpm release:notes:print` 预览仓库级 GitHub Release 说明。
- 使用 `pnpm release` 执行完整发布流程：生成发布说明、校验工作区、更新版本和 changelog、创建 git tag，并发布 GitHub Release。
- `v*` 标签推送后，GitHub Actions 会执行 `pnpm publish:ci` 发布变更包到 npm。
- 完整发布说明见 [release.md](./release.md)。
