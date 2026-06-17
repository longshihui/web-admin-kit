import { describe, expect, it } from 'vitest'

import { useFragmentRecords } from '../src/use-fragment-records/use-fragment-records'

describe('use-fragment-records', () => {
  describe('添加', () => {
    it('添加多个片段后，序列符合预期', () => {
      const { records, append } = useFragmentRecords<string>()

      append(1, ['1'])
      append(2, ['3', '4'])
      append(3, ['5'])

      expect(records.value).toEqual(['1', '3', '4', '5'])
    })

    it('添加相同的片段时，表现为覆盖', () => {
      const { records, append } = useFragmentRecords<string>()

      append(1, ['1'])
      append(1, ['3', '4'])

      expect(records.value).toEqual(['3', '4'])
    })

    it('乱序添加片段后, 输出records时能根据片段index进行排序', () => {
      const { records, append } = useFragmentRecords<string>()

      append(3, ['5'])
      append(1, ['1', '2'])
      append(2, ['3', '4'])

      expect(records.value).toEqual(['1', '2', '3', '4', '5'])
    })
  })

  describe('替换', () => {
    it('能替换其中一个片段', () => {
      const fragment1 = ['1']
      const fragment2 = ['2']
      const fragment3 = ['3']
      const replaceFragment = ['replace']

      const { records, append, replace } = useFragmentRecords<string>()

      append(1, fragment1)
      append(2, fragment2)
      append(3, fragment3)

      expect(records.value).toEqual(['1', '2', '3'])

      replace(2, replaceFragment)

      expect(records.value).toEqual(['1', 'replace', '3'])
    })
  })

  describe('删除', () => {
    it('能删除其中一个片段', () => {
      const fragment1 = ['1']
      const fragment2 = ['2']
      const fragment3 = ['3']

      const { records, append, remove } = useFragmentRecords<string>()

      append(1, fragment1)
      append(2, fragment2)
      append(3, fragment3)

      expect(records.value).toEqual(['1', '2', '3'])

      remove(2)

      expect(records.value).toEqual(['1'])
    })

    it('删除前片段后，会连带后面的片段一并删除', () => {
      const { records, append, remove } = useFragmentRecords<string>()

      append(1, ['1', '2'])
      append(2, ['3', '2'])

      expect(records.value).toEqual(['1', '2', '3', '2'])

      remove(1)

      expect(records.value).toEqual([])
    })

    it('删除中间片段后，再添加片段能正常添加', () => {
      const { records, append, remove } = useFragmentRecords<string>()

      append(1, ['1', '2'])
      append(2, ['3', '4'])
      append(3, ['5'])

      expect(records.value).toEqual(['1', '2', '3', '4', '5'])

      remove(2)

      expect(records.value).toEqual(['1', '2'])

      append(4, ['6'])

      expect(records.value).toEqual(['1', '2', '6'])
    })
  })
})
