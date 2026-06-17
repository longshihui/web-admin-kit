# useList

此组合式函数封装了**分页列表**相关的逻辑，使得在编写分页相关业务代码时，无需重新处理分页和列表的通用逻辑。

该组合式函数支持**泛型**。

## 如何使用

首先，先确保已经安装相关的包，如果已经安装，则跳过这一步

```bash
pnpm add @colorless/hooks
```

引入该组合式函数

```ts
import { useList } from '@colorless/hooks'
```

在vue组件中使用该组合式函数

```html
<template>
  <div></div>
</template>

<script setup lang="ts">
  import { useList } from '@colorless/hooks'

  interface Record {
    name: string
    age: number
  }

  const { records, pageNum, pageSize } = useList<Record>({
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

| 参数名          | 类型       | 是否可为空 | 默认值 | 说明                                                         |
| --------------- | ---------- | ---------- | ------ | ------------------------------------------------------------ |
| defaultPageNum  | `number`   | 是         | 10     | 默认的页码                                                   |
| defaultPageSize | `number`   | 是         | 1      | 默认每页显示的条数                                           |
| fetchData       | `Function` | 否         | -      | 列表数据源，具体类型参考类型定义`UseListHookOptions`         |
| afterFetch      | `Function` | 是         | -      | 获取数据之后的钩子，具体类型参考类型定义`UseListHookOptions` |
| beforeFetch     | `Function` | 是         | -      | 获取列表数据前的钩子函数，返回值为`boolean` 或`Promise<boolean>`，当返回false时，则会阻止获取数据 |
| onError         | `Function` | 是         | -      | 当获取数据失败时执行的钩子函数，具体入参参考类型定义`UseListHookOptions` |
| immediateFetch  | `boolean`  | 是         | true   | 是否设置完hook就立即执行拉取                                 |

### 出参

| 变量名   | 类型                  | 说明                                 |
| -------- | --------------------- | ------------------------------------ |
| records  | `Ref<R[]>`            | 当前页的数据                         |
| total    | `Ref<number>`         | 总条数                               |
| pageNum  | `Ref<number>`         | 页码                                 |
| pageSize | `Ref<number>`         | 页宽                                 |
| loading  | `Ref<boolean>`        | 是否正在加载中                       |
| init     | `() => Promise<void>` | 执行初始化，相当于刷新当页           |
| reset    | `() => Promise<void>` | 重置列表，页码、页宽将会恢复为默认值 |
| refresh  | `() => Promise<void>` | 刷新当页数据                         |

## 类型定义

### UseListHookOptions

```typescript
/**
 * useList的入参
 */
export interface UseListHookOptions<R> {
  // 默认页数
  defaultPageNum?: number
  // 默认的每页条数
  defaultPageSize?: number
  // 获取列表的远程函数
  fetchData: (params: {
    pageNum: number
    pageSize: number
  }) => Promise<{ records: R[]; total: number }> | { records: R[]; total: number }
  // 获取数据之后的钩子
  afterFetch?: (records: R[]) => void
  // 获取列表数据前的钩子函数
  beforeFetch?: () => boolean | Promise<boolean>
  // 获取数据失败时的回调函数
  onError?: (error: unknown) => void
  // 是否设置完hook就立即执行拉取
  immediateFetch?: boolean
}
```

### UseListReturn

```typescript
/**
 * useList的返回值
 */
export interface UseListReturn<R> {
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
  pageNum: Ref<number>
  /**
   * 页宽
   */
  pageSize: Ref<number>
  /**
   * 是否正在加载中
   */
  loading: Ref<boolean>
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
}
```
