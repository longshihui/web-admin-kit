# hooks 整体设计

## 背景

业务组件里常见的分页、滚动加载、筛选缓存、弹层 Promise 化控制等逻辑容易被重复实现。`@colorless/hooks` 的目标是把这些跨页面、跨组件复用的组合式逻辑抽离为稳定的项目级 Hook。

## 设计目标

- 每个 Hook 只解决一个明确问题。
- Hook API 保持轻量、类型明确、便于测试。
- 既支持简单场景，也保留必要的扩展点。
- 不耦合具体 UI 组件库。

## 非目标

- 不封装业务接口请求层。
- 不内置项目级 store。
- 不依赖特定页面结构或表单库。

## 模块职责

### `use-list`

处理分页列表的基础能力：

- 请求加载状态。
- 页码与页大小。
- 刷新与重置。
- 请求前后钩子。

### `use-scroll-list`

在 `use-list` 基础上扩展滚动加载能力，适合无限滚动、下拉加载更多等场景。

### `use-snapshot-filters`

提供筛选条件的快照缓存、提交、重置和恢复能力，适合弹窗筛选或高级筛选面板。

### `use-fragment-records`

按片段管理记录集合，适合滚动分页或多段式数据拼接场景。

### `use-awaitable-popup`

把弹层交互封装为 Promise，统一确认 / 取消结果模型。

## 目录约定

- 每个 Hook 独立维护目录。
- Hook 实现与测试尽量靠近放置。
- 包根 `src/index.ts` 统一汇总公共导出。

## 推荐使用方式

```txt
src/hooks/
  use-contract-filters.ts
  use-contract-table.ts
```

- 共享场景优先沉淀到 `@colorless/hooks`。
- 页面私有场景保留在业务项目的 `hooks/` 目录。

## 分阶段落地建议

### 第一阶段

- 统一分页与筛选类逻辑。
- 清理页面内重复的 `loading` / `pageNum` / `pageSize` 代码。

### 第二阶段

- 把 Promise 弹层交互迁移到 `useAwaitablePopup()`。
- 把滚动分页逻辑迁移到 `useScrollList()`。

### 第三阶段

- 根据业务沉淀更多通用 Hook。
- 为新增 Hook 补充独立测试和 API 文档。
