# 目录与选型

`@colorless/hooks` 当前包含 5 个面向 Vue 3 的共享组合式函数。它们分别解决分页查询、滚动拼接、筛选暂存、片段合并和可等待弹层等常见问题。

## 如何选择

| 需求 | 推荐 Hook | 原因 |
| --- | --- | --- |
| 需要标准分页列表，关注页码、页大小、刷新和重置 | `useList` | 封装最基础的分页请求状态，适合多数列表页 |
| 需要不断向下加载并把多页数据拼成一个结果集 | `useScrollList` | 在 `useList` 基础上增加片段合并、前后翻页和“是否还有更多”语义 |
| 需要把“编辑中的筛选项”和“已提交的筛选项”分开管理 | `useSnapshotFilters` | 避免表单每次变更都立刻影响业务查询 |
| 需要按片段缓存记录，并支持局部替换或截断后续片段 | `useFragmentRecords` | 独立解决多段数据的合并问题，可单独复用 |
| 需要通过 `await` 等待弹层确认或取消结果 | `useAwaitablePopup` | 把弹层交互建模为 Promise，减少回调分支 |

## Hook 总览

### `useList`

- 定位：分页列表基础能力。
- 解决：`loading`、`pageNum`、`pageSize`、`total`、刷新和重置。
- 适合：表格页、列表页、弹窗内分页结果。
- 不适合：需要把多页结果持续拼接到一个数组中的场景。

### `useScrollList`

- 定位：滚动分页与结果拼接。
- 解决：多页数据按页码顺序合并、上一页/下一页控制、是否还有更多数据。
- 适合：无限滚动、日志流、时间线、聊天记录回溯。
- 不适合：只需要单页数据替换的普通分页列表。

### `useSnapshotFilters`

- 定位：筛选项快照管理。
- 解决：临时编辑、确认提交、取消恢复、重置默认值。
- 适合：高级筛选弹窗、抽屉筛选、批量提交查询条件。
- 不适合：每次输入都要立刻触发查询的简单搜索框。

### `useFragmentRecords`

- 定位：片段式记录集合管理。
- 解决：按索引保存片段、顺序合并、替换指定片段、删除后续片段。
- 适合：分段拉取结果、局部刷新、懒加载缓存。
- 不适合：只需要一个普通数组响应式状态的场景。

### `useAwaitablePopup`

- 定位：Promise 化弹层控制。
- 解决：把“打开弹层 -> 等待用户确认或取消 -> 返回结果”的流程写成单条异步链路。
- 适合：选择器弹窗、二次确认、需要串行等待的交互。
- 不适合：同一个 Hook 实例上并发打开多个弹层的场景。

## 目录结构

```txt
packages/hooks/
  src/
    index.ts
    use-list/
    use-scroll-list/
    use-snapshot-filters/
    use-fragment-records/
    use-awaitable-popup/
  docs/
    README.md
    catalog.md
    use-list.md
    use-scroll-list.md
    use-snapshot-filters.md
    use-fragment-records.md
    use-awaitable-popup.md
```

## 推荐使用方式

- 共享、稳定、跨页面复用的逻辑优先沉淀到 `@colorless/hooks`。
- 页面私有且尚未稳定复用的逻辑，保留在业务项目自己的 `hooks/` 目录。
- 接入前优先看对应 Hook 的“常用场景”示例，确认它是否与你当前的状态流一致。
- 如果当前问题同时涉及分页和多页拼接，优先考虑 `useScrollList`；如果只需要普通分页，优先使用 `useList`。
