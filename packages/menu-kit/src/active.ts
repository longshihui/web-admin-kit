import { getMenuParents } from "./utils";
import type { BuiltMenuItem, MenuRouteMatcher } from "./types";

function isActiveMenu(
  menu: Pick<BuiltMenuItem, "isActive">,
  route: MenuRouteMatcher,
): boolean {
  return menu.isActive?.(route) ?? false;
}

export function getActiveMenu<TMeta = Record<string, unknown>>(
  menus: readonly BuiltMenuItem<TMeta>[],
  route: MenuRouteMatcher | undefined,
): BuiltMenuItem<TMeta> | undefined {
  if (!route) {
    return undefined;
  }

  for (const menu of menus) {
    if (isActiveMenu(menu, route)) {
      return menu;
    }

    const activeChild = getActiveMenu(menu.children ?? [], route);

    if (activeChild) {
      return activeChild;
    }
  }

  return undefined;
}

export function getActiveMenuKey(
  menus: readonly BuiltMenuItem[],
  route: MenuRouteMatcher | undefined,
): string {
  return getActiveMenu(menus, route)?.key ?? "";
}

export function getExpandedMenuKeys<TMeta = Record<string, unknown>>(
  menus: readonly BuiltMenuItem<TMeta>[],
  activeMenuKey: string,
): string[] {
  if (!activeMenuKey) {
    return [];
  }

  return getMenuParents(menus, activeMenuKey).map((menu) => menu.key);
}
