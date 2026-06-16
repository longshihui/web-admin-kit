import { computed, ref, watch } from 'vue'

import type { PermissionCode, PermissionListener } from '../types'

export class PermissionStore {
  private _codes = ref<Set<PermissionCode>>(new Set())
  public codes = computed(() => [...this._codes.value])
  // 设置资源列表
  setCodes(codes: PermissionCode[]) {
    this._codes.value = new Set(codes)
  }
  has(code: PermissionCode) {
    return this._codes.value.has(code)
  }
  // 新增资源列表
  add(code: PermissionCode) {
    this._codes.value.add(code)
  }
  // 删除资源列表
  remove(code: PermissionCode) {
    this._codes.value.delete(code)
  }
  watch(listener: PermissionListener) {
    return watch(
      this.codes,
      (newValues, oldValues) => {
        listener(newValues, oldValues ?? [])
      },
      {
        immediate: true,
      }
    )
  }
}
