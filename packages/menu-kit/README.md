# `@colorless/menu-kit`

共享菜单能力包，负责沉淀项目间可复用的“菜单配置、响应式构建、导航解析和高亮计算”能力。

该包的核心目标是让菜单成为独立于 `vue-router` 的导航配置模型。路由只负责页面注册和访问控制，菜单只负责导航展示和入口编排，两者通过稳定 API 协同。

## 快速开始

### 定义菜单配置

```ts
import { MENU_TARGET_TYPES } from "@colorless/menu-kit";
import type { AppMenuItem } from "@colorless/menu-kit";
import { h } from "vue";

import ContractIcon from "@/components/icons/ContractIcon.vue";

export const contractMenus: AppMenuItem[] = [
  {
    title: "合同管理",
    icon: h(ContractIcon),
    orderNo: 3,
    hasPermission: () => permissionService.hasPermission(["clm:contract:list"]),
    children: [
      {
        title: "合同台账",
        target: {
          location: { name: "ContractLedger" },
        },
        hasPermission: () =>
          permissionService.hasPermission(["clm:contract:list"]),
        isActive: (route) =>
          route.routeName === "ContractLedger" ||
          route.routeName === "ContractDetail",
      },
      {
        title: "帮助中心",
        target: {
          type: MENU_TARGET_TYPES.EXTERNAL,
          href: "https://example.com/help",
        },
      },
    ],
  },
];
```

### 生成响应式菜单

```ts
import { useMenu } from "@colorless/menu-kit";

const { activeMenu, expandedMenuKeys, menus } = useMenu(contractMenus, {
  route: () => ({
    routeName: route.name,
    path: route.path,
  }),
});
```

`menus` 是 `ComputedRef<BuiltMenuItem[]>`。如果 `hasPermission` 内部读取了 Vue 响应式权限状态，权限变化后菜单会自动重新计算。

### 菜单跳转

```ts
import { navigateByMenu } from "@colorless/menu-kit";

await navigateByMenu(menu, router, {
  actionRegistry: {
    refreshDashboard: async () => {
      await refreshDashboard();
    },
  },
});
```

## 文档

- [整体设计](./docs/design.md)
- [API 文档](./docs/api.md)
