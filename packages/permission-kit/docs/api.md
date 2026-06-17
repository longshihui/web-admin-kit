# permission-kit API 文档

## 导出总览

`@lsh/permission-kit` 导出权限计算器、权限 SDK、组合式 API、模板切面、指令工厂和路由守卫。

```ts
import {
  PermissionCalculateMode,
  PermissionRender,
  PermissionSDK,
  createPermissionDirectives,
  createPermissionRouterGuard,
  definePermissionCalculator,
  usePermission,
  usePermissionDirectives,
  usePermissionSDK,
} from '@lsh/permission-kit'
```

## 常量

### `PermissionCalculateMode`

内置权限计算模式：

```ts
PermissionCalculateMode.AND // 目标权限全部满足
PermissionCalculateMode.OR // 目标权限命中任意一个
```

## 类型

### `PermissionCode`

```ts
type PermissionCode = string
```

### `PermissionCalculator`

```ts
interface PermissionCalculator {
  (targetCodes: PermissionCode[], storeCodes: PermissionCode[]): boolean
}
```

### `PermissionOptions`

```ts
type PermissionOptions =
  | PermissionCode
  | PermissionCode[]
  | {
      codes: PermissionCode | PermissionCode[]
      calculator?: PermissionCalculateMode | PermissionCalculator
    }
```

## SDK

### `new PermissionSDK(options)`

创建权限 SDK 实例。

```ts
const sdk = new PermissionSDK({
  fetchResourceList: async () => ['contract:view', 'contract:create'],
})
```

入参：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `fetchResourceList` | `() => Promise<PermissionCode[]>` | 是 | 拉取权限点列表的方法 |

### `sdk.init()`

初始化权限点列表。

### `sdk.getCodes()`

返回当前权限点列表，对应 `ComputedRef<PermissionCode[]>`。

### `sdk.setCodes(codes)`

手动更新权限点列表。

### `sdk.hasPermission(options)`

根据 `PermissionOptions` 判断当前是否授权。

```ts
sdk.hasPermission('contract:view')
sdk.hasPermission(['contract:view', 'contract:create'])
sdk.hasPermission({
  codes: ['contract:view', 'contract:approve'],
  calculator: PermissionCalculateMode.OR,
})
```

### `sdk.watch(listener)`

监听权限点列表变化。

### `sdk.whenInitialed(cb?)`

等待 SDK 初始化完成后再继续执行逻辑。

### `sdk.install(app)`

向 Vue 应用注入 SDK，供 `usePermissionSDK()` 和相关组件/指令消费。

## 组合式 API

### `usePermission(options)`

根据权限配置返回响应式授权状态。

```ts
const { status, whenGranted, whenDenied } = usePermission({
  codes: ['contract:view', 'contract:list'],
  calculator: PermissionCalculateMode.OR,
})
```

返回值：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `status` | `ComputedRef<'granted' \| 'denied'>` | 当前授权状态 |
| `whenGranted` | `(callback) => void` | 状态为已授权时执行回调 |
| `whenDenied` | `(callback) => void` | 状态为未授权时执行回调 |

### `usePermissionSDK()`

从当前应用上下文中读取 SDK 实例。

```ts
const { sdk } = usePermissionSDK()
```

## 组件

### `PermissionRender`

基于权限状态切换渲染内容。

Props：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `codes` | `PermissionCode \| PermissionCode[]` | 是 | 目标权限点 |
| `calculator` | `PermissionCalculateMode \| PermissionCalculator` | 否 | 权限计算方式，默认 `AND` |

Events：

| 事件 | 说明 |
| --- | --- |
| `granted` | 当前状态为已授权时触发 |
| `denied` | 当前状态为未授权时触发 |

Slots：

| 插槽 | 说明 |
| --- | --- |
| `default` | 已授权时的默认内容 |
| `granted` | 已授权时的具名插槽，优先级高于 `default` |
| `denied` | 未授权时的具名插槽 |

## 指令

### `createPermissionDirectives(sdk)`

创建与指定 SDK 绑定的指令集合。

```ts
const { vPermission } = createPermissionDirectives(permissionSdk)
```

### `usePermissionDirectives()`

基于当前注入的 SDK 返回指令集合。

```ts
const { vPermission } = usePermissionDirectives()
```

`vPermission` 的绑定值为 `PermissionOptions`。

## 路由

### `createPermissionRouterGuard(sdk, options)`

创建 Vue Router 全局守卫。

```ts
router.beforeEach(
  createPermissionRouterGuard(permissionSdk, {
    excludes: ['Login', '403'],
    getPermissionOptions: (to) => to.meta.permission,
    onDenied: (_to, _from, next) => {
      next({ name: '403' })
    },
  })
)
```

配置项：

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `excludes` | `RouteRecordName[]` | 否 | 白名单路由名 |
| `getPermissionOptions` | `(to) => PermissionOptions \| undefined` | 是 | 从目标路由中提取权限配置 |
| `onDenied` | `NavigationGuard` | 是 | 权限不足时的跳转逻辑 |

## 辅助函数

### `definePermissionCalculator(calculator)`

为自定义权限计算器提供显式类型约束。

```ts
const calculator = definePermissionCalculator((targetCodes, storeCodes) => {
  return targetCodes.every((code) => storeCodes.includes(code))
})
```
