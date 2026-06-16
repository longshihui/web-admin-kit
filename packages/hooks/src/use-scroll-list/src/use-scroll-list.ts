/**
 * 滚动列表，适用于无限滚动的场景
 */
import { isUndefined } from 'lodash-es'
import { nextTick, readonly, ref, shallowRef } from 'vue'

import { useFragmentRecords } from '../../use-fragment-records'
import { useList } from '../../use-list'
import type { UseScrollListHookOptions, UseScrollListReturn } from './types'

export function useScrollList<R>(options: UseScrollListHookOptions<R>): UseScrollListReturn<R> {
  const {
    fetchData: originalFetchData,
    beforeFetch: originalBeforeFetch,
    afterFetch: originalAfterFetch,
  } = options

  const fetchPromise = shallowRef<Promise<void> | null>(null)
  const fetchPromiseResolve = shallowRef<(() => void) | null>(null)
  const isNotMore = ref(false)

  const { records, append, remove, clear } = useFragmentRecords<R>()

  const proxyFetchData: UseScrollListHookOptions<R>['fetchData'] = async (params) => {
    const { pageNum, pageSize } = params

    const { records, total: newTotal } = await originalFetchData(params)

    remove(pageNum)
    append(pageNum, records)

    isNotMore.value = pageNum * pageSize >= newTotal

    return {
      records,
      total: newTotal,
    }
  }

  const proxyBeforeFetch = () => {
    fetchPromise.value = new Promise((resolve) => (fetchPromiseResolve.value = resolve))

    if (isUndefined(originalBeforeFetch)) {
      return true
    }

    return originalBeforeFetch()
  }

  const proxyAfterFetch = () => {
    fetchPromiseResolve.value?.()

    return originalAfterFetch?.(records.value)
  }

  const { init, refresh, reset, pageNum, pageSize, loading, total } = useList<R>({
    ...options,
    fetchData: proxyFetchData,
    beforeFetch: proxyBeforeFetch,
    afterFetch: proxyAfterFetch,
  })

  const proxyReset = async () => {
    clear()
    reset()

    await nextTick()

    await fetchPromise.value
  }
  const next = async () => {
    if (fetchPromise.value) {
      await fetchPromise.value
    }

    if (isNotMore.value) {
      return
    }

    pageNum.value += 1

    await nextTick()

    await fetchPromise.value
  }

  const previous = async () => {
    if (fetchPromise.value) {
      await fetchPromise.value
    }

    pageNum.value = Math.max(1, pageNum.value - 1)

    await nextTick()

    await fetchPromise.value
  }

  return {
    loading,
    records,
    init,
    refresh,
    reset: proxyReset,
    pageNum: readonly(pageNum),
    pageSize,
    next,
    previous,
    isNotMore: readonly(isNotMore),
    total,
  }
}
