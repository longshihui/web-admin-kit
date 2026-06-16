import type { DeepReadonly, Ref } from 'vue'

import type { UseListHookOptions } from '../../use-list'

/**
 * useScrollList入参
 */
export type UseScrollListHookOptions<R> = UseListHookOptions<R>

/**
 * useScrollList的返回值
 */
export interface UseScrollListReturn<R> {
  /**
   * 当前页的数据
   */
  records: Ref<R[]>
  /**
   * 总条数
   */
  total: Ref<number>
  /**
   * 页码
   */
  pageNum: DeepReadonly<Ref<number>>
  /**
   * 页宽
   */
  pageSize: Ref<number>
  /**
   * 是否正在加载中
   */
  loading: Ref<boolean>
  /**
   * 是否有下一页
   */
  isNotMore: DeepReadonly<Ref<boolean>>
  /**
   * 获取数据，相当于刷新当页
   */
  init: () => Promise<void>
  /**
   * 重置列表，页码、页宽将会恢复默认值
   */
  reset: () => Promise<void>
  /**
   * 刷新当页数据
   */
  refresh: () => Promise<void>
  /**
   * 下一页
   */
  next: () => Promise<void>
  /**
   * 上一页
   */
  previous: () => Promise<void>
}
