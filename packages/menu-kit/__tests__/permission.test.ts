import { describe, expect, it } from "vitest";

import {
  createMenuBuildContext,
  hasMenuPermission,
  isMenuVisible,
} from "../src/permission";

describe("permission", () => {
  it("hasPermission 未配置时默认放行，配置后使用函数返回值", () => {
    expect(hasMenuPermission({})).toBe(true);
    expect(hasMenuPermission({ hasPermission: () => true })).toBe(true);
    expect(hasMenuPermission({ hasPermission: () => false })).toBe(false);
  });

  it("支持 visible 布尔值和函数", () => {
    const context = createMenuBuildContext();

    expect(isMenuVisible({}, context)).toBe(true);
    expect(isMenuVisible({ visible: false }, context)).toBe(false);
    expect(isMenuVisible({ visible: () => true }, context)).toBe(true);
  });
});
