import type { PermissionCalculator } from '../types'

export const or: PermissionCalculator = (targetCodes, storeCodes) => {
  return targetCodes.some((code) => storeCodes.includes(code))
}
