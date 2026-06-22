# menu-kit API 文档

## 导出总览

`@colorless/menu-kit` 导出菜单类型、响应式菜单生成、菜单点击策略分发、高亮计算、树工具和配置校验能力。

```ts
import {
  MENU_TARGET_TYPES,
  buildMenus,
  createMenuClickHandler,
  createMenuMap,
  getActiveMenu,
  findMenuByKey,
  flattenMenus,
  getActiveMenuKey,
  getExpandedMenuKeys,
  getMenuParents,
  hasMenuPermission,
  isMenuVisible,
  useMenu,
  validateMenus,
} from "@colorless/menu-kit";
```

## 常量

### `MENU_TARGET_TYPES`

菜单目标类型常量。调用方不要直接写字符串字面量。

```ts
MENU_TARGET_TYPES.ROUTE; // "route"
MENU_TARGET_TYPES.EXTERNAL; // "external"
MENU_TARGET_TYPES.ACTION; // "action"
```

路由目标默认是 `MENU_TARGET_TYPES.ROUTE`，因此可以省略 `type`。

## 类型

### `AppMenuItem<TMeta>`

原始菜单声明类型。

| 字段            | 类型                                   | 必填 | 说明                                                                        |
| --------------- | -------------------------------------- | ---- | --------------------------------------------------------------------------- |
| `key`           | `string`                               | 否   | 菜单稳定标识；未配置时由构建器使用 UUID 自动生成。                          |
| `title`         | `string`                               | 是   | 菜单展示名称。                                                              |
| `icon`          | `VNode`                                | 否   | 菜单图标。                                                                  |
| `orderNo`       | `number`                               | 否   | 同级排序值，越小越靠前；未配置时排在已配置项后。                            |
| `target`        | `MenuTarget`                           | 否   | 点击目标；无目标且无子节点时默认不进入构建结果，除非开启 `keepEmptyGroup`。 |
| `hasPermission` | `() => boolean`                        | 否   | 菜单展示权限函数；不配置时默认展示。                                        |
| `isActive`      | `(route: MenuRouteMatcher) => boolean` | 否   | 菜单激活判断函数；不配置时不会自动激活。                                    |
| `visible`       | `boolean \| ((context) => boolean)`    | 否   | 额外展示条件；`false` 时整棵子树不展示。                                    |
| `disabled`      | `boolean`                              | 否   | 是否禁用点击。                                                              |
| `children`      | `AppMenuItem[]`                        | 否   | 子菜单。                                                                    |
| `meta`          | `TMeta`                                | 否   | 业务自定义扩展信息。                                                        |

### `BuiltMenuItem<TMeta>`

构建后的菜单类型。它会移除 `visible`，并把 `children` 转为 `BuiltMenuItem[]`。

### `MenuTarget`

菜单点击目标。

```ts
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

### 点击菜单类型

`createMenuClickHandler` 会按 `target` 类型把 `BuiltMenuItem` 收窄为以下类型：

```ts
type RouteBuiltMenuItem<TMeta> = BuiltMenuItem<TMeta> & {
  target: MenuRouteTarget;
};

type ExternalBuiltMenuItem<TMeta> = BuiltMenuItem<TMeta> & {
  target: MenuExternalTarget;
};

type ActionBuiltMenuItem<TMeta> = BuiltMenuItem<TMeta> & {
  target: MenuActionTarget;
};
```

### `BuildMenusOptions`

```ts
interface BuildMenusOptions {
  keepEmptyGroup?: boolean;
}
```

- `keepEmptyGroup`：是否保留没有 `target`、没有可见子菜单的空分组，默认 `false`。

### `MenuValidationIssue`

菜单配置校验结果。

```ts
interface MenuValidationIssue {
  type: "error" | "warning";
  message: string;
  menuKey?: string;
}
```

## 组合式 API

### `useMenu(menuTree, options?)`

根据声明式菜单树生成响应式菜单变量。

```ts
const { activeMenu, expandedMenuKeys, menus } = useMenu(menuTree, options);
```

参数：

| 参数       | 类型                                       | 必填 | 说明                                                      |
| ---------- | ------------------------------------------ | ---- | --------------------------------------------------------- |
| `menuTree` | `MaybeRefOrGetter<readonly AppMenuItem[]>` | 是   | 原始菜单声明，支持普通数组、`ref`、`computed` 和 getter。 |
| `options`  | `MaybeRefOrGetter<UseMenuOptions>`         | 否   | 构建与激活选项，支持响应式来源。                          |

返回：

| 字段               | 类型                                      | 说明                             |
| ------------------ | ----------------------------------------- | -------------------------------- |
| `menus`            | `ComputedRef<BuiltMenuItem[]>`            | 构建后的响应式菜单树。           |
| `activeMenu`       | `ComputedRef<BuiltMenuItem \| undefined>` | 当前激活菜单。                   |
| `expandedMenuKeys` | `ComputedRef<string[]>`                   | 当前激活菜单对应的父级展开 key。 |

示例：

```ts
const canViewContract = computed(() =>
  userStore.permissionCodeList.includes("clm:contract:list"),
);

