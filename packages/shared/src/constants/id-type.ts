/**
 * 证件类型枚举值
 * 来源EOP
 */

// 证件类型枚举
export enum ID_TYPES {
  // 护照
  PASSPORT = 1,
  // 中国大陆身份证
  ID_CARD = 2,
  // 港澳通行证
  HK_AND_MACAO_CARD = 3,
  // 台胞证
  TAIWAN_CARD = 4,
  // 其他
  OTHER = 5,
  // 永居证
  PERMANENT_RESIDENT = 6,
  // 往来港澳通行证
  HK_MACAO_TRAVEL_PERMIT = 7,
  // 往来台湾通行证
  TAIWAN_TRAVEL_PERMIT = 8,
}

// 证件类型选项
export const IDTypesOptions = [
  { value: ID_TYPES.ID_CARD, label: '身份证' },
  { value: ID_TYPES.PASSPORT, label: '护照' },
  { value: ID_TYPES.HK_AND_MACAO_CARD, label: '港澳通行证' },
  { value: ID_TYPES.TAIWAN_CARD, label: '台胞证' },
  { value: ID_TYPES.PERMANENT_RESIDENT, label: '永居证' },
  { value: ID_TYPES.HK_MACAO_TRAVEL_PERMIT, label: '往来港澳通行证' },
  { value: ID_TYPES.TAIWAN_TRAVEL_PERMIT, label: '往来台湾通行证' },
  { value: ID_TYPES.OTHER, label: '其他' },
]

export function translateIDType(type: number) {
  return IDTypesOptions.find((opt) => opt.value === type)?.label
}
