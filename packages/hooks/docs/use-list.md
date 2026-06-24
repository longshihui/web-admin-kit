# useList

`useList` 是 `@colorless/hooks` 中的分页列表基础 Hook，用于统一管理分页查询最常见的状态和动作，包括 `loading`、`pageNum`、`pageSize`、`records`、`total`、`refresh()` 与 `reset()`。

## 说明

- 适合标准分页列表、表格页和弹窗内分页数据。
- 通过 `fetchData` 抽象数据源，不耦合具体请求库。
- 默认会在创建 Hook 后立即发起一次查询。

## 安装

```bash
pnpm add @colorless/hooks
```

## 基础用法

```vue
<script setup lang="ts">
import { useList } from '@colorless/hooks'

interface UserRecord {
  id: number
  name: string
}

const {
  loading,
  pageNum,
  pageSize,
  records,
  total,
  refresh,
  reset,
} = useList<UserRecord>({
  fetchData: async ({ pageNum, pageSize }) => {
    const response = await fetch(`/api/users?pageNum=${pageNum}&pageSize=${pageSize}`)
    const data = (await response.json()) as {
      records: UserRecord[]
      total: number
    }

    return data
  },
})
</script>
```

## 常用场景

### 表格查询页

适合后台管理中的标准分页列表。修改 `pageNum` 或 `pageSize` 后，Hook 会自动重新请求数据。

```ts
const { loading, pageNum, pageSize, records, total } = useList<OrderRecord>({
  fetchData: ({ pageNum, pageSize }) =>
    orderApi.getList({
      pageNum,
      pageSize,
      status: currentStatus.value,
    }),
})
```

### 手动控制首次请求

当页面还依赖权限、路由参数或筛选条件初始化时，可以关闭自动请求，等待条件准备好后再调用 `init()`。

```ts
const { init, records } = useList<ProjectRecord>({
  immediateFetch: false,
  fetchData: ({ pageNum, pageSize }) =>
    projectApi.getList({
      pageNum,
      pageSize,
      tenantId: activeTenantId.value,
    }),
})

await init()
```

### 请求前校验与错误兜底

`beforeFetch` 返回 `false` 时会阻止本次请求；`onError` 用于统一兜底错误处理。

```ts
const list = useList<TaskRecord>({
  beforeFetch: () => Boolean(currentWorkspaceId.value),
  onError: (error) => {
    console.error('加载任务列表失败', error)
  },
  fetchData: ({ pageNum, pageSize }) =>
    taskApi.getList({
      pageNum,
      pageSize,
      workspaceId: currentWorkspaceId.value!,
    }),
})
```

## API 文档

### 函数签名

```ts
function useList<R>(options: UseListHookOptions<R>): UseListReturn<R>
```

### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `fetchData` | `({ pageNum, pageSize }) => Promise<{ records: R[]; total: number }> \| { records: R[]; total: number }` | 是 | - | 列表数据源，必须返回当前页记录和总条数 |
| `defaultPageNum` | `number` | 否 | `1` | 默认页码 |
| `defaultPageSize` | `number` | 否 | `10` | 默认每页条数 |
| `beforeFetch` | `() => boolean \| Promise<boolean>` | 否 | - | 请求前钩子；返回 `false` 时取消本次请求 |
| `afterFetch` | `(records: R[]) => void` | 否 | - | 请求成功后的回调，参数是当前页记录 |
| `onError` | `(error: unknown) => void` | 否 | - | 请求失败回调；未提供时会输出 `console.warn(error)` |
| `immediateFetch` | `boolean` | 否 | `true` | 是否在创建 Hook 后立即执行首次请求 |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `records` | `Ref<R[]>` | 当前页记录 |
| `total` | `Ref<number>` | 总条数 |
| `pageNum` | `Ref<number>` | 当前页码 |
| `pageSize` | `Ref<number>` | 当前每页条数 |
| `loading` | `Ref<boolean>` | 是否正在请求中 |
| `init` | `() => Promise<void>` | 执行查询，等价于刷新当前页 |
| `refresh` | `() => Promise<void>` | `init` 的别名 |
| `reset` | `() => Promise<void>` | 重置页码和页大小为默认值；如果原值未变化，则会主动重新请求 |

## 边界与注意事项

- `pageNum` 或 `pageSize` 变更后会自动触发请求，不需要额外手动调用 `refresh()`。
- `afterFetch` 拿到的是当前页记录，不是历史累计结果。
- `reset()` 会把 `pageNum` 和 `pageSize` 恢复到默认值；如果本来就是默认值，也会主动再拉取一次数据。
- `useList` 不负责缓存历史页数据；如果需要多页拼接，请使用 `useScrollList`。
