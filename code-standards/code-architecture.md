# 代码架构规范

- 页面组件保持轻量，复杂状态、接口调用、副作用优先下沉到业务 hooks。
- 不新增纯透传 wrapper。
- CSS 使用 BEM 命名规范。
- 代码注释使用中文。

## 命名规范

### 命名规则

- 组件文件命名使用 `PascalCase`命名法，例如 `Button.vue`；
- 文件夹命名使用 `kebab-case`, 例如 `components-button`；
- 模板中的组件名和事件名使用 `kebab-case`。

### 用词限定

- 命名用词优先使用业务语义，避免 `Common`、`Wrapper`、`Panel`、`MainContent`、`IndexTab` 等空泛命名。
- 命名要直观，使得看到文件名就知道是做什么的
  - 例如在设计一个合同新建组件的弹窗时，应该命名为`ContractCreateDialog.vue`
  - 例如在设计合同创建页面时，应该命名为`ContractCreatePage.vue`

## 目录组织规范

在编写代码时，需要根据场景遵守以下目录规范

### 项目目录

```plaintext
├── src
│   ├── api 后端接口
│   ├── assets  全局静态资源
│   ├── components 全局组件
│   ├── constants  全局常量
│   ├── directive 全局指令
│   ├── hooks 全局组合式函数
│   ├── pages 业务页面
│   ├── types 全局类型
│   └── utils 全局工具
```

### 模块目录

文件夹命名使用 `kebab-case`，目录结构如下：

- `contract/`：合同模块总文件夹
  - `components/`：该业务模块内部组件
  - `hooks/`：该业务模块内部 hooks
  - `utils/`：该业务模块内部工具
  - `constants/`：该模块内部常量
  - `types.ts` 或 `types/`：该业务模块内部类型

- 如果业务模块内部可以继续按子业务拆分，则在 `components/` 下继续按业务能力分目录，不按 `tab`、`panel`、`wrapper`、`dialog-group` 等 UI 词分目录。
- 允许存在 `detail/`、`form/`、`list/`、`rule/` 等页面语义目录，但这些目录本身仍应作为业务场景入口，不作为杂项收纳箱。

### 组件目录

当一个组件引用资源过多时，单独使用文件夹管理，并通过 `index.ts` 统一导出。
文件夹命名使用 `kebab-case`，例如要设计合同编辑器组件，目录结构如下：

- `contract-editor/`：总文件夹
  - `components/`：存放内部使用的组件
  - `hooks/`：内部使用的组合式函数
  - `utils/`：内部使用的工具
  - `ContractEditor.vue`：合同编辑器主组件
  - `ContractEditorOtherComponent.vue`：其他可导出的子组件
  - `types.ts`：存放类型信息
  - `index.ts` 入口文件

使用方:

```typescript
import {
  ContractEditor,
  ContractEditorOtherComponent,
} from "@/components/contract-editor";
```

### 组合式函数目录

文件夹命名使用 `kebab-case`，例如要设计一个`use-title`的组合式函数，则目录结构如下：

- `use-title/`：总文件夹
  - `components/`：存放内部使用的组件。
  - `hooks/`：该组件内部使用的hooks或者提供给使用方的hooks。
  - `utils/`：该模块内部工具方法
  - `use-title.ts`：合同编辑器主组件
  - `types.ts`：存放类型信息
  - `index.ts` 入口文件

### 工具类目录

文件夹命名使用 `kebab-case`，则目录结构如下：

- `utils/`：总文件夹
  - `validator.ts`
  - `format-money.ts`

## 组件拆分规则

- 路由页面保持轻量，只负责组织页面区块、串联页面级状态、调用业务 hooks、处理路由进出和页面级副作用。
- 不要把大段表格列定义、复杂表单逻辑、弹窗状态机、权限分支、数据装配逻辑长期堆在路由页面里。
- 当页面同时承担页面编排和大量业务 UI 细节时，应拆分组件或 hooks。
- 当页面出现 3 个及以上相对独立的业务区块时，应拆分组件或 hooks。
- 当页面同时管理多组互不相关的弹窗、抽屉、表格、表单状态时，应拆分组件或 hooks。
- 当某段逻辑已经可以被命名为明确职责时，应拆分为组件、hook 或工具函数，例如“详情加载”“分页查询”“字段映射”“提交编排”。

## 组件边界

- 组件按业务语义切分，不按模板块数量或视觉区块机械切分。
- 同一业务能力下的组件放在同一个目录。
- 子业务能力职责独立时，必须拆成独立组件或独立 hooks。
- 展示组件负责渲染和交互输出；复杂状态编排、接口调用、副作用处理优先下沉到 hooks。
- 如果一个组件同时包含复杂状态或副作用、大量独立展示结构，应优先拆分。

