import { afterEach, describe, expect, it, vi } from "vitest";
import type { Router } from "vue-router";

import { navigateByMenu } from "./navigator";
import { MENU_TARGET_TYPES } from "./types";
import type { BuiltMenuItem } from "./types";

function createRouter() {
  return {
    push: vi.fn(async () => undefined),
  } as unknown as Router & { push: ReturnType<typeof vi.fn> };
}

describe("navigator", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("路由菜单会调用 router.push", async () => {
    const router = createRouter();
    const menu: BuiltMenuItem = {
      key: "contract-ledger",
      title: "合同台账",
      target: {
        location: { name: "ContractLedger" },
      },
    };

    await navigateByMenu(menu, router);

    expect(router.push).toHaveBeenCalledWith({ name: "ContractLedger" });
  });

  it("显式 route 类型同样会调用 router.push", async () => {
    const router = createRouter();

    await navigateByMenu(
      {
        key: "explicit-route",
        title: "显式路由",
        target: {
          type: MENU_TARGET_TYPES.ROUTE,
          location: { name: "ExplicitRoute" },
        },
      },
      router,
    );

    expect(router.push).toHaveBeenCalledWith({ name: "ExplicitRoute" });
  });

  it("外链菜单会调用注入的 openExternal", async () => {
    const router = createRouter();
    const openExternal = vi.fn();
    const menu: BuiltMenuItem = {
      key: "help",
      title: "帮助中心",
      target: {
        type: MENU_TARGET_TYPES.EXTERNAL,
        href: "https://example.com/help",
      },
    };

    await navigateByMenu(menu, router, { openExternal });

    expect(openExternal).toHaveBeenCalledWith(menu.target);
    expect(router.push).not.toHaveBeenCalled();
  });

  it("动作菜单会执行 actionRegistry 中的处理函数", async () => {
    const router = createRouter();
    const handler = vi.fn(async () => undefined);
    const menu: BuiltMenuItem = {
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

    await navigateByMenu(menu, router, {
      actionRegistry: {
        refreshDashboard: handler,
      },
    });

    expect(handler).toHaveBeenCalledWith({ source: "menu" }, menu);
  });

  it("默认外链打开逻辑支持新窗口和当前窗口", async () => {
    const router = createRouter();
    const open = vi.fn();
    const location = {
      href: "",
    };
    vi.stubGlobal("window", {
      open,
      location,
    });

    await navigateByMenu(
      {
        key: "new-tab",
        title: "新窗口",
        target: {
          type: MENU_TARGET_TYPES.EXTERNAL,
          href: "https://example.com/new-tab",
        },
      },
      router,
    );

    expect(open).toHaveBeenCalledWith(
      "https://example.com/new-tab",
      "_blank",
      "noopener,noreferrer",
    );

    await navigateByMenu(
      {
        key: "same-tab",
        title: "当前窗口",
        target: {
          type: MENU_TARGET_TYPES.EXTERNAL,
          href: "https://example.com/same-tab",
          openInNewTab: false,
        },
      },
      router,
    );

    expect(location.href).toBe("https://example.com/same-tab");
  });

  it("禁用菜单、无 target 菜单不会触发跳转，未注册动作会抛错", async () => {
    const router = createRouter();

    await navigateByMenu(
      {
        key: "disabled",
        title: "禁用",
        disabled: true,
        target: {
          location: { name: "Disabled" },
        },
      },
      router,
    );
    await navigateByMenu({ key: "group", title: "分组" }, router);

    expect(router.push).not.toHaveBeenCalled();

    await expect(
      navigateByMenu(
        {
          key: "missing-action",
          title: "缺失动作",
          target: {
            type: MENU_TARGET_TYPES.ACTION,
            action: "missing",
          },
        },
        router,
      ),
    ).rejects.toThrow("未注册菜单动作：missing");
  });
});
