# useFragmentRecords

`useFragmentRecords` 用于按片段索引管理记录集合，并始终输出一个按索引顺序合并后的最终数组。

它本身不关心分页请求，而是专注解决“多批次结果如何缓存、替换、清理并合并”这个问题，因此既可以单独使用，也可以作为 `useScrollList` 的底层能力。

## 说明

- 通过 `append(index, records)` 写入一个片段。
- 通过 `replace(index, records)` 覆盖指定片段。
- 通过 `remove(index)` 删除指定索引及其后的所有片段。
- 通过 `clear()` 清空全部片段。

## 安装

```bash
pnpm add @colorless/hooks
```

## 基础用法

```ts
import { useFragmentRecords } from '@colorless/hooks'

interface ProductRecord {
  id: number
  title: string
}

const { append, clear, records, remove, replace } = useFragmentRecords<ProductRecord>()

append(1, [
  { id: 1, title: 'A' },
  { id: 2, title: 'B' },
])

append(2, [{ id: 3, title: 'C' }])
```

## 常用场景

### 分段拉取并合并结果

每次拉取到一个新片段后，按顺序写入，最终消费 `records` 即可。

```ts
const fragments = useFragmentRecords<ChatMessage>()

const loadPage = async (pageNum: number) => {
  const { records } = await messageApi.getHistory({ pageNum, pageSize: 20 })
  fragments.append(pageNum, records)
}
```

### 局部刷新某一片段

当第 3 段数据需要重新拉取时，可以直接 `replace(3, records)`，其余片段保持不变。

```ts
const fragments = useFragmentRecords<LogRecord>()

const refreshThirdFragment = async () => {
  const { records } = await logApi.getList({ pageNum: 3, pageSize: 50 })
  fragments.replace(3, records)
}
```

### 条件变化后截断后续片段

如果当前列表回退到第 2 页，那么第 2 页及其后的缓存都应失效，此时使用 `remove(2)`。

```ts
const fragments = useFragmentRecords<UserRecord>()

const onPageRollback = () => {
  fragments.remove(2)
}
```

## API 文档

### 函数签名

```ts
function useFragmentRecords<Record>(): {
  append: (index: number, records: Record[]) => void
  replace: (targetIndex: number, records: Record[]) => void
  remove: (targetIndex: number) => void
  clear: () => void
  records: ShallowRef<Record[]>
}
```

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `records` | `ShallowRef<Record[]>` | 按索引顺序合并后的最终记录集 |
| `append` | `(index: number, records: Record[]) => void` | 写入一个片段；相同索引会被新的片段覆盖 |
| `replace` | `(targetIndex: number, records: Record[]) => void` | 覆盖指定片段并重新合并 |
| `remove` | `(targetIndex: number) => void` | 删除指定索引及其后的全部片段 |
| `clear` | `() => void` | 清空全部片段 |

## 边界与注意事项

- Hook 内部使用 `Map<number, Record[]>` 保存片段，再按索引升序合并，因此索引语义必须稳定。
- `append()` 和 `replace()` 当前都会直接写入对应索引；如果索引已存在，新值会覆盖旧值。
- `remove(3)` 的行为不是只删第 3 段，而是删除第 3 段以及之后的所有片段。
- 如果你需要的是标准分页查询能力，而不是片段缓存，请优先使用 `useList` 或 `useScrollList`。
