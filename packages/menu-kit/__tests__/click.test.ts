import { describe, expect, expectTypeOf, it, vi } from "vitest";
import type { RouteLocationRaw } from "vue-router";

import { createMenuClickHandler } from "../src/click";
import { MENU_TARGET_TYPES } from "../src/types";
import type {
  ActionBuiltMenuItem,
  ExternalBuiltMenuItem,
  RouteBuiltMenuItem,
} from "../src/click";
import type { BuiltMenuItem } from "../src/types";

describe("click", () => {
  it("路由菜单会调用 route 策略，并传入完整菜单", () => {
    const route = vi.fn((menu: RouteBuiltMenuItem) => menu.target.location);
    const external = vi.fn();
    const action = vi.fn();
    const menu: RouteBuiltMenuItem = {
      key: "contract-ledger",
      title: "合同台账",
      meta: {
        permissionCode: "clm:contract:list",
      },
      target: {
        location: { name: "ContractLedger" },
      },
    };
    const handleMenuClick = createMenuClickHandler({
      route,
      external,
      action,
    });

    expect(handleMenuClick(menu)).toEqual({ name: "ContractLedger" });
    expect(route).toHaveBeenCalledWith(menu);
    expect(external).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it("省略 target.type 的路由菜单仍会调用 route 策略", () => {
    const route = vi.fn(() => "route-result");
    const handleMenuClick = createMenuClickHandler({
      route,
      external: vi.fn(),
      action: vi.fn(),
    });

    expect(
      handleMenuClick({
        key: "default-route",
        title: "默认路由",
        target: {
          location: { name: "DefaultRoute" },
        },
      }),
    ).toBe("route-result");
    expect(route).toHaveBeenCalledTimes(1);
  });

  it("外链菜单会调用 external 策略", () => {
    const external = vi.fn((menu: ExternalBuiltMenuItem) => menu.target.href);
    const menu: ExternalBuiltMenuItem = {
      key: "help",
      title: "帮助中心",
      target: {
        type: MENU_TARGET_TYPES.EXTERNAL,
        href: "https://example.com/help",
      },
    };
    const handleMenuClick = createMenuClickHandler({
      route: vi.fn(),
      external,
      action: vi.fn(),
    });

    expect(handleMenuClick(menu)).toBe("https://example.com/help");
    expect(external).toHaveBeenCalledWith(menu);
  });

  it("动作菜单会调用 action 策略", () => {
    const action = vi.fn((menu: ActionBuiltMenuItem) => menu.target.payload);
    const menu: ActionBuiltMenuItem = {
      key: "refresh",
      title: "刷新",
      target: {
        type: MENU_TARGET_TYPES.ACTION,
        action: "refreshDashboard",
        payload: {
          source: "menu",
        },
      },
    };
    const handleMenuClick = createMenuClickHandler({
      route: vi.fn(),
      external: vi.fn(),
      action,
    });

    expect(handleMenuClick(menu)).toEqual({ source: "menu" });
    expect(action).toHaveBeenCalledWith(menu);
  });

  it("禁用菜单和无 target 菜单不会调用任何策略", () => {
    const route = vi.fn();
    const external = vi.fn();
    const action = vi.fn();
    const handleMenuClick = createMenuClickHandler({
      route,
      external,
      action,
    });

    expect(
      handleMenuClick({
        key: "disabled",
        title: "禁用菜单",
        disabled: true,
        target: {
          location: { name: "DisabledRoute" },
        },
      }),
    ).toBeUndefined();
    expect(handleMenuClick({ key: "group", title: "分组菜单" })).toBeUndefined();
    expect(route).not.toHaveBeenCalled();
    expect(external).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });

  it("会根据菜单类型推导对应策略返回值", () => {
    const handleMenuClick = createMenuClickHandler({
      route: (menu: RouteBuiltMenuItem) => menu.target.location,
      external: (menu: ExternalBuiltMenuItem) => menu.target.href,
      action: (menu: ActionBuiltMenuItem) => menu.target.action.length,
    });
    const routeMenu: RouteBuiltMenuItem = {
      key: "route",
      title: "路由",
      target: {
        location: { name: "Route" },
      },
    };
    const externalMenu: ExternalBuiltMenuItem = {
      key: "external",
      title: "外链",
      target: {
        type: MENU_TARGET_TYPES.EXTERNAL,
        href: "https://example.com",
      },
    };
    const actionMenu: ActionBuiltMenuItem = {
      key: "action",
      title: "动作",
      target: {
        type: MENU_TARGET_TYPES.ACTION,
        action: "refresh",
        payload: {
          source: "menu",
        },
      },
    };
    const builtMenu: BuiltMenuItem = routeMenu;

    expectTypeOf(handleMenuClick(routeMenu)).toEqualTypeOf<
      RouteLocationRaw | undefined
    >();
    expectTypeOf(handleMenuClick(externalMenu)).toEqualTypeOf<
      string | undefined
    >();
    expectTypeOf(handleMenuClick(actionMenu)).toEqualTypeOf<
      number | undefined
    >();
    expectTypeOf(handleMenuClick(builtMenu)).toEqualTypeOf<
      RouteLocationRaw | string | number | undefined
    >();
  });
});
