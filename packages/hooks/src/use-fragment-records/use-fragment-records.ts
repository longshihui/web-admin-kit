/**
 * 片段组合式函数
 * 用于处理多段式的记录的管理，包括
 * 1. 添加片段
 * 2. 删除片段
 * 3. 移除片段
 * 4. 替换片段
 */
import { shallowRef } from 'vue'

export function useFragmentRecords<Record>() {
  const recordsMap = shallowRef(new Map<number, Record[]>())
  const records = shallowRef<Record[]>([])

  const updateRecords = () => {
    const entires = [...recordsMap.value.entries()]

    entires.sort((fragment1, fragment2) => {
      const [index1] = fragment1
      const [index2] = fragment2

      return index1 - index2
    })

    records.value = entires
      .map((fragment) => {
        const [, records] = fragment

        return records
      })
      .flat()
  }

  const append = (index: number, records: Record[]) => {
    recordsMap.value.set(index, records)

    updateRecords()
  }
  const replace = (targetIndex: number, records: Record[]) => {
    recordsMap.value.set(targetIndex, records)

    updateRecords()
  }
  const remove = (targetIndex: number) => {
    ;[...recordsMap.value.keys()]
      .filter((index) => index >= targetIndex)
      .forEach((index) => {
        recordsMap.value.delete(index)
      })

    updateRecords()
  }
  const clear = () => {
    recordsMap.value.clear()

    updateRecords()
  }

  return {
    append,
    replace,
    remove,
    records,
    clear,
  }
}
