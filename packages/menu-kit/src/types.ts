import type { VNode } from "vue";
import type { RouteLocationRaw } from "vue-router";

export const MENU_TARGET_TYPES = {
  ROUTE: "route",
  EXTERNAL: "external",
  ACTION: "action",
} as const;

export type MenuTargetType =
  (typeof MENU_TARGET_TYPES)[keyof typeof MENU_TARGET_TYPES];

export type MenuRouteTarget = {
  type?: typeof MENU_TARGET_TYPES.ROUTE;
  location: RouteLocationRaw;
};

export type MenuExternalTarget = {
  type: typeof MENU_TARGET_TYPES.EXTERNAL;
  href: string;
  openInNewTab?: boolean;
};

export type MenuActionTarget<TPayload = unknown> = {
  type: typeof MENU_TARGET_TYPES.ACTION;
  action: string;
  payload?: TPayload;
};

export type MenuTarget<TPayload = unknown> =
  | MenuRouteTarget
  | MenuExternalTarget
  | MenuActionTarget<TPayload>;

export type MenuBuildContext = Record<string, never>;

export interface AppMenuItem<TMeta = Record<string, unknown>> {
  key?: string;
  title: string;
  icon?: VNode;
  orderNo?: number;
  target?: MenuTarget;
  hasPermission?: () => boolean;
  isActive?: (route: MenuRouteMatcher) => boolean;
  visible?: boolean | ((context: MenuBuildContext) => boolean);
  disabled?: boolean;
  children?: readonly AppMenuItem<TMeta>[];
  meta?: TMeta;
}

export interface BuiltMenuItem<TMeta = Record<string, unknown>> extends Omit<
  AppMenuItem<TMeta>,
  "children" | "key" | "visible"
> {
  key: string;
  children?: BuiltMenuItem<TMeta>[];
}

export interface BuildMenusOptions {
  keepEmptyGroup?: boolean;
}

export interface MenuActionHandler<TPayload = unknown> {
  (payload: TPayload | undefined, menu: BuiltMenuItem): void | Promise<void>;
}

export type MenuActionRegistry = Record<string, MenuActionHandler>;

export interface NavigateMenuOptions {
  actionRegistry?: MenuActionRegistry;
  openExternal?: (target: MenuExternalTarget) => void;
}

export interface MenuRouteMatcher {
  routeName?: string | symbol | null;
  path?: string;
}

export interface MenuValidationIssue {
  type: "error" | "warning";
  message: string;
  menuKey?: string;
}
