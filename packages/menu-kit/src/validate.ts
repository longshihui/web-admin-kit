import { MENU_TARGET_TYPES } from "./types";
import type { AppMenuItem, MenuValidationIssue } from "./types";

interface ValidateMenusOptions {
  routeNames?: readonly string[];
}

function collectIssues<TMeta>(
  menus: readonly AppMenuItem<TMeta>[],
  options: ValidateMenusOptions,
  keySet: Set<string>,
  issues: MenuValidationIssue[],
): void {
  menus.forEach((menu) => {
    if (menu.key && keySet.has(menu.key)) {
      issues.push({
        type: "error",
        menuKey: menu.key,
        message: `菜单 key 重复：${menu.key}`,
      });
    }

    if (menu.key) {
      keySet.add(menu.key);
    }

    if (!menu.target && !menu.children?.length) {
      issues.push({
        type: "warning",
        menuKey: menu.key,
        message: "菜单没有 target，也没有子菜单",
      });
    }

    if (menu.target?.type === MENU_TARGET_TYPES.EXTERNAL && !menu.target.href) {
      issues.push({
        type: "error",
        menuKey: menu.key,
        message: "外链菜单缺少 href",
      });
    }

    if (
      menu.target &&
      (!menu.target.type || menu.target.type === MENU_TARGET_TYPES.ROUTE) &&
      options.routeNames
    ) {
      const location = menu.target.location;
      const routeName =
        typeof location === "object" && "name" in location
          ? location.name
          : undefined;

      if (routeName && !options.routeNames.includes(String(routeName))) {
        issues.push({
          type: "error",
          menuKey: menu.key,
          message: `菜单引用的路由不存在：${String(routeName)}`,
        });
      }
    }

    collectIssues(menu.children ?? [], options, keySet, issues);
  });
}

export function validateMenus<TMeta = Record<string, unknown>>(
  menus: readonly AppMenuItem<TMeta>[],
  options: ValidateMenusOptions = {},
): MenuValidationIssue[] {
  const issues: MenuValidationIssue[] = [];

  collectIssues(menus, options, new Set<string>(), issues);

  return issues;
}
