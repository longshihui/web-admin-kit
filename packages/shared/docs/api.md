# shared API 文档

## 导出总览

`@lsh/shared` 导出通用分页类型、证件类型常量、电话区号数据、常用正则表达式和基础校验工具。

```ts
import {
  EMAIL_PATTERN,
  ID_CARD_PATTERN,
  ID_TYPES,
  IDTypesOptions,
  NICK_NAME_PATTERN,
  PASSWORD_PATTERN,
  PHONE_PATTERN,
  PhoneArea,
  PhoneAreaOptions,
  PhoneAreaWithCodeOptions,
  URL_PATTERN,
  isValidIdNumber,
  isValidPhoneNumber,
  translateAreaCode,
  translateIDType,
} from '@lsh/shared'
```

## 类型

### `ListResponse<Row>`

分页响应结构。

```ts
interface ListResponse<Row> {
  pageNum: number
  pageSize: number
  pages: number
  total: number
  records: Row[]
}
```

### `ListRequest<T>`

分页请求结构。

```ts
type ListRequest<T> = T & { pageNum: number; pageSize: number }
```

## 常量

### `ID_TYPES`

证件类型枚举。

```ts
ID_TYPES.PASSPORT
ID_TYPES.ID_CARD
ID_TYPES.HK_AND_MACAO_CARD
ID_TYPES.TAIWAN_CARD
```

### `IDTypesOptions`

证件类型选项数组，适合表单选择器使用。

### `translateIDType(type)`

把证件类型值翻译成中文标签。

```ts
translateIDType(ID_TYPES.ID_CARD) // 身份证
```

### `PhoneArea`

完整国际电话区号数据源。

### `PhoneAreaOptions`

电话区号选项数组。

### `PhoneAreaWithCodeOptions`

包含 `+区号` 文案的电话区号选项数组。

### `translateAreaCode(code)`

把电话区号翻译成地区名称。

```ts
translateAreaCode('86') // 中国
```

## 正则表达式

### `NICK_NAME_PATTERN`

昵称校验正则。

### `PHONE_PATTERN`

中国大陆手机号校验正则。

### `EMAIL_PATTERN`

邮箱格式校验正则。

### `PASSWORD_PATTERN`

密码强度校验正则。

### `ID_CARD_PATTERN`

身份证号格式校验正则。

### `URL_PATTERN`

HTTP / HTTPS 地址校验正则。

## 工具函数

### `isValidIdNumber(idType, idNumber)`

校验证件号。校验失败时抛出错误，校验通过返回 `true`。

```ts
isValidIdNumber(ID_TYPES.ID_CARD, '110101199003076111')
```

### `isValidPhoneNumber(phone, areaCode?)`

校验手机号。默认按中国大陆区号 `86` 校验。

```ts
isValidPhoneNumber('13800138000')
isValidPhoneNumber('13800138000', '86')
```
