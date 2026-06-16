import { describe, expect, it } from "vitest";

import { MENU_TARGET_TYPES } from "./types";
import { validateMenus } from "./validate";
import type { AppMenuItem } from "./types";

describe("validate", () => {
  it("会检查重复 key、无效外链、无意义节点和不存在的路由引用", () => {
    const menus: AppMenuItem[] = [
      {
        key: "contract",
        title: "合同",
        target: {
          location: { name: "ContractLedger" },
        },
        children: [
          {
            key: "nested-duplicated",
            title: "嵌套重复",
            target: {
              location: { name: "ContractLedger" },
            },
          },
        ],
      },
      {
        key: "contract",
        title: "重复合同",
      },
      {
        key: "help",
        title: "帮助",
        target: {
          type: MENU_TARGET_TYPES.EXTERNAL,
          href: "",
        },
      },
      {
        key: "missing-route",
        title: "不存在路由",
        target: {
          location: { name: "MissingRoute" },
        },
      },
      {
        key: "nested-duplicated",
        title: "重复嵌套",
        target: {
          location: { name: "ContractLedger" },
        },
      },
    ];

    const issues = validateMenus(menus, {
      routeNames: ["ContractLedger"],
    });

    expect(issues).toEqual([
      {
        type: "error",
        menuKey: "contract",
        message: "菜单 key 重复：contract",
      },
      {
        type: "warning",
        menuKey: "contract",
        message: "菜单没有 target，也没有子菜单",
      },
      {
        type: "error",
        menuKey: "help",
        message: "外链菜单缺少 href",
      },
      {
        type: "error",
        menuKey: "missing-route",
        message: "菜单引用的路由不存在：MissingRoute",
      },
      {
        type: "error",
        menuKey: "nested-duplicated",
        message: "菜单 key 重复：nested-duplicated",
      },
    ]);
  });

  it("合法菜单和无 name 的路由目标不会产生校验问题", () => {
    expect(
      validateMenus(
        [
          {
            key: "contract",
            title: "合同",
            children: [
              {
                key: "contract-ledger",
                title: "合同台账",
                target: {
                  location: { name: "ContractLedger" },
                },
              },
              {
                key: "contract-path",
                title: "合同路径",
                target: {
                  location: "/contract/ledger",
                },
              },
            ],
          },
        ],
        {
          routeNames: ["ContractLedger"],
        },
      ),
    ).toEqual([]);
  });
});
