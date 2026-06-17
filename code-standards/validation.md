# 验证细则

## 范围

- 只验证本次改动影响到的项目或包。
- 修改 `projects/management-ui` 时，只运行 `management-ui` 的校验。
- 修改 `projects/base-ui` 时，只运行 `base-ui` 的校验。
- 修改 `packages/*` 时，根据依赖关系选择受影响项目校验。
- 只改文档或规则文件时，优先运行格式检查；不需要运行业务项目的 typecheck。

## 常用命令

- `management-ui` ESLint 修复：`pnpm --filter management-ui run lint:eslint:fix`
- `management-ui` 类型检查：`pnpm --filter management-ui run typecheck`
- `base-ui` ESLint 修复：`pnpm --filter base-ui run lint:eslint:fix`
- `base-ui` 类型检查：`pnpm --filter base-ui run typecheck`
- 根目录 Markdown 格式检查：`pnpm exec prettier AGENTS.md ".agent-rules/**/*.md" "projects/**/AGENTS.md" --check`
