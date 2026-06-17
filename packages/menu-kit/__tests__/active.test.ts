import { describe, expect, it } from "vitest";

import {
  getActiveMenu,
  getActiveMenuKey,
  getExpandedMenuKeys,
} from "../src/active";
import type { BuiltMenuItem } from "../src/types";

describe("active", () => {
  it("会基于菜单配置中的 isActive 匹配当前激活菜单", () => {
    const menus: BuiltMenuItem[] = [
      {
        key: "contract",
        title: "合同",
        children: [
          {
            key: "contract-ledger",
            title: "合同台账",
            isActive: (route) =>
              route.routeName === "ContractLedger" ||
              route.routeName === "ContractDetail",
          },
        ],
      },
      {
        key: "external-doc",
        title: "文档",
        isActive: (route) => route.path === "/docs",
      },
    ];

    expect(getActiveMenu(menus, { routeName: "ContractDetail" })?.key).toBe(
      "contract-ledger",
    );
    expect(getActiveMenuKey(menus, { path: "/docs" })).toBe("external-doc");
    expect(getActiveMenuKey(menus, { routeName: "Unknown" })).toBe("");
    expect(getActiveMenu(menus, undefined)).toBeUndefined();
  });

  it("会基于激活菜单计算展开父级 key", () => {
    const menus: BuiltMenuItem[] = [
      {
        key: "contract",
        title: "合同",
        children: [
          {
            key: "contract-ledger",
            title: "合同台账",
            children: [
              {
                key: "contract-detail",
                title: "合同详情",
              },
            ],
          },
        ],
      },
    ];

    expect(getExpandedMenuKeys(menus, "contract-detail")).toEqual([
      "contract",
      "contract-ledger",
    ]);
    expect(getExpandedMenuKeys(menus, "missing")).toEqual([]);
    expect(getExpandedMenuKeys(menus, "")).toEqual([]);
  });
});
