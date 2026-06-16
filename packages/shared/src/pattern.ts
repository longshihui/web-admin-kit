// 只允许输入a-z A-Z 0-9 下划线与中文字符 且 长度为3-20
export const NICK_NAME_PATTERN = /^([a-zA-Z0-9_\u4e00-\u9fa5]{3,20})$/

// 电话号码校验
export const PHONE_PATTERN = /^1\d{10}$/

// 邮箱地址校验
export const EMAIL_PATTERN = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

// 密码规则：7-15位，必须包含大小写字母、数字、特殊字符
export const PASSWORD_PATTERN = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{7,15}$'
)
// 身份证校验正则
export const ID_CARD_PATTERN = /^((\d{18})|([0-9x]{18})|([0-9X]{18}))$/
// URL模式
export const URL_PATTERN = /^http(s)?:\/\/(.+?\/?)+(\?.+?)?$/
