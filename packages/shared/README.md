# `@lsh/shared`

共享基础能力包，负责沉淀项目间通用的类型、常量、正则表达式和校验工具。

## 快速开始

```bash
pnpm add @lsh/shared
```

### 使用常量与工具

```ts
import {
  ID_TYPES,
  IDTypesOptions,
  PhoneAreaOptions,
  isValidIdNumber,
  isValidPhoneNumber,
  translateAreaCode,
  translateIDType,
} from '@lsh/shared'

console.log(IDTypesOptions)
console.log(translateIDType(ID_TYPES.ID_CARD))
console.log(translateAreaCode('86'))
console.log(isValidPhoneNumber('13800138000'))
console.log(isValidIdNumber(ID_TYPES.ID_CARD, '110101199003076111'))
```

### 使用通用分页类型

```ts
import type { ListRequest, ListResponse } from '@lsh/shared'

interface UserRow {
  id: string
  name: string
}

type UserListRequest = ListRequest<{ keyword?: string }>
type UserListResponse = ListResponse<UserRow>
```

## 文档

- [整体设计](./docs/design.md)
- [API 文档](./docs/api.md)
