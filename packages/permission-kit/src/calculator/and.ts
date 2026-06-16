import type { PermissionCalculator } from '../types'

export const and: PermissionCalculator = (targetCodes, storeCodes) => {
  return targetCodes.every((code) => storeCodes.includes(code))
}
