# useAwaitablePopup

`useAwaitablePopup` 用于把弹层交互建模为 Promise。调用方通过 `await popup.open()` 等待用户操作结果，弹层内部通过 `commit(data)` 或 `cancel()` 回传结果。

这种写法适合需要把多个弹层交互串成一条异步流程的场景，能减少层层事件回调和状态分支。

## 说明

- `open()` 返回一个 `Promise<AwaitedResult<R>>`。
- `commit(data)` 表示确认并返回业务数据。
- `cancel()` 表示取消，返回 `isCancel: true` 和 `data: null`。

## 安装

```bash
pnpm add @colorless/hooks
```

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { useAwaitablePopup } from '@colorless/hooks'

interface UserOption {
  id: number
  name: string
}

const visible = ref(false)
const popup = useAwaitablePopup<UserOption>()

const openSelector = async () => {
  visible.value = true
  const result = await popup.open()
  visible.value = false

  if (!result.isCancel) {
    console.log(result.data)
  }
}

const onConfirm = (user: UserOption) => {
  popup.commit(user)
}

const onCancel = () => {
  popup.cancel()
}
</script>
```

## 常用场景

### 选择器弹窗

把“打开选择器 -> 用户选择 -> 返回选中结果”写成单条异步链路。

```ts
const userPicker = useAwaitablePopup<UserRecord>()

const chooseOwner = async () => {
  pickerVisible.value = true
  const result = await userPicker.open()
  pickerVisible.value = false

  if (result.isCancel) {
    return
  }

  form.value.ownerId = result.data!.id
}
```

### 二次确认弹窗

当只关心“是否确认”时，也可以把返回值设计为简单类型。

```ts
const confirmDeletePopup = useAwaitablePopup<boolean>()

const removeRecord = async () => {
  dialogVisible.value = true
  const result = await confirmDeletePopup.open()
  dialogVisible.value = false

  if (!result.isCancel && result.data) {
    await api.delete(currentId.value)
  }
}
```

### 串行等待多个弹层

当一个流程需要连续等待多个弹层时，可以直接用 `await` 串联。

```ts
const selectProjectPopup = useAwaitablePopup<ProjectRecord>()
const confirmPopup = useAwaitablePopup<boolean>()

const startFlow = async () => {
  const project = await selectProjectPopup.open()

  if (project.isCancel) {
    return
  }

  const confirm = await confirmPopup.open()

  if (!confirm.isCancel && confirm.data) {
    await projectApi.archive(project.data!.id)
  }
}
```

## API 文档

### 函数签名

```ts
interface AwaitedResult<R> {
  isCancel: boolean
  data: R | null
}

function useAwaitablePopup<R>(): {
  open: () => Promise<AwaitedResult<R>>
  commit: (data: R) => void
  cancel: () => void
}
```

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `open` | `() => Promise<AwaitedResult<R>>` | 打开一个等待中的交互，并在 `commit` 或 `cancel` 后结束 |
| `commit` | `(data: R) => void` | 确认交互并返回业务数据 |
| `cancel` | `() => void` | 取消交互并返回空数据 |

### `AwaitedResult<R>`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `isCancel` | `boolean` | 是否为取消结果 |
| `data` | `R \| null` | 确认时为业务数据，取消时为 `null` |

## 边界与注意事项

- `useAwaitablePopup` 只负责 Promise 结果协作，不负责弹层的显隐状态；弹层何时显示、隐藏仍由业务自己控制。
- 同一个 Hook 实例不适合并发调用多次 `open()`；后一次调用会覆盖前一次的内部 `resolve`。
- Hook 在组件卸载时会清空内部 `resolve` 引用，因此不要在组件已销毁后再尝试调用 `commit()` 或 `cancel()`。
