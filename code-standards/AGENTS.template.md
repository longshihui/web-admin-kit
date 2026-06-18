# AGENTS

> 使用前请复制本文件到项目根目录并命名为 `AGENTS.md`，再按项目实际情况替换或删除带有 `TODO` 的内容。

本文件用于约束 AI 编程工具在本仓库中的开发行为。AI 必须优先遵守本文件规则，避免自行发散、过度设计或无关重构。

## 规则优先级

1. 用户当前明确指令优先。
2. 安全、权限和数据保护要求优先于普通开发规则。
3. 本文件的 AI 行为约束优先于其他规范文件。
4. 项目级规则优先于 `code-standards/` 中的通用规则。
5. 当规则冲突或需求不清晰时，先向开发者确认，不要自行选择风险较高的解释。

## 核心原则

- 严格围绕当前需求开发，不主动扩展需求范围。
- 优先使用最小改动解决问题，避免大范围重构。
- 开发前必须阅读相关现有代码、测试、文档和当前模块或包的依赖关系。
- 优先复用仓库已有能力，不重复造轮子。
- 不确定需求、公共 API 设计、兼容性影响或 breaking change 时，必须先与开发者确认。
- 不得回滚、删除或覆盖与当前任务无关的已有改动。

## 开发流程

1. 明确需求和影响范围。
2. 阅读受影响模块或包的元信息、入口文件、源码、测试和文档。
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

- 涉及 TypeScript、Vue、CSS、BEM、注释时，阅读 `./code-standards/coding-style.md`。
- 涉及业务页面、表单、表格、弹窗、抽屉时，阅读 `./code-standards/business-coding-style.md`。
- 涉及新增目录、模块边界、共享能力、跨模块复用时，阅读 `./code-standards/code-architecture.md`。
- 涉及组件拆分、wrapper、hooks、抽象边界时，阅读 `./code-standards/component-and-hooks.md`。
- 涉及函数、组件、hooks、模块导出或公共能力设计时，阅读 `./code-standards/api-design.md`。
- 涉及 README、API 文档、示例、迁移说明时，阅读 `./code-standards/documentation.md`。
- 涉及测试设计、测试覆盖、断言质量、回归测试时，阅读 `./code-standards/testing.md`。
- 涉及重构时，阅读 `./code-standards/code-refactoring.md`，并将改动限制在当前任务影响范围内。

### 项目级规范

TODO：根据项目实际情况保留、删除或替换以下路由。

- 涉及技术栈、工作区结构、模块目录、依赖关系时，阅读 `./project-standards/workspace.md`。
- 涉及测试、构建、检查、文档站点命令时，阅读 `./project-standards/commands.md`。
- 涉及包边界、公共 API、导出、新增包、依赖策略时，阅读 `./project-standards/package-development.md`。
- 涉及 README、docs、变更记录、发版时，阅读 `./project-standards/documentation-and-release.md`。

## 项目补充规则

TODO：在这里补充当前项目独有规则，例如技术栈、命令、目录结构、发布流程、CI 要求或特殊业务边界。

- TODO：补充项目级规则。