## Wrapper 组件

- 只原样透传 props 的组件不要新增。
- 只用 computed 代理 `v-model` 的组件不要新增。
- 只给通用组件换名但没有新增业务规则的组件不要新增。
- 只把子组件再包一层后立即原样输出的组件不要新增。
- 页面或业务组件应直接使用已经足够清晰的通用组件、共享组件或已有业务组件。
- 只有增加明确业务默认参数、权限处理、读态/编辑态切换、统一事件 payload、暴露命令式 API 或屏蔽底层复杂度时，才保留 wrapper。

## 组合式函数拆分规则

- hooks 按业务职责拆分，不要把多个无关职责塞进一个“大总管 hook”。
- hooks 文件命名使用 `useXxx.ts`，名称必须能直接表达职责，例如 `useTablePage`、`useContractDetailLoader`、`useProjectContractActions`。
- 一个模块下如果存在多个 hooks，统一通过 `hooks/index.ts` 导出。
- 不要使用伪 hook barrel 文件，例如 `usePage.ts` 实际只做 export，或 `useModuleMain.ts` 实际只是聚合多个 hooks。
- 纯函数不要放进 hooks；没有响应式状态、没有副作用、没有组合式 API 参与的逻辑，应放到 `utils/`。

## 避免过早抽象

- 单组件内部的局部状态与交互逻辑，默认先内聚在组件内部，不要过早抽成 hook。
- 只有当逻辑已稳定复用，或抽离后能明显降低复杂度时，才抽成组合式函数。

**Bad：单组件局部状态被过早抽成 hook**

```ts
// useDialogState.ts
import { ref } from "vue";

export const useDialogState = () => {
  const visible = ref(false);
  const loading = ref(false);

  const open = () => {
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
  };

  return {
    visible,
    loading,
    open,
    close,
  };
};
```

```vue
<script setup lang="ts">
import { useDialogState } from "./useDialogState";

const dialog = useDialogState();
</script>
```

说明：该逻辑仅服务单个组件，只是把局部状态平移到 hook 中，没有形成稳定复用价值，反而增加阅读跳转成本。

**Good：局部状态直接内聚在组件内部**

```vue
<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const loading = ref(false);

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};
</script>
```

说明：单组件内部的局部状态直接内聚在组件中，结构更直接，维护成本更低。

**Good：稳定复用后再抽成公共 hook**

```ts
// useTablePage.ts
import { ref } from "vue";

export const useTablePage = () => {
  const loading = ref(false);
  const pageNum = ref(1);
  const pageSize = ref(10);

  const resetPage = () => {
    pageNum.value = 1;
  };

  return {
    loading,
    pageNum,
    pageSize,
    resetPage,
  };
};
```

说明：当分页查询逻辑已经在多个列表场景中稳定复用，并且职责清晰时，适合抽成公共 hook。

## 导入规则

- 优先从最近的业务域 barrel 导入，例如 `./hooks`、`../components/income`。
- 如果通用组件已经足够清晰表达当前业务语义，且没有必要再包一层，则直接从共享模块导入。
- 页面内部不要跨多层随意引用其他业务模块的私有组件。
- 如果需要跨模块复用，应先判断该能力是否应该上移到共享层或抽成稳定业务组件。

## 共享与复用

- 只有在至少两个业务场景稳定复用，且接口已经相对稳定时，才考虑把能力提升到共享层。
- “未来可能复用”不是提前抽共享组件的充分理由。
- 页面目录下的 `shared` 仅表示该业务模块内部共享，不代表全项目共享。
- 全项目共享能力应放到真正的共享目录或公共组件目录，不要从某个页面目录横向借用。

## 新增文件前判断

- 新增组件前先判断它是否代表真实业务边界。
- 新增组件前先判断它是否对上层暴露了更稳定、更清晰的业务接口。
- 如果新增组件只是为了让模板名字更好看、转发 `v-model`、少写几行 import、或给单个通用组件重新包名，则不要创建。

## 代码重构

在修改已有代码时，如果已有代码不遵循规范，则尝试进行重构

### 重构优先级

- 优先消除纯透传 wrapper。
- 优先消除伪 hooks 聚合文件。
- 优先消除以 UI 容器词命名的业务目录。
- 优先处理页面层过厚的问题。
- 优先处理业务逻辑散落在模板附近、难以复用的问题。
- 重构时优先保持行为不变，先整理结构和命名，再考虑进一步抽象。
