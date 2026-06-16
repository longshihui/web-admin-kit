import type { AppMenuItem, MenuBuildContext } from "./types";

const defaultMenuBuildContext: MenuBuildContext = {};

export function createMenuBuildContext(): MenuBuildContext {
  return defaultMenuBuildContext;
}

export function hasMenuPermission(
  menu: Pick<AppMenuItem, "hasPermission">,
): boolean {
  return menu.hasPermission?.() ?? true;
}

export function isMenuVisible(
  menu: Pick<AppMenuItem, "visible">,
  context: MenuBuildContext,
): boolean {
  if (typeof menu.visible === "function") {
    return menu.visible(context);
  }

  return menu.visible !== false;
}
