export enum Markets {
  // 三亚国际免税城
  SANYA_INTERNATIONAL_DUTY_FREE = '6868',
  // 海口国际免税城
  HAIKOU_INTERNATIONAL_DUTY_FREE = '7048',
}

export const MarketOptions = [
  {
    label: '三亚国际免税城',
    value: Markets.SANYA_INTERNATIONAL_DUTY_FREE,
  },
  {
    label: '海口国际免税城',
    value: Markets.HAIKOU_INTERNATIONAL_DUTY_FREE,
  },
  {
    label: '三亚凤凰机场免税店',
    value: '7016',
  },
  {
    label: '电商会员购',
    value: '7017',
  },
  {
    label: '电商免税预定',
    value: '7018',
  },
  {
    label: '博鳌免税店',
    value: '6921',
  },
  {
    label: '海口市内免税店',
    value: '6922',
  },
  {
    label: '海口美兰机场免税店',
    value: '6132',
  },
]
/**
 * 将门店编码转化为文字
 */
export function translateMarket(code: string) {
  return MarketOptions.find((market) => market.value === code)?.label
}
