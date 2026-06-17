import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { withSetup } from './test-utils/with-setup'

import { useList } from '../src/use-list/src/use-list'

describe('use-list', () => {
  it('当变更pageNum后, fetchData调用一次', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    const [{ pageNum }] = await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageNum: 2,
      })
    })

    expect(fn).toBeCalledTimes(1)

    pageNum.value = 1

    await nextTick()

    expect(fn).toBeCalledTimes(2)
  })

  it('当变更pageSize时, fetchData调用一次, pageNum变为1', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    const [{ pageSize }] = await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageSize: 20,
      })
    })

    expect(fn).toBeCalledTimes(1)

    pageSize.value = 10

    await nextTick()

    expect(fn).toBeCalledTimes(2)
  })

  it('当同时变更pageSize和pageNum, fetchData只会调用一次', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    const [{ pageSize, pageNum }] = await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageNum: 2,
        defaultPageSize: 20,
      })
    })

    expect(fn).toBeCalledTimes(1)

    pageSize.value = 10
    pageNum.value = 1

    await nextTick()

    expect(fn).toBeCalledTimes(2)
  })

  it('当调用reset方法后, pageNum和pageSize将会重置回默认值', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    const [{ pageSize, pageNum, reset }] = await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageNum: 1,
        defaultPageSize: 10,
      })
    })

    expect(fn).toBeCalledTimes(1)

    pageSize.value = 10
    pageNum.value = 2

    await nextTick()

    expect(fn).toBeCalledTimes(2)

    reset()

    await nextTick()

    expect(pageNum.value).toBe(1)
    expect(pageSize.value).toBe(10)
    expect(fn).toBeCalledTimes(3)
  })

  it('当pageNum或者pageSize均为默认值时, 调用reset方法后, fetchData都会被调用', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    const [{ reset }] = await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageNum: 1,
        defaultPageSize: 10,
      })
    })

    expect(fn).toBeCalledTimes(1)

    reset()

    await nextTick()

    expect(fn).toBeCalledTimes(2)
  })

  it('调用refresh方法, pageSize和pageNum不变, fetchData会被调用', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    const [{ refresh, pageNum, pageSize }] = await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageNum: 1,
        defaultPageSize: 10,
      })
    })

    expect(fn).toBeCalledTimes(1)

    pageNum.value = 10
    pageSize.value = 30

    await nextTick()

    expect(fn).toBeCalledTimes(2)

    await nextTick()

    refresh()

    await nextTick()

    expect(pageNum.value).toBe(10)
    expect(pageSize.value).toBe(30)
    expect(fn).toBeCalledTimes(3)
  })

  it('当immediateFetch = false时, 设置完hook后, fetchData不会被调用', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageNum: 1,
        defaultPageSize: 10,
        immediateFetch: false,
      })
    })

    expect(fn).toBeCalledTimes(0)
  })

  it('当beforeFetch返回false时, fetchData不会被调用', async () => {
    const fn = vi.fn(() => {
      return {
        records: [],
        total: 0,
      }
    })

    await withSetup(() => {
      return useList({
        fetchData: fn,
        beforeFetch: () => false,
        defaultPageNum: 1,
        defaultPageSize: 10,
      })
    })

    expect(fn).toBeCalledTimes(0)
  })

  it('当fetchData抛出错误时, onError函数被调用, 且能获取到抛出的错误', async () => {
    const error = new Error('test error')

    const fn = vi.fn(() => {
      throw error
    })
    const errorHandlerSpy = vi.fn()

    await withSetup(() => {
      return useList({
        fetchData: fn,
        onError: errorHandlerSpy,
        defaultPageNum: 1,
        defaultPageSize: 10,
      })
    })

    expect(fn).toBeCalledTimes(1)
    expect(errorHandlerSpy).toBeCalled()
    expect(errorHandlerSpy).toBeCalledWith(error)
  })

  it('请求数据后, afterFetch钩子会被调用, 并且钩子入参为接口返回的数据', async () => {
    const fn = vi.fn(() => {
      return {
        records: ['a', 'b', 'c'],
        total: 0,
      }
    })
    const afterFetchSpy = vi.fn()

    await withSetup(() => {
      return useList({
        fetchData: fn,
        defaultPageNum: 2,
        afterFetch: afterFetchSpy,
      })
    })

    expect(fn).toBeCalledTimes(1)
    expect(afterFetchSpy).toBeCalledTimes(1)
    expect(afterFetchSpy).toBeCalledWith(['a', 'b', 'c'])
  })
})
