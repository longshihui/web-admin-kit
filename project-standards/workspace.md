# 工作区规范

本文件记录当前仓库的项目级工作区规则。通用代码规范见 `code-standards/`。

## 技术栈

- 基础语言：TypeScript
- 前端框架：Vue 3
- 构建工具：Vite
- 测试框架：Vitest
- 包管理器：pnpm
- Monorepo：pnpm workspace

## 工作区结构

- 所有包位于 `packages/*`。
- 每个包独立维护版本。
- 包名统一使用 `@colorless/*`。
- 包之间应通过公开入口引用，不要直接引用其他包的内部源码。

## 开发前阅读

- 修改某个包前，先阅读该包的 `package.json`、入口文件、源码、测试和文档。
- 跨包修改前，先确认包之间的依赖方向和公开 API。
- 新增依赖前，先确认 workspace 内是否已有可复用能力。
