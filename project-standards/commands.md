# 命令规范

本文件记录当前仓库的常用命令和验证策略。

## 常用命令

- 安装依赖：`pnpm install`
- 单包测试：`pnpm --filter <package-name> test`
- 全量测试：`pnpm test:run`
- 类型检查：`pnpm typecheck`
- Lint：`pnpm lint`
- 常规检查：`pnpm check`
- 推送前检查：`pnpm check:push`
- 构建所有包：`pnpm build`
- 文档开发：`pnpm docs:dev`
- 文档构建：`pnpm docs:build`

## 验证策略

- 只修改文档时，优先运行 `pnpm docs:build`。
- 修改单个包的实现时，至少运行该包测试。
- 修改公共类型、导出、构建配置或跨包能力时，运行 `pnpm check:push`。
- 修改文档站点、包文档目录或文档配置时，运行 `pnpm docs:build`。
- 修改发布脚本、changeset 或 release 配置时，运行相关预览命令，并说明未执行完整发版的原因。
