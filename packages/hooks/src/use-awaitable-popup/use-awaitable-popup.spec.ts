import { describe, expect, it } from 'vitest'

import { useAwaitablePopup } from './use-awaitable-popup'

describe('use-awaitable-popup', () => {
  it('调用commit方法后, 能结束open的等待, 并获取到提交的数据', async () => {
    const { open, commit } = useAwaitablePopup<string>()

    setTimeout(() => {
      commit('test')
    }, 100)

    const { isCancel, data } = await open()

    expect(isCancel).toBeFalsy()
    expect(data).toBe('test')
  })

  it('调用cancel方法后, 能结束open的等待, 结果isCancel为true', async () => {
    const { open, cancel } = useAwaitablePopup<string>()

    setTimeout(() => {
      cancel()
    }, 100)

    const { isCancel, data } = await open()

    expect(isCancel).toBeTruthy()
    expect(data).toBeNull()
  })
})
