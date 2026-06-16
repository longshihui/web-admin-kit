/**
 * 可等待的弹层
 */
import { onUnmounted, shallowRef } from 'vue'

export interface AwaitedResult<R> {
  isCancel: boolean
  data: R | null
}

export function useAwaitablePopup<R>() {
  const resolve = shallowRef<((result: AwaitedResult<R>) => void) | null>(null)

  const open = () => {
    return new Promise<AwaitedResult<R>>((_resolve) => {
      resolve.value = _resolve
    })
  }

  const commit = (data: R) => {
    resolve.value?.({
      isCancel: false,
      data,
    })
  }

  const cancel = () => {
    resolve.value?.({
      isCancel: true,
      data: null,
    })
  }

  onUnmounted(() => {
    resolve.value = null
  })

  return {
    open,
    cancel,
    commit,
  }
}