const menuTree: AppMenuItem[] = [
  {
    title: "合同台账",
    target: {
      location: { name: "ContractLedger" },
    },
    hasPermission: () => canViewContract.value,
    isActive: (route) =>
      route.routeName === "ContractLedger" ||
      route.routeName === "ContractDetail",
  },
];

const { activeMenu, expandedMenuKeys, menus } = useMenu(menuTree, {
  route: () => ({
    routeName: route.name,
    path: route.path,
  }),
});
```

## 构建 API

### `buildMenus(menus, options?)`

把原始菜单声明构建为可渲染菜单树。

处理规则：

- `visible === false` 的节点和整棵子树会被移除。
- `hasPermission?.() === false` 且无可见子节点的节点会被移除。
- 父节点自身无权限但有可见子节点时会保留父节点。
- 无 `target`、无可见子节点的空节点默认移除。
- 未声明 `key` 的节点会使用 UUID 自动生成 key，并在同一个菜单声明对象上保持稳定。
- `keepEmptyGroup: true` 时保留空分组。
- 同级菜单按 `orderNo` 升序排序；同序菜单保持声明顺序。
- 不修改原始菜单对象。

```ts
const builtMenus = buildMenus(menuTree, {
  keepEmptyGroup: false,
});
```

## 权限与可见性

### `hasMenuPermission(menu)`

读取菜单项的 `hasPermission`，未配置时默认返回 `true`。

```ts
hasMenuPermission({}); // true
hasMenuPermission({ hasPermission: () => false }); // false
```

### `isMenuVisible(menu, context)`

读取菜单项的 `visible`，未配置时默认返回 `true`。

```ts
isMenuVisible({}, {}); // true
isMenuVisible({ visible: false }, {}); // false
isMenuVisible({ visible: () => true }, {}); // true
```

## 菜单点击

### `createMenuClickHandler(strategies)`

创建菜单点击处理函数。共享包只负责封装跳过条件和按菜单目标类型分发策略，不内置具体跳转逻辑。

参数：

| 参数                  | 类型                                     | 必填 | 说明             |
| --------------------- | ---------------------------------------- | ---- | ---------------- |
| `strategies.route`    | `(menu: RouteBuiltMenuItem) => TResult`  | 是   | 路由菜单策略。   |
| `strategies.external` | `(menu: ExternalBuiltMenuItem) => TResult` | 是 | 外链菜单策略。   |
| `strategies.action`   | `(menu: ActionBuiltMenuItem) => TResult` | 是   | 动作菜单策略。   |

返回值：

- 返回一个菜单点击函数，入参为 `BuiltMenuItem`。
- 传入 route、external、action 收窄菜单时，返回对应策略返回值或 `undefined`。
- 传入普通 `BuiltMenuItem` 时，返回三类策略返回值的联合类型或 `undefined`。

跳过条件：

- `menu.disabled === true` 时直接返回 `undefined`。
- `!menu.target` 时直接返回 `undefined`。
- 路由菜单未声明 `target.type` 时按 route 菜单处理。

```ts
const handleMenuClick = createMenuClickHandler({
  route: async (menu) => {
    await router.push(menu.target.location);
  },
  external: (menu) => {
    window.open(menu.target.href, "_blank", "noopener,noreferrer");
  },
  action: async (menu) => {
    await actionRegistry[menu.target.action]?.(menu.target.payload, menu);
  },
});

await handleMenuClick(menu);
```

## 高亮 API

### `getActiveMenu(menus, route)`

根据当前路由和菜单项 `isActive` 配置返回当前激活菜单。未命中时返回 `undefined`。

```ts
const activeMenu = getActiveMenu(menus.value, {
  routeName: route.name,
  path: route.path,
});
```

### `getActiveMenuKey(menus, route)`

根据当前路由和菜单项 `isActive` 配置返回菜单 key。未命中时返回空字符串。

```ts
const activeMenuKey = getActiveMenuKey(menus.value, {
  routeName: route.name,
  path: route.path,
});
```

### `getExpandedMenuKeys(menus, activeMenuKey)`

根据当前激活菜单返回需要展开的父级 key。

```ts
const expandedKeys = getExpandedMenuKeys(menus.value, activeMenuKey);
```

## 树工具

### `flattenMenus(menus)`

按先序遍历展开菜单树。

### `createMenuMap(menus)`

创建 `Map<string, BuiltMenuItem>`。如果存在重复 key，后出现的菜单会覆盖先出现的菜单。

### `findMenuByKey(menus, key)`

按 key 查找菜单，未命中返回 `undefined`。

### `getMenuParents(menus, key)`

返回指定 key 的父级链路；未命中返回空数组。

## 校验 API

### `validateMenus(menus, options?)`

校验原始菜单配置。

```ts
const issues = validateMenus(menuTree, {
  routeNames: router.getRoutes().map((route) => String(route.name)),
});
```

当前校验规则：

- 重复 `key`：`error`
- 无 `target` 且无 `children`：`warning`
- external 目标缺少 `href`：`error`
- route 目标引用的 route name 不存在：`error`

`routeNames` 未传入时，不校验路由引用。
