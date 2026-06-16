import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'

import { useSnapshotFilters } from '../src/use-snapshot-filters'

beforeEach(() => {
  vi.resetAllMocks()
})

describe('use-snapshot-filters', () => {
  it('cacheFilters和原始提供的数据结构相同, 但引用不相同', () => {
    const filters = ref<{
      name: string
      age: number
    }>({
      name: '',
      age: -1,
    })
    const { cacheFilters } = useSnapshotFilters({
      filters,
    })

    expect(cacheFilters.value).not.toBe(filters.value)
    expect(cacheFilters.value).toHaveProperty('name')
    expect(cacheFilters.value).toHaveProperty('age')
  })

  it('当filters发生变化后, cacheFilters的值会保持一致', async () => {
    const filters = ref<{
      name: string
    }>({
      name: '',
    })

    const { cacheFilters } = useSnapshotFilters({
      filters,
    })

    expect(cacheFilters.value).not.toBe(filters.value)
    expect(cacheFilters.value).toHaveProperty('name')
    expect(cacheFilters.value.name).toBe('')

    filters.value = {
      name: '2',
    }

    await nextTick()

    expect(cacheFilters.value.name).toBe('2')

    filters.value.name = '3'

    await nextTick()

    expect(cacheFilters.value.name).toBe('3')
  })

  it('当变更cacheFilters未提交变更时, filters的值将会保持原样', () => {
    const filters = ref<{
      name: string
    }>({
      name: 'aaa',
    })

    const { cacheFilters } = useSnapshotFilters({
      filters,
    })

    cacheFilters.value.name = 'xxx'

    expect(filters.value.name).not.toBe('xxx')
    expect(filters.value.name).toBe('aaa')
  })
  it('当提交cacheFilters的变更后, filters的值将会得到同步', () => {
    const filters = ref<{
      name: string
    }>({
      name: 'aaa',
    })

    const { cacheFilters, commit } = useSnapshotFilters({
      filters,
    })

    cacheFilters.value.name = 'xxx'

    expect(filters.value.name).not.toBe('xxx')
    expect(filters.value.name).toBe('aaa')

    commit()

    expect(filters.value.name).toBe('xxx')
  })
  it('当未配置默认值时, 则reset后的默认值为调用useFilters时刻传递的filters的值为准', () => {
    const filters = ref<{
      name: string
    }>({
      name: 'aaa',
    })

    const { reset } = useSnapshotFilters({
      filters,
    })

    filters.value.name = 'xxx'

    expect(filters.value.name).toBe('xxx')

    reset()

    expect(filters.value.name).toBe('aaa')
  })
  it('当配置defaultValues时, 则reset后的filters和cacheFilters的值将以defaultValues的为准', () => {
    const filters = ref<{
      name: string
    }>({
      name: 'aaa',
    })

    const { reset, cacheFilters } = useSnapshotFilters({
      filters,
      defaultValues: {
        name: () => 'test',
      },
    })

    filters.value.name = 'xxx'

    expect(filters.value.name).toBe('xxx')

    reset()

    expect(filters.value.name).toBe('test')
    expect(cacheFilters.value.name).toBe('test')
  })
  it('调用restore方法可以将cacheFilters恢复至上一次变更的结果', () => {
    const filters = ref<{
      name: string
    }>({
      name: 'aaa',
    })

    const { cacheFilters, restore } = useSnapshotFilters({
      filters,
    })

    cacheFilters.value.name = 'xxx'

    expect(filters.value.name).not.toBe('xxx')
    expect(filters.value.name).toBe('aaa')

    restore()

    expect(cacheFilters.value.name).toBe('aaa')
  })
})
