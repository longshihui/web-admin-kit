import { MENU_TARGET_TYPES } from "./types";
import type {
  BuiltMenuItem,
  MenuActionTarget,
  MenuExternalTarget,
  MenuRouteTarget,
} from "./types";

export type RouteBuiltMenuItem<TMeta = Record<string, unknown>> = Omit<
  BuiltMenuItem<TMeta>,
  "target"
> & {
  target: MenuRouteTarget;
};

export type ExternalBuiltMenuItem<TMeta = Record<string, unknown>> = Omit<
  BuiltMenuItem<TMeta>,
  "target"
> & {
  target: MenuExternalTarget;
};

export type ActionBuiltMenuItem<TMeta = Record<string, unknown>> = Omit<
  BuiltMenuItem<TMeta>,
  "target"
> & {
  target: MenuActionTarget;
};

export interface MenuClickStrategies<
  TMeta = Record<string, unknown>,
  TRouteResult = void,
  TExternalResult = void,
  TActionResult = void,
> {
  route: (menu: RouteBuiltMenuItem<TMeta>) => TRouteResult;
  external: (menu: ExternalBuiltMenuItem<TMeta>) => TExternalResult;
  action: (menu: ActionBuiltMenuItem<TMeta>) => TActionResult;
}

export interface MenuClickHandler<
  TMeta = Record<string, unknown>,
  TRouteResult = void,
  TExternalResult = void,
  TActionResult = void,
> {
  (menu: RouteBuiltMenuItem<TMeta>): TRouteResult | undefined;
  (menu: ExternalBuiltMenuItem<TMeta>): TExternalResult | undefined;
  (menu: ActionBuiltMenuItem<TMeta>): TActionResult | undefined;
  (
    menu: BuiltMenuItem<TMeta>,
  ): TRouteResult | TExternalResult | TActionResult | undefined;
}

export function createMenuClickHandler<
  TMeta = Record<string, unknown>,
  TRouteResult = void,
  TExternalResult = void,
  TActionResult = void,
>(
  strategies: MenuClickStrategies<
    TMeta,
    TRouteResult,
    TExternalResult,
    TActionResult
  >,
): MenuClickHandler<TMeta, TRouteResult, TExternalResult, TActionResult> {
  return ((menu: BuiltMenuItem<TMeta>) => {
    if (menu.disabled || !menu.target) {
      return undefined;
    }

    if (!menu.target.type || menu.target.type === MENU_TARGET_TYPES.ROUTE) {
      return strategies.route(menu as RouteBuiltMenuItem<TMeta>);
    }

    if (menu.target.type === MENU_TARGET_TYPES.EXTERNAL) {
      return strategies.external(menu as ExternalBuiltMenuItem<TMeta>);
    }

    if (menu.target.type === MENU_TARGET_TYPES.ACTION) {
      return strategies.action(menu as ActionBuiltMenuItem<TMeta>);
    }

    return undefined;
  }) as MenuClickHandler<TMeta, TRouteResult, TExternalResult, TActionResult>;
}
