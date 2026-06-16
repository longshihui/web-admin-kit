import { PermissionCalculateMode } from './constants'

// 权限点
export type PermissionCode = string

// 权限计算器
export interface PermissionCalculator {
  (targetCodes: PermissionCode[], storeCodes: PermissionCode[]): boolean
}

export interface PermissionCommonProps {
  codes: PermissionCode | PermissionCode[]
  /**
   * 权限的计算
   * 默认为 and
   * and 为与的关系, 当指定资源点都满足的情况下授权
   * or 为或的关系，当指定资源点满足其一即可授权
   * custom 自定义计算，需指定计算函数，计算函数返回true代表授权，false为拒绝授权
   */
  calculator?: PermissionCalculateMode | PermissionCalculator
}

export type PermissionOptions = PermissionCode | PermissionCode[] | PermissionCommonProps

export interface PermissionListener {
  (newCodes: PermissionCode[], oldCodes: PermissionCode[]): void
}
