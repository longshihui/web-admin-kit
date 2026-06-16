import type { NavigationGuard, RouteLocationNormalized, RouteRecordName } from 'vue-router'

import type { PermissionSDK } from '../sdk'
import type { PermissionOptions } from '../types'

// 守卫工厂的入参
interface PermissionRouterGuardOptions {
  // 白名单的路由名
  excludes?: RouteRecordName[]
  getPermissionOptions: (to: RouteLocationNormalized) => PermissionOptions | undefined
  // 当没有权限时，会执行该钩子
  onDenied: NavigationGuard
}

// 守卫的工厂函数
interface PermissionRouterGuardFactory {
  (sdk: PermissionSDK, options: PermissionRouterGuardOptions): NavigationGuard
}

/**
 * 创建路由权限守卫
 */
export const createPermissionRouterGuard: PermissionRouterGuardFactory = function (
  sdk: PermissionSDK,
  options: PermissionRouterGuardOptions
) {
  return async (to, from, next) => {
    const { excludes, getPermissionOptions, onDenied } = options
    const whiteList = Array.isArray(excludes) ? excludes : []

    // 当为白名单时，则无需进行权限控制
    if (to.name && whiteList.includes(to.name)) {
      next()
      return
    }

    await sdk.whenInitialed()

    const routePermission = getPermissionOptions(to)

    if (typeof routePermission === 'undefined' || sdk.hasPermission(routePermission)) {
      next()
      return
    }

    onDenied(to, from, next)
  }
}
