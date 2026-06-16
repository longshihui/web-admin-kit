import { ID_TYPES } from '../constants/id-type'
import { ID_CARD_PATTERN, PHONE_PATTERN } from '../pattern'
/**
 * 校验证件号
 * @param {string} idType 证件类型
 * @param {string} idNumber 证件号字符串
 * @returns
 */
export function isValidIdNumber(idType: number, idNumber: string) {
  if (typeof idNumber !== 'string' || idNumber.trim() === '') {
    throw new Error('证件号不能为空')
  }

  idNumber = idNumber.trim()

  switch (idType) {
    case ID_TYPES.ID_CARD:
      if (!ID_CARD_PATTERN.test(idNumber)) {
        throw new Error('身份证号不正确')
      }
      break
    case ID_TYPES.PASSPORT:
      break
    case ID_TYPES.HK_AND_MACAO_CARD:
      if (idNumber.length < 9 || idNumber.length > 11) {
        throw new Error('港澳通行证为9-11个字符')
      }

      break
    case ID_TYPES.TAIWAN_CARD:
      if (idNumber.length < 1 || idNumber.length > 18) {
        throw new Error('台胞证为1-18个字符')
      }
      break
  }

  return true
}

/**
 * 校验手机号
 */
export function isValidPhoneNumber(phone: string, areaCode = '86') {
  switch (areaCode) {
    case '86':
      return PHONE_PATTERN.test(phone)
    default:
      return true
  }
}
