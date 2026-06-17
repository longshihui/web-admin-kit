import { describe, expect, it } from "vitest";
import { h } from "vue";

import { buildMenus } from "../src/builder";
import type { AppMenuItem } from "../src/types";

describe("builder", () => {
  it("未声明 key 时会自动生成 UUID，并在同一个菜单对象上保持稳定", () => {
    const menus: AppMenuItem[] = [
      {
        title: "自动 key 菜单",
        target: {
          location: { name: "AutoKey" },
        },
      },
    ];

    const firstBuild = buildMenus(menus);
    const secondBuild = buildMenus(menus);

    expect(firstBuild[0]?.key).toMatch(
      /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}$/,
    );
    expect(secondBuild[0]?.key).toBe(firstBuild[0]?.key);
  });

  it("会按权限和 visible 构建可展示菜单树，并保留有可见子节点的父级", () => {
    const contractIcon = h("span", "合同");
    const menus: AppMenuItem[] = [
      {
        key: "contract",
        title: "合同管理",
        icon: contractIcon,
        orderNo: 2,
        hasPermission: () => false,
        children: [
          {
            key: "contract-ledger",
            title: "合同台账",
            target: {
              location: { name: "ContractLedger" },
            },
            hasPermission: () => true,
          },
          {
            key: "contract-hidden",
            title: "隐藏合同入口",
            visible: false,
            target: {
              location: { name: "ContractHidden" },
            },
          },
          {
            key: "contract-remove",
            title: "删除合同",
            target: {
              location: { name: "ContractRemove" },
            },
            hasPermission: () => false,
          },
        ],
      },
      {
        key: "master-data",
        title: "主数据",
        orderNo: 1,
        target: {
          location: { name: "MasterData" },
        },
      },
    ];

    const builtMenus = buildMenus(menus);

    expect(builtMenus.map((menu) => menu.key)).toEqual([
      "master-data",
      "contract",
    ]);
    expect(builtMenus[1]?.children?.map((menu) => menu.key)).toEqual([
      "contract-ledger",
    ]);
    expect(builtMenus[1]?.icon).toBe(contractIcon);
  });

  it("支持 hasPermission 默认放行和空分组保留", () => {
    const menus: AppMenuItem[] = [
      {
        key: "approval",
        title: "审批",
        target: {
          location: { name: "Approval" },
        },
        hasPermission: () => false,
      },
      {
        key: "auto-allowed",
        title: "默认放行",
        target: {
          location: { name: "AutoAllowed" },
        },
      },
      {
        key: "empty-group",
        title: "空分组",
      },
    ];

    expect(
      buildMenus(menus, {
        keepEmptyGroup: true,
      }).map((menu) => menu.key),
    ).toEqual(["auto-allowed", "empty-group"]);
  });

  it("默认移除空分组，并按 orderNo 稳定排序", () => {
    const menus: AppMenuItem[] = [
      {
        key: "z-last",
        title: "最后",
        target: {
          location: { name: "Last" },
        },
      },
      {
        key: "b-same-order",
        title: "同序 B",
        orderNo: 1,
        target: {
          location: { name: "SameOrderB" },
        },
      },
      {
        key: "a-same-order",
        title: "同序 A",
        orderNo: 1,
        target: {
          location: { name: "SameOrderA" },
        },
      },
      {
        key: "empty-group",
        title: "空分组",
      },
    ];

    expect(buildMenus(menus).map((menu) => menu.key)).toEqual([
      "b-same-order",
      "a-same-order",
      "z-last",
    ]);
  });

  it("visible 函数返回 false 时会移除整棵子树", () => {
    const menus: AppMenuItem[] = [
      {
        key: "hidden-parent",
        title: "隐藏父级",
        visible: () => false,
        children: [
          {
            key: "visible-child",
            title: "可见子级",
            target: {
              location: { name: "VisibleChild" },
            },
          },
        ],
      },
    ];

    expect(buildMenus(menus)).toEqual([]);
  });

  it("不会修改原始菜单配置", () => {
    const menus: AppMenuItem[] = [
      {
        key: "root",
        title: "根菜单",
        children: [
          {
            key: "child",
            title: "子菜单",
            target: {
              location: { name: "Child" },
            },
          },
        ],
      },
    ];
    const originalChildren = menus[0]?.children;

    const builtMenus = buildMenus(menus);

    expect(menus[0]?.children).toBe(originalChildren);
    expect(builtMenus[0]).not.toBe(menus[0]);
    expect(builtMenus[0]?.children?.[0]).not.toBe(originalChildren?.[0]);
  });
});
