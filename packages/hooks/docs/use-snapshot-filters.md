# useSnapshotFilters

`useSnapshotFilters` 用于把筛选项拆成两份状态来管理：

- `filters` 表示已经提交、正在参与业务查询的筛选条件。
- `cacheFilters` 表示用户正在编辑、但尚未提交的筛选条件。

这种模式非常适合高级筛选弹窗、抽屉筛选和批量提交表单。

## 说明

- `commit()` 用于把 `cacheFilters` 提交到 `filters`。
- `restore()` 用于放弃当前编辑，恢复到最近一次已提交状态。
- `reset()` 用于恢复默认值，并同步更新 `filters` 与 `cacheFilters`。

## 安装

```bash
pnpm add @colorless/hooks
```

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { useSnapshotFilters } from '@colorless/hooks'

interface UserFilters {
  keyword: string
  status: 'all' | 'enabled' | 'disabled'
}

const filters = ref<UserFilters>({
  keyword: '',
  status: 'all',
})

const { cacheFilters, commit, reset, restore } = useSnapshotFilters({
  filters,
})
</script>
```

## 常用场景

### 高级筛选弹窗

表单始终绑定 `cacheFilters`。用户点击“确定”时提交，点击“取消”时恢复。

```ts
const filters = ref({
  keyword: '',
  status: 'all',
  departmentId: 0,
})

const { cacheFilters, commit, restore } = useSnapshotFilters({ filters })

const onConfirm = () => {
  commit()
  tableList.reset()
}

const onCancel = () => {
  restore()
}
```

### 自定义默认值

当某些字段的“重置值”不等于初始化值时，可以通过 `defaultValues` 精确声明。

```ts
const filters = ref({
  keyword: '',
  dateRange: [] as string[],
  status: 'all',
})

const { reset } = useSnapshotFilters({
  filters,
  defaultValues: {
    keyword: () => '',
    dateRange: () => [],
    status: () => 'all',
  },
})
```

### 外部同步已提交筛选项

当 `filters` 被外部逻辑更新时，Hook 会自动同步 `cacheFilters`，避免弹窗打开后看到旧值。

```ts
const filters = ref({
  keyword: route.query.keyword ?? '',
  status: 'all',
})

const hook = useSnapshotFilters({ filters })

watch(
  () => route.query.keyword,
  (keyword) => {
    filters.value.keyword = String(keyword ?? '')
  }
)
```

## API 文档

### 函数签名

```ts
function useSnapshotFilters<F extends Record<string, unknown>>(
  options: UseSnapshotFiltersOptions<F>
): UseSnapshotFiltersReturn<F>
```

### 参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `filters` | `Ref<F>` | 是 | - | 已提交的筛选项数据源 |
| `defaultValues` | `{ [K in keyof F]: () => F[K] }` | 否 | 基于初始 `filters.value` 自动生成 | 重置时使用的默认值工厂 |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `filters` | `Ref<F>` | 已提交、参与业务逻辑的筛选项 |
| `cacheFilters` | `Ref<F>` | 当前正在编辑的筛选项副本 |
| `commit` | `() => void` | 提交缓存值到 `filters` |
| `restore` | `() => void` | 放弃编辑，恢复到最近一次提交状态 |
| `reset` | `() => void` | 用默认值重置 `cacheFilters`，并立即同步到 `filters` |

## 边界与注意事项

- Hook 会对 `filters.value` 做深拷贝，避免编辑缓存时直接污染已提交状态。
- `watch(filters, restore, { deep: true })` 会在外部更新 `filters` 时同步刷新 `cacheFilters`。
- 未传 `defaultValues` 时，默认值来自创建 Hook 时的初始 `filters.value` 快照，而不是每次 `reset()` 时的当前值。
- `reset()` 会立即调用 `commit()`，所以重置后业务查询侧看到的是新默认值，而不是旧提交值。
