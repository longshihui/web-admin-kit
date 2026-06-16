import { and, or } from './calculator'
import { PermissionCalculateMode } from './constants'
import type { PermissionCalculator, PermissionCode } from './types'

/**
 * 统一化权限点数据结构
 */
export function normalizeCodes(codes: PermissionCode | PermissionCode[]) {
  if (Array.isArray(codes)) {
    return codes
  }

  return [codes]
}

/**
 * 正常化权限计算器
 */
export function normalizeCalculator(
  calculator: PermissionCalculateMode | PermissionCalculator | undefined
): PermissionCalculator {
  if (calculator === PermissionCalculateMode.AND) {
    return and
  }

  if (calculator === PermissionCalculateMode.OR) {
    return or
  }

  if (typeof calculator === 'function') {
    return calculator
  }

  return and
}

export function definePermissionCalculator(calculator: PermissionCalculator) {
  return calculator
}
