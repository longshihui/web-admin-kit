# `@colorless/hooks`

共享组合式函数包，负责沉淀项目间可复用的 Vue Hook，覆盖分页列表、滚动加载、筛选快照、片段记录和可等待弹层等常见场景。

## 快速开始

```bash
pnpm add @colorless/hooks
```

### 列表拉取

```ts
import { useList } from '@colorless/hooks'

const { loading, pageNum, pageSize, records, refresh, total } = useList({
  fetchData: async ({ pageNum, pageSize }) => {
    const response = await fetch(`/api/users?pageNum=${pageNum}&pageSize=${pageSize}`)
    const data = await response.json()

    return {
      records: data.records,
      total: data.total,
    }
  },
})
```

### 滚动加载

```ts
import { useScrollList } from '@colorless/hooks'

const { records, next, isNotMore } = useScrollList({
  fetchData: async ({ pageNum, pageSize }) => {
    const response = await fetch(`/api/logs?pageNum=${pageNum}&pageSize=${pageSize}`)
    const data = await response.json()

    return {
      records: data.records,
      total: data.total,
    }
  },
})
```

### 可等待弹层

```ts
import { useAwaitablePopup } from '@colorless/hooks'

const popup = useAwaitablePopup<string>()

const result = await popup.open()

if (!result.isCancel) {
  console.log(result.data)
}
```

## 文档

- [概览](./docs/README.md)
- [目录与选型](./docs/catalog.md)
- [useList](./docs/use-list.md)
- [useScrollList](./docs/use-scroll-list.md)
- [useSnapshotFilters](./docs/use-snapshot-filters.md)
- [useFragmentRecords](./docs/use-fragment-records.md)
- [useAwaitablePopup](./docs/use-awaitable-popup.md)
