# permission-kit 整体设计

## 背景

业务端通常会把权限点列表、路由访问控制、按钮显隐和局部内容渲染分散在多个模块里维护。随着系统规模增长，这些能力需要统一的 SDK 和共享 API 来降低重复实现成本。

`@colorless/permission-kit` 的目标是把权限相关能力沉淀成独立的一等模型：

- `PermissionSDK` 负责权限点列表的存储、更新与订阅。
- 组合式 API 负责在 Vue 组件中消费权限状态。
- 渲染组件和指令负责把权限判断映射到模板层。
- 路由守卫负责把权限判断接入 `vue-router`。

## 设计目标

- 权限判断逻辑可复用、可测试、可组合。
- 组件内权限消费保持响应式。
- 不绑定业务 store，不强依赖 Pinia。
- 路由、组件、指令复用同一套权限模型。
- 调用方可以扩展权限计算方式。

## 非目标

- 不负责登录态、用户态和 token 生命周期。
- 不内置具体业务权限点。
- 不负责动态路由表生成。
- 不内置 UI 组件库适配层。

## 核心模型

### `PermissionCode`

权限点使用字符串表达，例如 `contract:view`、`user:create`。

### `PermissionCalculator`

权限计算器接收目标权限点和当前用户权限点列表，返回是否授权。

```ts
type PermissionCalculator = (
  targetCodes: PermissionCode[],
  storeCodes: PermissionCode[]
) => boolean
```

### `PermissionOptions`

统一的权限入参模型，支持三种写法：

```ts
type PermissionOptions =
  | PermissionCode
  | PermissionCode[]
  | {
      codes: PermissionCode | PermissionCode[]
      calculator?: PermissionCalculateMode | PermissionCalculator
    }
```

## 模块职责

### `sdk.ts`

定义 `PermissionSDK`，负责：

- 拉取初始权限点列表。
- 更新权限点集合。
- 提供 `hasPermission` 判断。
- 提供权限变化订阅。
- 通过 `install()` 注入到 Vue 应用上下文。

### `hooks/`

提供 Vue 场景下的组合式 API：

- `usePermissionSDK()` 读取注入的 SDK 实例。
- `usePermission()` 读取授权状态，并基于状态执行副作用。

### `components/`

提供 `PermissionRender` 模板切面，根据授权状态切换 `granted` / `denied` 插槽。

### `directives/`

提供 `v-permission` 指令，对纯 DOM 元素做显隐控制。

### `router/`

提供 `createPermissionRouterGuard()`，把权限判断接入 `vue-router` 全局守卫。

## 推荐接入方式

```txt
src/permission/
  sdk.ts
  guards.ts
  index.ts
```

- `sdk.ts` 负责创建并初始化 `PermissionSDK`。
- `guards.ts` 负责注册路由守卫。
- 页面组件和按钮组件直接消费 `usePermission`、`PermissionRender` 或 `v-permission`。

## 分阶段落地建议

### 第一阶段

- 在项目启动阶段初始化 `PermissionSDK`。
- 把现有按钮显隐逻辑迁移到 `usePermission` 或 `v-permission`。

### 第二阶段

- 把路由访问控制迁移到 `createPermissionRouterGuard()`。
- 统一权限点计算方式，收敛自定义工具函数。

### 第三阶段

- 为复杂业务场景补充项目级权限适配层。
- 根据实际需要补充更多测试场景和 API 文档示例。
