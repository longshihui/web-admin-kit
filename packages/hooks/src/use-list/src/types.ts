import type { Ref } from 'vue'

/**
 * useList的入参
 */
export interface UseListHookOptions<R> {
  // 默认页数
  defaultPageNum?: number
  // 默认的每页条数
  defaultPageSize?: number
  // 获取列表的远程函数
  fetchData: (params: {
    pageNum: number
    pageSize: number
  }) => Promise<{ records: R[]; total: number }> | { records: R[]; total: number }
  // 获取数据之后的钩子
  afterFetch?: (records: R[]) => void
  // 获取列表数据前的钩子函数
  beforeFetch?: () => boolean | Promise<boolean>
  // 获取数据失败时的回调函数
  onError?: (error: unknown) => void
  // 是否设置完hook就立即执行拉取
  immediateFetch?: boolean
}

/**
 * useList的返回值
 */
export interface UseListReturn<R> {
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
  pageNum: Ref<number>
  /**
   * 页宽
   */
  pageSize: Ref<number>
  /**
   * 是否正在加载中
   */
  loading: Ref<boolean>
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
}
