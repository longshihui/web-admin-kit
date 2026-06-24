# @colorless/hooks

`@colorless/hooks` 用于沉淀 Vue 3 项目中可复用的组合式逻辑，覆盖分页列表、滚动加载、筛选快照、片段记录和可等待弹层等典型场景。

它面向“多个页面都会反复出现、但又不值得在每个页面各写一套”的状态编排问题，帮助业务代码把关注点放回到接口调用、UI 展示和交互流程上。

## 适用场景

- 页面列表的分页查询与刷新。
- 无限滚动、日志流和分段数据拼接。
- 高级筛选弹窗中的暂存与恢复。
- 需要把弹层交互建模为 Promise 的场景。

## 包含的组合式函数

| Hook | 解决的问题 | 适合场景 |
| --- | --- | --- |
| `useList` | 管理页码、页大小、加载状态和分页请求 | 表格页、列表页、弹窗内分页数据 |
| `useScrollList` | 在分页基础上拼接多页数据并控制翻页方向 | 无限滚动、日志流、分段式加载 |
| `useSnapshotFilters` | 管理“编辑中的筛选项”和“已提交的筛选项” | 高级筛选弹窗、抽屉筛选、批量提交表单 |
| `useFragmentRecords` | 按片段索引维护记录集合并按顺序合并 | 分段缓存、多批次结果拼接、局部替换 |
| `useAwaitablePopup` | 把弹层确认/取消交互统一为 Promise 结果 | 选择器弹窗、确认弹窗、异步弹层流程 |

## 安装

```bash
pnpm add @colorless/hooks
```

## 文档导航

- [目录与选型](./catalog.md)
- [useList](./use-list.md)
- [useScrollList](./use-scroll-list.md)
- [useSnapshotFilters](./use-snapshot-filters.md)
- [useFragmentRecords](./use-fragment-records.md)
- [useAwaitablePopup](./use-awaitable-popup.md)

## 推荐阅读顺序

1. 先看 [目录与选型](./catalog.md)，确定当前问题应该使用哪个 Hook。
2. 再进入具体 Hook 页面，查看安装方式、最小示例和常见场景代码。
3. 实际接入前，对照对应页面中的 API 文档确认参数、返回值和边界行为。
