# useSnapshotFilters

快照筛选项，通常用于处理一次性提交所有筛选项变更的场景。

使用页面上的表单组件操作`cacheFilters`, 操作完成后通过一个动作将筛选项变更进行**提交**。

业务逻辑中始终使用**已提交的筛选项**。

支持**泛型**



## 如何使用

首先，先确保已经安装相关的包，如果已经安装，则跳过这一步

```bash
pnpm add @colorless/hooks
```

引入该组合式函数

```ts
import { useSnapshotFilters } from '@colorless/hooks'
```

在vue组件中使用该组合式函数

```html
<template>
  <input v-model="cacheFilters.name" />
  <button @click="commit" >提交筛选</button>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  import { useSnapshotFilters } from '@colorless/hooks'

  const filters = ref<{
    name: string
    age: number
  }>({
    name: '',
    age: -1,
  })

  const { cacheFilters, commit } = useSnapshotFilters({
    filters,
  })
</script>
```



## API

### 入参

| 参数名        | 类型                           | 是否可为空 | 默认值                  | 说明                                                         |
| ------------- | ------------------------------ | ---------- | ----------------------- | ------------------------------------------------------------ |
| filters       | `Ref<F>`                       | 否         | -                       | 筛选项数据                                                   |
| defaultValues | `{[K in keyof F]: () => F[K]}` | 是         | filters相关字段的值克隆 | 默认值，重置时会被使用，当没有指定时，将会根据参数filters传入时的值生成快照，当做重置时的默认值 |

### 出参

| 变量名       | 类型         | 说明                                                         |
| ------------ | ------------ | ------------------------------------------------------------ |
| filters      | `Ref<F>`     | 已提交的筛选项                                               |
| cacheFilters | `Ref<F>`     | 缓存的筛选项，页面表单组件使用该数据结构                     |
| reset        | `() => void` | 重置筛选项为默认值，会将cacheFilters和filters的值变更为默认值 |
| commit       | `() => void` | 提交变更，提交后filters的值将会和cacheFilters一致，但不同源  |
| restore      | `() => void` | 取消cacheFilters的变更                                       |



## 类型定义

### UseSnapshotFiltersOptions

```typescript
import type { Ref } from 'vue'

export interface UseSnapshotFiltersOptions<F extends Record<string, unknown>> {
  /**
   * 已提交筛选项数据源
   */
  filters: Ref<F>
  /**
   * 筛选项默认值
   */
  defaultValues?: {
    [K in keyof F]: () => F[K]
  }
}
```

### UseSnapshotFiltersReturn

```typescript
export interface UseSnapshotFiltersReturn<F extends Record<string, unknown>> {
  /**
   * 已提交的筛选项
   */
  filters: Ref<F>
  /**
   * 缓存的筛选项，做为页面上操作的筛选项数据源
   */
  cacheFilters: Ref<F>
  /**
   * 重置筛选为默认值
   */
  reset: () => void
  /**
   * 提交缓存，提交后已提交的筛选项将会和缓存的筛选项一致
   */
  commit: () => void
  /**
   * 恢复缓存的筛选项状态为操作之前的状态
   */
  restore: () => void
}

```
