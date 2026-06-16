import {
  createMenuBuildContext,
  hasMenuPermission,
  isMenuVisible,
} from "./permission";
import { resolveMenuKey } from "./key";
import type { AppMenuItem, BuildMenusOptions, BuiltMenuItem } from "./types";

function cloneMenu<TMeta>(menu: AppMenuItem<TMeta>): BuiltMenuItem<TMeta> {
  return {
    ...menu,
    key: resolveMenuKey(menu),
    children: undefined,
  };
}

function sortMenus<TMeta>(
  menus: BuiltMenuItem<TMeta>[],
): BuiltMenuItem<TMeta>[] {
  return [...menus].sort((left, right) => {
    const leftOrder = left.orderNo ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.orderNo ?? Number.MAX_SAFE_INTEGER;

    return leftOrder - rightOrder;
  });
}

export function buildMenus<TMeta = Record<string, unknown>>(
  menus: readonly AppMenuItem<TMeta>[],
  options: BuildMenusOptions = {},
): BuiltMenuItem<TMeta>[] {
  const context = createMenuBuildContext();

  const builtMenus = menus.reduce<BuiltMenuItem<TMeta>[]>((result, menu) => {
    if (!isMenuVisible(menu, context)) {
      return result;
    }

    const current = cloneMenu(menu);
    const children = menu.children?.length
      ? buildMenus(menu.children, options)
      : [];

    if (children.length > 0) {
      current.children = children;
    }

    const hasChildren = children.length > 0;
    const hasTarget = Boolean(current.target);
    const isAllowed = hasMenuPermission(current);

    if (isAllowed && (hasTarget || hasChildren || options.keepEmptyGroup)) {
      result.push(current);
      return result;
    }

    if (hasChildren) {
      result.push(current);
    }

    return result;
  }, []);

  return sortMenus(builtMenus);
}
