# hooks API 文档

## 导出总览

`@lsh/hooks` 导出分页列表、滚动列表、筛选快照、片段记录和可等待弹层相关 Hook。

```ts
import {
  useAwaitablePopup,
  useFragmentRecords,
  useList,
  useScrollList,
  useSnapshotFilters,
} from '@lsh/hooks'
```

## `useList(options)`

分页列表基础 Hook。

```ts
const { loading, pageNum, pageSize, records, refresh, reset, total } = useList({
  fetchData: async ({ pageNum, pageSize }) => ({
    records: [],
    total: 0,
  }),
})
```

核心能力：

- 自动维护 `loading`。
- 自动监听页码和页宽变化后重新请求。
- 提供 `init()`、`refresh()`、`reset()`。
- 支持请求前后钩子和错误处理。

## `useScrollList(options)`

滚动分页 Hook，在 `useList()` 基础上增加“下一页 / 上一页 / 是否到底”的语义。

```ts
const { isNotMore, next, previous, records } = useScrollList({
  fetchData: async ({ pageNum, pageSize }) => ({
    records: [],
    total: 0,
  }),
})
```

适用场景：

- 无限滚动。
- 分段加载日志流。
- 瀑布流或时间线数据拼接。

## `useSnapshotFilters(options)`

筛选条件快照管理 Hook。

```ts
const { cacheFilters, commit, reset, restore } = useSnapshotFilters({
  filters,
})
```

核心能力：

- 维护可编辑的 `cacheFilters`。
- `commit()` 提交暂存筛选条件。
- `reset()` 重置为默认值。
- `restore()` 从源筛选条件恢复。

## `useFragmentRecords<Record>()`

片段记录管理 Hook。

```ts
const { append, clear, records, remove, replace } = useFragmentRecords<User>()
```

核心能力：

- 按片段索引维护记录集。
- 自动按索引顺序拼接最终结果。
- 支持追加、替换、清空和截断。

## `useAwaitablePopup<R>()`

把弹层交互建模为 Promise。

```ts
const popup = useAwaitablePopup<string>()

const result = await popup.open()

if (!result.isCancel) {
  console.log(result.data)
}
```

返回值：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `open` | `() => Promise<AwaitedResult<R>>` | 打开并等待结果 |
| `commit` | `(data: R) => void` | 确认并返回结果 |
| `cancel` | `() => void` | 取消并返回空结果 |

## 类型

### `AwaitedResult<R>`

```ts
interface AwaitedResult<R> {
  isCancel: boolean
  data: R | null
}
```
