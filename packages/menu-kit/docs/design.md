# shared-menu 整体设计

## 背景

当前业务端菜单从路由配置派生，路由 `meta` 同时承载页面访问权限、菜单标题、图标、排序和隐藏规则。随着外链菜单、动作菜单、第三方系统入口等导航场景出现，继续把菜单挂在 `RouteRecordRaw` 上会让路由模型承载过多职责。

`@lsh/shared-menu` 的目标是把菜单作为独立的一等模型：

- 路由配置负责页面注册和 URL 访问控制。
- 菜单配置负责导航结构和入口展示。
- 权限 SDK 负责权限点状态和权限判断。
- 菜单组合式 API 根据声明式菜单树生成响应式菜单变量。

## 设计目标

- 菜单和路由配置互不派生。
- 菜单支持路由、外链和动作三类入口。
- 菜单权限判断由菜单项自身的 `hasPermission` 函数完成，不直接依赖业务 store。
- 菜单激活判断由菜单项自身的 `isActive` 函数完成，不需要调用方额外维护高亮规则表。
- 菜单构建逻辑响应式、可测试、可复用。
- 菜单组件只消费构建后的菜单树，不内置权限和跳转分支。

## 非目标

- 不在共享包中定义具体业务菜单。
- 不在共享包中持有登录态、用户态或权限点列表。
- 不在共享包中绑定 `Pinia`。
- 不在共享包中输出 TDesign 或 Element Plus 专用结构。
- 不替代 `vue-router` 的路由访问控制。

## 设计边界

适合放在这里的能力：

- 菜单类型定义。
- 根据声明式菜单树生成响应式菜单变量。
- 菜单跳转解析。
- 当前激活菜单计算。
- 菜单索引和查找工具。
- 菜单配置校验。

不放在这里的能力：

- 具体业务菜单配置。
- 用户信息和权限点获取。
- `Pinia` store 定义。
- 具体 UI 组件库菜单渲染。
- 固定登录页、首页、403 路由路径。

## 核心模型

### AppMenuItem

`AppMenuItem` 是原始菜单配置，通常由业务项目按模块维护。

关键字段：

- `key`：菜单稳定标识。可选；未配置时由构建器使用 UUID 自动生成。
- `title`：菜单展示名称。
- `icon`：菜单图标 VNode，由业务菜单配置直接提供，UI 适配层负责渲染。
- `orderNo`：同级菜单排序。
- `target`：菜单入口目标。
- `hasPermission`：菜单展示权限函数，返回 `boolean`；不配置时默认展示。
- `isActive`：菜单激活判断函数，返回 `boolean`；不配置时不会自动激活。
- `visible`：额外展示条件，适合环境开关、租户开关等场景。
- `children`：子菜单。

### MenuTarget

菜单目标分三类：

```ts
import { MENU_TARGET_TYPES } from "@lsh/shared-menu";

type MenuTarget =
  | { type?: typeof MENU_TARGET_TYPES.ROUTE; location: RouteLocationRaw }
  | {
      type: typeof MENU_TARGET_TYPES.EXTERNAL;
      href: string;
      openInNewTab?: boolean;
    }
  | {
      type: typeof MENU_TARGET_TYPES.ACTION;
      action: string;
      payload?: unknown;
    };
```

推荐路由菜单使用 route name：

```ts
target: {
  location: { name: "ContractLedger" },
}
```

`type` 不直接使用字符串字面量。路由目标默认使用 `MENU_TARGET_TYPES.ROUTE`，因此可省略 `type`；外链和动作目标使用 `MENU_TARGET_TYPES.EXTERNAL`、`MENU_TARGET_TYPES.ACTION`。

不要优先使用 path。path 对父子路由、动态参数和重定向更敏感，route name 更适合作为菜单与路由之间的稳定协同点。

## 模块职责

### `types.ts`

定义菜单模型、菜单目标类型常量、导航选项、active 规则和校验结果。

### `use-menu.ts`

包的主入口。调用方传入声明式菜单树，返回响应式菜单变量：

```ts
const { menus } = useMenu(menuTree);
```

`menus` 是 `ComputedRef<BuiltMenuItem[]>`。当菜单源或 `hasPermission`、`isActive` 内部读取的 Vue 响应式状态变化时，菜单会重新计算。

### `builder.ts`

负责把原始菜单配置构建成最终可渲染菜单树：

