# 代码规范

## TypeScript

- 严格使用 TypeScript，尽量避免 `any`。
- 类型不确定时优先使用 `unknown`，再通过类型收窄、类型守卫或泛型表达真实约束。
- 异步逻辑优先使用 `async/await`。
- `export` 的函数和 hook 建议显式声明返回类型。
- 类型导入使用 `import type`。

## Vue 3

- SFC 使用 `<script setup lang="ts">`。
- `defineProps`、`defineEmits`、`defineExpose` 使用泛型形式定义。
- Props 类型应优先抽成接口，例如 `interface Props` 后再使用 `defineProps<Props>()`。
- 当组件需要适配多种不同数据结构时，优先考虑泛型组件。
- 使用组件库组件时，优先使用按需导入。
- 支持 `v-model` 的组件必须检查循环更新风险。

## TSX

- 使用 `h` 函数构造 VNode 时，通过静态 `import` 引入组件，不使用组件字符串名称。

## 注释

- 代码注释必须使用中文
- 对于业务流程的代码，需要用注释说明整体业务流程

## CSS样式

### BEM

- CSS 类名使用 BEM 组织。
- Block 使用业务语义命名，不使用 `wrapper`、`container`、`content` 这类空泛名称作为主要业务块名。
- Element 表达业务块内的组成部分。
- Modifier 表达状态、变体或模式。

### 预处理器

- 使用 SCSS 或 Less 时，父子关系样式使用嵌套语法。
- 嵌套层级应保持克制，避免让选择器依赖过深的 DOM 结构。

### 样式职责

- 页面级布局样式放在页面或业务模块内。
- 可复用组件只封装自身必要样式，不承担外部页面布局职责。
- 不通过全局样式横向修改其他业务模块的私有结构
