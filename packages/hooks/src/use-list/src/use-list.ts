import { type Ref, ref, watch } from 'vue'

import { UseListHookOptions, UseListReturn } from './types'

export function useList<R>(options: UseListHookOptions<R>): UseListReturn<R> {
  const {
    fetchData,
    defaultPageSize = 10,
    defaultPageNum = 1,
    beforeFetch,
    afterFetch,
    onError,
    immediateFetch = true,
  } = options
  const loading = ref(false)
  const pageNum = ref(defaultPageNum)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)
  const records = ref<R[]>([]) as Ref<R[]>

  const init = async () => {
    loading.value = true

    try {
      const isAllowed = await beforeFetch?.()

      if (typeof isAllowed === 'boolean' && isAllowed === false) {
        return
      }

      const { total: _total, records: _records } = await fetchData({
        pageNum: pageNum.value,
        pageSize: pageSize.value,
      })

      total.value = _total
      records.value = _records

      afterFetch?.(_records)
    } catch (error) {
      if (onError) {
        onError(error)
      } else {
        console.warn(error)
      }
    } finally {
      loading.value = false
    }
  }

  const reset = async () => {
    const isNotChanged = pageNum.value === defaultPageNum && pageSize.value === defaultPageSize

    pageNum.value = defaultPageNum
    pageSize.value = defaultPageSize

    if (isNotChanged) {
      await init()
    }
  }

  const refresh = init

  watch([pageNum, pageSize], init)

  if (immediateFetch) {
    init()
  }

  return {
    records,
    total,
    init,
    loading,
    reset,
    refresh,
    pageNum,
    pageSize,
  }
}
