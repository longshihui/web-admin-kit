import type { BuiltMenuItem } from "./types";

export function flattenMenus<TMeta = Record<string, unknown>>(
  menus: readonly BuiltMenuItem<TMeta>[],
): BuiltMenuItem<TMeta>[] {
  return menus.flatMap((menu) => [menu, ...flattenMenus(menu.children ?? [])]);
}

export function createMenuMap<TMeta = Record<string, unknown>>(
  menus: readonly BuiltMenuItem<TMeta>[],
): Map<string, BuiltMenuItem<TMeta>> {
  return new Map(flattenMenus(menus).map((menu) => [menu.key, menu]));
}

export function findMenuByKey<TMeta = Record<string, unknown>>(
  menus: readonly BuiltMenuItem<TMeta>[],
  key: string,
): BuiltMenuItem<TMeta> | undefined {
  for (const menu of menus) {
    if (menu.key === key) {
      return menu;
    }

    const matched = findMenuByKey(menu.children ?? [], key);

    if (matched) {
      return matched;
    }
  }

  return undefined;
}

export function getMenuParents<TMeta = Record<string, unknown>>(
  menus: readonly BuiltMenuItem<TMeta>[],
  key: string,
  parents: BuiltMenuItem<TMeta>[] = [],
): BuiltMenuItem<TMeta>[] {
  for (const menu of menus) {
    if (menu.key === key) {
      return parents;
    }

    const matchedParents = getMenuParents(menu.children ?? [], key, [
      ...parents,
      menu,
    ]);

    if (matchedParents.length > 0) {
      return matchedParents;
    }
  }

  return [];
}
