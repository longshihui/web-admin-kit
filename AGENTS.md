# AGENTS

本文件用于约束 AI 编程工具在本仓库中的开发行为。AI 必须优先遵守本文件规则，避免自行发散、过度设计或无关重构。

## 核心原则

- 严格围绕当前需求开发，不主动扩展需求范围。
- 优先使用最小改动解决问题，避免大范围重构。
- 开发前必须阅读相关现有代码、测试、文档和当前包的依赖关系。
- 优先复用仓库已有能力，不重复造轮子。
- 不确定需求、公共 API 设计、兼容性影响或 breaking change 时，必须先与开发者确认。
- 不得回滚、删除或覆盖与当前任务无关的已有改动。

## 开发流程

1. 明确需求和影响范围。
2. 阅读受影响包的 `package.json`、入口文件、源码、测试和文档。
3. 先编写或补充测试，覆盖正常场景、边界场景和异常场景。
4. 实现代码时保持改动聚焦，不做无关重构。
5. 修改公共 API、导出、行为或使用方式时，同步更新 README 或 docs。
6. 根据影响范围运行测试和检查。
7. 最终回复中说明修改内容、验证命令和结果。

## 禁止事项

- 禁止在需求未要求时重构无关模块。
- 禁止随意新增依赖；新增依赖前必须说明理由。
- 禁止只改实现不补测试。
- 禁止为了通过测试而删除、跳过或削弱已有测试。
- 禁止修改生成产物或发布产物来规避构建问题。

## 规范阅读路由

### 通用代码规范

- 涉及 TypeScript、Vue、CSS、BEM、注释时，阅读[代码规范](./code-standards/coding-style.md)。
- 涉及业务页面、表单、表格、弹窗、抽屉时，阅读[业务代码开发规范](./code-standards/business-coding-style.md)。
- 涉及新增目录、模块边界、共享能力、跨模块复用时，阅读[代码架构规范](./code-standards/code-architecture.md)。
- 涉及组件拆分、wrapper、hooks、抽象边界时，阅读[组件与 Hooks 规范](./code-standards/component-and-hooks.md)。
- 涉及测试设计、测试覆盖、断言质量、回归测试时，阅读[测试规范](./code-standards/testing.md)。
- 涉及重构时，阅读[代码重构规范](./code-standards/code-refactoring.md)，并将改动限制在当前任务影响范围内。

### 项目级规范

- 涉及技术栈、workspace、包目录、包依赖关系时，阅读[工作区规范](./project-standards/workspace.md)。
- 涉及测试、构建、检查、文档站点命令时，阅读[命令规范](./project-standards/commands.md)。
- 涉及包边界、公共 API、包导出、新增包、依赖策略时，阅读[包开发规范](./project-standards/package-development.md)。
- 涉及 README、docs、changeset、发版时，阅读[文档与发布规范](./project-standards/documentation-and-release.md)。
