# 代码架构规范

本文件关注目录组织、模块边界、导入边界和共享复用。组件拆分、hooks、wrapper 和抽象边界见[组件与 Hooks 规范](./component-and-hooks.md)，重构策略见[代码重构规范](./code-refactoring.md)。

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

### 推荐项目目录

以下目录结构仅作为通用推荐。具体项目可以在项目级规范中调整：

```plaintext
├── src
│   ├── api 接口请求
│   ├── assets  全局静态资源
│   ├── components 全局组件
│   ├── constants  全局常量
│   ├── directives 全局指令
│   ├── hooks 全局组合式函数
│   ├── pages 业务页面
│   ├── types 全局类型
│   └── utils 全局工具
```

### 模块目录

文件夹命名使用 `kebab-case`，目录结构如下。以下以 `contract/` 业务域为例：

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

使用方：

```typescript
import {
  ContractEditor,
  ContractEditorOtherComponent,
} from "./contract-editor";
```

### 组合式函数目录

文件夹命名使用 `kebab-case`，例如要设计一个 `use-title` 的组合式函数，则目录结构如下：

- `use-title/`：总文件夹
  - `components/`：存放内部使用的组件。
  - `hooks/`：内部使用或提供给使用方的 hooks。
  - `utils/`：该模块内部工具方法
  - `use-title.ts`：组合式函数主文件
  - `types.ts`：存放类型信息
  - `index.ts` 入口文件

### 工具类目录

文件夹命名使用 `kebab-case`，则目录结构如下：

- `utils/`：总文件夹
  - `validator.ts`
  - `format-money.ts`

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
