import { describe, expect, it } from 'vitest'

import { PermissionCalculateMode } from '../src/constants'
import { definePermissionCalculator, normalizeCalculator, normalizeCodes } from '../src/helpers'

describe('permission helpers', () => {
  it('normalizes a single permission code to an array', () => {
    expect(normalizeCodes('user:read')).toEqual(['user:read'])
    expect(normalizeCodes(['user:read', 'user:write'])).toEqual(['user:read', 'user:write'])
  })

  it('normalizes built-in calculator modes', () => {
    const andCalculator = normalizeCalculator(PermissionCalculateMode.AND)
    const orCalculator = normalizeCalculator(PermissionCalculateMode.OR)

    expect(andCalculator(['a', 'b'], ['a', 'b', 'c'])).toBe(true)
    expect(andCalculator(['a', 'b'], ['a'])).toBe(false)
    expect(orCalculator(['a', 'b'], ['b'])).toBe(true)
    expect(orCalculator(['a', 'b'], ['c'])).toBe(false)
  })

  it('keeps a custom calculator unchanged', () => {
    const calculator = definePermissionCalculator((targetCodes, storeCodes) =>
      targetCodes.every((code) => storeCodes.includes(code))
    )

    expect(normalizeCalculator(calculator)).toBe(calculator)
  })
})
