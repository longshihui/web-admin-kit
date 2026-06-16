/**
 * 列表分页数据
 */
export interface ListResponse<Row> {
  pageNum: number
  pageSize: number
  pages: number
  total: number
  records: Row[]
}

export type ListRequest<T> = T & { pageNum: number; pageSize: number }
