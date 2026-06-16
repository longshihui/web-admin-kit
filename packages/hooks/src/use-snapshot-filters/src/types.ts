import type { Ref } from 'vue'

export interface UseSnapshotFiltersOptions<F extends Record<string, unknown>> {
  /**
   * 已提交筛选项数据源
   */
  filters: Ref<F>
  /**
   * 筛选项默认值
   */
  defaultValues?: {
    [K in keyof F]: () => F[K]
  }
}

export interface UseSnapshotFiltersReturn<F extends Record<string, unknown>> {
  /**
   * 已提交的筛选项
   */
  filters: Ref<F>
  /**
   * 缓存的筛选项，做为页面上操作的筛选项数据源
   */
  cacheFilters: Ref<F>
  /**
   * 重置筛选为默认值
   */
  reset: () => void
  /**
   * 提交缓存，提交后已提交的筛选项将会和缓存的筛选项一致
   */
  commit: () => void
  /**
   * 恢复缓存的筛选项状态为操作之前的状态
   */
  restore: () => void
}