- 递归处理子菜单。
- 为未声明 `key` 的菜单生成 UUID，并在同一个菜单声明对象上保持稳定。
- 执行 `visible` 判断。
- 执行权限判断。
- 保留有可见子节点的父级菜单。
- 按 `orderNo` 排序；同序菜单保持声明顺序。
- 不修改原始菜单配置。

### `permission.ts`

定义菜单构建使用的权限判断逻辑。共享包不直接读取权限点列表，只读取菜单项上的 `hasPermission` 函数。

业务项目可以在菜单配置中闭包调用权限 SDK 或项目级 permission service：

```ts
{
  title: "合同台账",
  target: {
    location: { name: "ContractLedger" },
  },
  hasPermission: () => permissionService.hasPermission(["clm:contract:list"]),
}
```

### `navigator.ts`

封装菜单点击后的跳转行为：

- `route`：调用 `router.push(location)`。
- `external`：默认新窗口打开，也允许业务注入 `openExternal`。
- `action`：从 `actionRegistry` 中查找并执行动作。

菜单组件只调用 `navigateByMenu(menu, router, options)`，不需要关心目标类型分支。

### `active.ts`

封装路由与菜单高亮关系。

拆分菜单和路由后，不再依赖 `route.meta.activeMenu`。业务项目在菜单配置阶段通过 `isActive` 声明激活规则：

```ts
{
  title: "合同台账",
  target: {
    location: { name: "ContractLedger" },
  },
  isActive: (route) =>
    route.routeName === "ContractLedger" ||
    route.routeName === "ContractDetail",
}
```

### `utils.ts`

提供菜单树工具：

- `flattenMenus`
- `createMenuMap`
- `findMenuByKey`
- `getMenuParents`

### `validate.ts`

提供开发期菜单配置校验：

- `key` 是否重复。
- 外链菜单是否缺少 `href`。
- 菜单是否既没有 `target` 也没有子菜单。
- 路由菜单引用的 route name 是否存在。

## 推荐业务项目目录

```txt
src/menu/
  configs/
    contract.ts
    master-data.ts
    index.ts
  store.ts
```

其中：

- `configs/` 只放业务菜单配置。
- `store.ts` 或页面组合层负责调用 `useMenu`，并把 `menus`、`activeMenu`、`expandedMenuKeys` 暴露给菜单组件。

## 权限变化协同

推荐数据流：

```txt
权限 SDK / userStore 权限点变化
  -> hasPermission 读取到最新权限状态
  -> useMenu 自动重新计算 menus
  -> 菜单 UI 自动重渲染
```

在 Vue 项目中，如果权限点由 `Pinia` 保存，`hasPermission` 直接读取 store 中的响应式状态即可：

```ts
const menuTree = [
  {
    title: "合同台账",
    target: {
      location: { name: "ContractLedger" },
    },
    hasPermission: () =>
      userStore.permissionCodeList.includes("clm:contract:list"),
  },
];

const { menus } = useMenu(menuTree);
```

如果权限点由非 Vue 响应式的独立权限 SDK 保存，业务层需要把 SDK 变化转成 Vue 响应式依赖：

```ts
const permissionVersion = shallowRef(0);

permissionSdk.subscribe(() => {
  permissionVersion.value += 1;
});

const menuTree = [
  {
    title: "合同台账",
    target: {
      location: { name: "ContractLedger" },
    },
    hasPermission: () => {
      permissionVersion.value;
      return permissionSdk.hasPermission("clm:contract:list");
    },
  },
];

const { menus } = useMenu(menuTree);
```

## 路由协同

菜单和路由不互相派生，但通过 API 协同：

- 菜单路由目标使用 `RouteLocationRaw`。
- 推荐使用 route name。
- 开发期通过 `validateMenus(menus, { routeNames })` 校验引用是否存在。
- 高亮通过菜单项的 `isActive(route)` 显式声明。

## 分阶段落地建议

### 第一阶段

- 新增 `@lsh/shared-menu`。
- 把菜单类型、构建、跳转、高亮和校验能力放入共享包。
- 在业务端新建 `src/menu/configs`。
- 保留现有路由 meta，先新增菜单配置并并行验证。

### 第二阶段

- 菜单组件改为消费新菜单 store。
- 从 route meta 中迁移 `title`、`icon`、`orderNo`、`hideInMenu` 等菜单字段。
- 路由只保留访问控制和页面生命周期需要的 meta。

### 第三阶段

- 增加开发期菜单校验。
- 补充外链菜单、动作菜单和菜单 UI 适配层。
- 根据实际组件库需要增加业务项目内的 TDesign adapter。
