import { describe, expect, it } from "vitest";
import { shallowRef } from "vue";

import { useMenu } from "./use-menu";
import type { AppMenuItem } from "./types";

describe("use-menu", () => {
  it("会根据声明的菜单树生成响应式菜单变量", () => {
    const canViewContract = shallowRef(false);
    const menuTree: AppMenuItem[] = [
      {
        key: "contract",
        title: "合同管理",
        target: {
          location: { name: "ContractLedger" },
        },
        hasPermission: () => canViewContract.value,
      },
      {
        key: "help",
        title: "帮助中心",
        target: {
          location: { name: "Help" },
        },
      },
    ];

    const { menus } = useMenu(menuTree);

    expect(menus.value.map((menu) => menu.key)).toEqual(["help"]);

    canViewContract.value = true;

    expect(menus.value.map((menu) => menu.key)).toEqual(["contract", "help"]);
  });

  it("会根据 route 和 isActive 返回 activeMenu 与 expandedMenuKeys", () => {
    const route = shallowRef({
      routeName: "ContractDetail",
      path: "/contract/1/detail",
    });
    const menuTree: AppMenuItem[] = [
      {
        title: "合同管理",
        children: [
          {
            title: "合同台账",
            target: {
              location: { name: "ContractLedger" },
            },
            isActive: (currentRoute) =>
              currentRoute.routeName === "ContractLedger" ||
              currentRoute.routeName === "ContractDetail",
          },
        ],
      },
    ];

    const { activeMenu, expandedMenuKeys, menus } = useMenu(menuTree, {
      route,
    });

    expect(activeMenu.value?.title).toBe("合同台账");
    expect(expandedMenuKeys.value).toEqual([menus.value[0]?.key]);

    route.value = {
      routeName: "Unknown",
      path: "/unknown",
    };

    expect(activeMenu.value).toBeUndefined();
    expect(expandedMenuKeys.value).toEqual([]);
  });

  it("支持响应式菜单源和响应式构建选项", () => {
    const menuTree = shallowRef<AppMenuItem[]>([]);
    const keepEmptyGroup = shallowRef(false);
    const { menus } = useMenu(menuTree, () => ({
      keepEmptyGroup: keepEmptyGroup.value,
    }));

    menuTree.value = [
      {
        key: "empty-group",
        title: "空分组",
      },
    ];

    expect(menus.value).toEqual([]);

    keepEmptyGroup.value = true;

    expect(menus.value.map((menu) => menu.key)).toEqual(["empty-group"]);
  });

  it("支持通过 getter 提供菜单树", () => {
    const visible = shallowRef(false);
    const { menus } = useMenu(() => [
      {
        key: "dynamic",
        title: "动态菜单",
        target: {
          location: { name: "Dynamic" },
        },
        hasPermission: () => visible.value,
      },
    ]);

    expect(menus.value).toEqual([]);

    visible.value = true;

    expect(menus.value.map((menu) => menu.key)).toEqual(["dynamic"]);
  });
});
