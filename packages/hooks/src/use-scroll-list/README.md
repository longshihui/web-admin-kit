# useScrollList 说明

处理无限滚动分页的场景，

## 如何使用

首先，先确保已经安装相关的包，如果已经安装，则跳过这一步

```bash
pnpm add @lsh/hooks
```

引入该组合式函数

```ts
import { useScrollList } from '@lsh/hooks'
```

在 Vue 组件中使用该组合式函数

```html
<template>
  <div></div>
</template>

<script setup lang="ts">
  import { useScrollList } from '@lsh/hooks'

  interface Record {
    name: string
    age: number
  }

  const { records, next, previous } = useScrollList<Record>({
    fetchData: async ({ pageNum, pageSize }) => {
      const records: Record[] = []
      const total: number = 0

      // 此处调用后端API获取相关数据

      return {
        records,
        total,
      }
    },
  })
</script>
```

## API

### 入参

<!-- markdownlint-disable MD060 -->
| 参数名          | 类型       | 是否可为空 | 默认值 | 说明                                                                                               |
| :-------------- | :--------- | :--------- | :----- | :------------------------------------------------------------------------------------------------- |
| defaultPageNum  | `number`   | 是         | 10     | 默认的页码                                                                                         |
| defaultPageSize | `number`   | 是         | 1      | 默认每页显示的条数                                                                                 |
| fetchData       | `Function` | 否         | -      | 列表数据源，具体类型参考类型定义 `UseListHookOptions`                                               |
| afterFetch      | `Function` | 是         | -      | 获取数据之后的钩子，具体类型参考类型定义 `UseListHookOptions`                                       |
| beforeFetch     | `Function` | 是         | -      | 获取列表数据前的钩子函数，返回值为 `boolean` 或 `Promise<boolean>`，当返回 `false` 时会阻止获取数据 |
| onError         | `Function` | 是         | -      | 当获取数据失败时执行的钩子函数，具体入参参考类型定义 `UseListHookOptions`                           |
| immediateFetch  | `boolean`  | 是         | true   | 是否设置完 hook 就立即执行拉取                                                                     |

### 出参

| 变量名    | 类型                         | 说明                                 |
| --------- | ---------------------------- | ------------------------------------ |
| records   | `Ref<R[]>`                   | 当前的数据                           |
| total     | `Ref<number>`                | 总条数                               |
| pageNum   | `DeepReadonly<Ref<number>>`  | 页码                                 |
| pageSize  | `Ref<number>`                | 页宽                                 |
| loading   | `Ref<boolean>`               | 是否正在加载中                       |
| isNotMore | `DeepReadonly<Ref<boolean>>` | 是否有下一页                         |
| init      | `() => Promise<void>`        | 执行初始化，相当于刷新当页           |
| reset     | `() => Promise<void>`        | 重置列表，页码、页宽将会恢复为默认值 |
| refresh   | `() => Promise<void>`        | 刷新当页数据                         |
| next      | `() => Promise<void>`        | 下一页                               |
| previous  | `() => Promise<void>`        | 上一页                               |
<!-- markdownlint-enable MD060 -->

## 类型定义

### UseScrollListHookOptions

```typescript
import type { UseListHookOptions } from '@lsh/hooks'
/**
 * useScrollList入参
 */
export type UseScrollListHookOptions<R> = UseListHookOptions<R>
```

### UseScrollListReturn

```typescript
import type { DeepReadonly, Ref } from 'vue'
/**
 * useScrollList的返回值
 */
export interface UseScrollListReturn<R> {
  /**
   * 当前页的数据
   */
  records: Ref<R[]>
  /**
   * 总条数
   */
  total: Ref<number>
  /**
   * 页码
   */
  pageNum: DeepReadonly<Ref<number>>
  /**
   * 页宽
   */
  pageSize: Ref<number>
  /**
   * 是否正在加载中
   */
  loading: Ref<boolean>
  /**
   * 是否有下一页
   */
  isNotMore: DeepReadonly<Ref<boolean>>
  /**
   * 获取数据，相当于刷新当页
   */
  init: () => Promise<void>
  /**
   * 重置列表，页码、页宽将会恢复默认值
   */
  reset: () => Promise<void>
  /**
   * 刷新当页数据
   */
  refresh: () => Promise<void>
  /**
   * 下一页
   */
  next: () => Promise<void>
  /**
   * 上一页
   */
  previous: () => Promise<void>
}

```
