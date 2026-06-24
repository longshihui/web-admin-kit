# TODO

## CI/CD

- [ ] 为 Changesets 版本 PR 接入完整的合并检查流程。
  - [ ] 创建并安装专用于发版流程的 GitHub App，授予 `Contents: write` 和 `Pull requests: write` 权限。
  - [ ] 配置 `RELEASE_APP_ID` 仓库变量和 `RELEASE_APP_PRIVATE_KEY` 仓库 Secret。
  - [ ] 使用 GitHub App token 创建或更新 `changeset-release/main` 版本 PR，确保 PR 能触发后续 Actions。
  - [ ] 新增面向 `main` PR 的检查 workflow，执行 `pnpm check:push`、`pnpm build` 和 `pnpm docs:build`。
  - [ ] 为 `main` 配置 Ruleset，将 PR 检查设为必需状态检查，检查失败时禁止合并且不允许绕过。
