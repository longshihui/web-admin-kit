# useScrollList

`useScrollList` 在 `useList` 的基础上增加了滚动加载需要的结果拼接与翻页控制能力，适合无限滚动、日志流和时间线等“多页数据要合并为一个列表”的场景。

## 说明

- 复用 `useList` 的分页请求能力和参数结构。
- 通过内部的 `useFragmentRecords` 按页码保存分片，再合并为最终的 `records`。
- 提供 `next()`、`previous()` 和 `isNotMore`，用于控制前后翻页和结束状态。

## 安装

```bash
pnpm add @colorless/hooks
```

## 基础用法

```vue
<script setup lang="ts">
import { useScrollList } from '@colorless/hooks'

interface ActivityRecord {
  id: string
  title: string
}

const {
  isNotMore,
  loading,
  next,
  pageNum,
  records,
} = useScrollList<ActivityRecord>({
  fetchData: async ({ pageNum, pageSize }) => {
    const response = await fetch(`/api/activity?pageNum=${pageNum}&pageSize=${pageSize}`)
    const data = (await response.json()) as {
      records: ActivityRecord[]
      total: number
    }

    return data
  },
})
</script>
```

## 常用场景

### 无限滚动列表

在滚动到底部时调用 `next()`，Hook 会等待当前请求完成，再继续加载下一页。

```ts
const { isNotMore, loading, next, records } = useScrollList<MessageRecord>({
  fetchData: ({ pageNum, pageSize }) =>
    messageApi.getHistory({
      pageNum,
      pageSize,
      sessionId: currentSessionId.value,
    }),
})

const onReachBottom = async () => {
  if (loading.value || isNotMore.value) {
    return
  }

  await next()
}
```

### 切换筛选条件后重置滚动结果

当筛选条件变化时，重新调用 `reset()`，旧片段会先被清空，再从默认页码开始请求。

```ts
const list = useScrollList<LogRecord>({
  fetchData: ({ pageNum, pageSize }) =>
    logApi.getList({
      pageNum,
      pageSize,
      level: currentLevel.value,
    }),
})

watch(currentLevel, async () => {
  await list.reset()
})
```

### 回溯上一页

`previous()` 会把页码向前移动一页，并等待请求完成；已经缓存的片段会按新的页码范围重新组合。

```ts
const { previous, pageNum } = useScrollList<TimelineItem>({
  fetchData: ({ pageNum, pageSize }) =>
    timelineApi.getList({ pageNum, pageSize }),
})

if (pageNum.value > 1) {
  await previous()
}
```

## API 文档

### 函数签名

```ts
function useScrollList<R>(options: UseScrollListHookOptions<R>): UseScrollListReturn<R>
```

### 参数

`useScrollList` 的参数与 `useList` 一致：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `fetchData` | `({ pageNum, pageSize }) => Promise<{ records: R[]; total: number }> \| { records: R[]; total: number }` | 是 | - | 分页数据源 |
| `defaultPageNum` | `number` | 否 | `1` | 默认页码 |
| `defaultPageSize` | `number` | 否 | `10` | 默认每页条数 |
| `beforeFetch` | `() => boolean \| Promise<boolean>` | 否 | - | 请求前钩子；返回 `false` 时取消本次请求 |
| `afterFetch` | `(records: R[]) => void` | 否 | - | 请求成功回调；这里拿到的是已合并后的 `records` |
| `onError` | `(error: unknown) => void` | 否 | - | 请求失败回调 |
| `immediateFetch` | `boolean` | 否 | `true` | 是否自动发起首次请求 |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `records` | `Ref<R[]>` | 已按页码顺序合并后的记录集 |
| `total` | `Ref<number>` | 总条数 |
| `pageNum` | `DeepReadonly<Ref<number>>` | 当前页码，只读 |
| `pageSize` | `Ref<number>` | 每页条数 |
| `loading` | `Ref<boolean>` | 是否正在请求中 |
| `isNotMore` | `DeepReadonly<Ref<boolean>>` | 是否已经没有更多数据 |
| `init` | `() => Promise<void>` | 刷新当前页对应片段 |
| `refresh` | `() => Promise<void>` | `init` 的别名 |
| `reset` | `() => Promise<void>` | 清空已有片段并回到默认页码重新请求 |
| `next` | `() => Promise<void>` | 加载下一页并等待请求完成 |
| `previous` | `() => Promise<void>` | 回到上一页并等待请求完成 |

## 边界与注意事项

- `pageNum` 是只读的，外部应通过 `next()`、`previous()` 或 `reset()` 控制翻页。
- `next()` 和 `previous()` 会先等待当前请求结束，避免并发翻页导致状态错乱。
- `isNotMore` 的计算规则是 `pageNum * pageSize >= total`。
- `reset()` 会清空已缓存的片段，再重新从默认页开始加载。
- 如果你的场景不需要合并多页记录，只需要标准分页，请优先使用 `useList`。
