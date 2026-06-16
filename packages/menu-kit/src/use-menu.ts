import { computed, toValue } from "vue";
import type { ComputedRef, MaybeRefOrGetter } from "vue";

import { getActiveMenu, getExpandedMenuKeys } from "./active";
import { buildMenus } from "./builder";
import type {
  AppMenuItem,
  BuildMenusOptions,
  BuiltMenuItem,
  MenuRouteMatcher,
} from "./types";

export interface UseMenuOptions extends BuildMenusOptions {
  route?: MaybeRefOrGetter<MenuRouteMatcher | undefined>;
}

export interface UseMenuReturn<TMeta = Record<string, unknown>> {
  menus: ComputedRef<BuiltMenuItem<TMeta>[]>;
  activeMenu: ComputedRef<BuiltMenuItem<TMeta> | undefined>;
  expandedMenuKeys: ComputedRef<string[]>;
}

export function useMenu<TMeta = Record<string, unknown>>(
  menuTree: MaybeRefOrGetter<readonly AppMenuItem<TMeta>[]>,
  options: MaybeRefOrGetter<UseMenuOptions> = {},
): UseMenuReturn<TMeta> {
  const buildOptions = computed<BuildMenusOptions>(() => {
    const optionsValue = toValue(options);

    return {
      keepEmptyGroup: optionsValue.keepEmptyGroup,
    };
  });
  const activeRoute = computed(() => {
    const route = toValue(options).route;

    return route ? toValue(route) : undefined;
  });
  const menus = computed(() =>
    buildMenus(toValue(menuTree), buildOptions.value),
  );
  const activeMenu = computed(() =>
    getActiveMenu(menus.value, activeRoute.value),
  );
  const expandedMenuKeys = computed(() =>
    getExpandedMenuKeys(menus.value, activeMenu.value?.key ?? ""),
  );

  return {
    menus,
    activeMenu,
    expandedMenuKeys,
  };
}
