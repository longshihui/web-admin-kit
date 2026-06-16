import { describe, expect, it } from "vitest";

import {
  createMenuMap,
  findMenuByKey,
  flattenMenus,
  getMenuParents,
} from "./utils";
import type { BuiltMenuItem } from "./types";

const menus: BuiltMenuItem[] = [
  {
    key: "master-data",
    title: "主数据",
    children: [
      {
        key: "internal-subject",
        title: "内部主体",
      },
      {
        key: "contract-type",
        title: "合同类型",
      },
    ],
  },
  {
    key: "contract",
    title: "合同",
  },
];

describe("utils", () => {
  it("会展开菜单树并创建 key 索引", () => {
    expect(flattenMenus(menus).map((menu) => menu.key)).toEqual([
      "master-data",
      "internal-subject",
      "contract-type",
      "contract",
    ]);
    expect(createMenuMap(menus).get("contract-type")?.title).toBe("合同类型");
  });

  it("创建索引时重复 key 会以后出现的菜单为准", () => {
    const menuMap = createMenuMap([
      {
        key: "same",
        title: "旧菜单",
      },
      {
        key: "same",
        title: "新菜单",
      },
    ]);

    expect(menuMap.get("same")?.title).toBe("新菜单");
  });

  it("支持按 key 查找菜单和父级链路", () => {
    expect(findMenuByKey(menus, "internal-subject")?.title).toBe("内部主体");
    expect(findMenuByKey(menus, "missing")).toBeUndefined();
    expect(
      getMenuParents(menus, "contract-type").map((menu) => menu.key),
    ).toEqual(["master-data"]);
    expect(getMenuParents(menus, "missing")).toEqual([]);
  });
});
