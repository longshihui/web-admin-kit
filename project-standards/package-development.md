# 包开发规范

本文件记录当前仓库的包开发规则。
公共 API 的通用设计原则见 `../code-standards/api-design.md`。

## 包边界

- 包之间通过公开入口导入，不直接引用其他包的内部源码。
- 新增公开能力时，同步更新包入口、类型、README 或 docs。
- 修改公共 API、默认行为、错误行为或依赖要求时，必须评估兼容性影响。
- 涉及 Vue、Vue Router 等运行时集成能力时，优先判断是否应声明为 `peerDependencies`。

## 依赖策略

- 只服务单个包运行时的依赖，应声明在对应包的 `dependencies` 中。
- 只服务开发、测试、构建或类型检查的依赖，应声明在对应层级的 `devDependencies` 中。
- 多个包共享的构建、测试、lint 工具可以放在根目录 `devDependencies`。
- Vue、Vue Router 等由使用方应用提供实例的依赖，优先声明为 `peerDependencies`，并在本包 `devDependencies` 中提供测试和构建所需版本。
- 新增依赖前必须先检查 workspace 内是否已有等价能力。
- 不为少量简单逻辑新增重量级依赖。
- 新增依赖后应确认 lockfile、构建产物、类型输出和文档示例是否受影响。

## 公共 API 变更

以下情况视为公共 API 或用户可感知行为变化：

- 新增、删除或重命名导出。
- 修改函数、组件、hook 的参数、返回值或类型约束。
- 修改默认值、错误抛出、边界输入处理或异步时序。
- 修改包依赖、peer 依赖或构建产物入口。
- 修改 README 或 docs 中承诺的使用方式。

## 新增包清单

新增包时，至少确认以下内容：

- `package.json`
- `src/index.ts`
- `README.md`
- `docs/README.md`
- `docs/config.json`
- `tsconfig.json`
- `tsconfig.build.json`
- `vite.config.ts`
- `vitest.config.ts`
- 对应测试用例
