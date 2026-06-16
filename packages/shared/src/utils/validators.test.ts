import { describe, expect, it } from 'vitest'

import { ID_TYPES } from '../constants/id-type'
import { isValidIdNumber, isValidPhoneNumber } from './validators'

describe('validators', () => {
  it('validates mainland phone numbers by default', () => {
    expect(isValidPhoneNumber('13800138000')).toBe(true)
    expect(isValidPhoneNumber('123456')).toBe(false)
  })

  it('validates known id card numbers and throws on invalid input', () => {
    expect(isValidIdNumber(ID_TYPES.ID_CARD, '110101199003076111')).toBe(true)
    expect(() => isValidIdNumber(ID_TYPES.ID_CARD, '')).toThrow('证件号不能为空')
    expect(() => isValidIdNumber(ID_TYPES.ID_CARD, '123')).toThrow('身份证号不正确')
  })
})
