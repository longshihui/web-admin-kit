import type { Router } from "vue-router";

import { MENU_TARGET_TYPES } from "./types";
import type {
  BuiltMenuItem,
  MenuActionTarget,
  MenuExternalTarget,
  NavigateMenuOptions,
} from "./types";

function defaultOpenExternal(target: MenuExternalTarget): void {
  if (typeof window === "undefined") {
    return;
  }

  if (target.openInNewTab !== false) {
    window.open(target.href, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.href = target.href;
}

async function runMenuAction(
  menu: BuiltMenuItem,
  target: MenuActionTarget,
  options: NavigateMenuOptions,
): Promise<void> {
  const handler = options.actionRegistry?.[target.action];

  if (!handler) {
    throw new Error(`未注册菜单动作：${target.action}`);
  }

  await handler(target.payload, menu);
}

export async function navigateByMenu(
  menu: BuiltMenuItem,
  router: Router,
  options: NavigateMenuOptions = {},
): Promise<void> {
  if (!menu.target || menu.disabled) {
    return;
  }

  if (!menu.target.type || menu.target.type === MENU_TARGET_TYPES.ROUTE) {
    await router.push(menu.target.location);
    return;
  }

  if (menu.target.type === MENU_TARGET_TYPES.EXTERNAL) {
    const openExternal = options.openExternal ?? defaultOpenExternal;
    openExternal(menu.target);
    return;
  }

  if (menu.target.type === MENU_TARGET_TYPES.ACTION) {
    await runMenuAction(menu, menu.target, options);
  }
}
