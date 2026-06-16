# `@lsh/permission-kit`

共享权限能力包，负责沉淀项目间可复用的“权限点存储、权限判断、路由守卫、渲染切面与 DOM 指令”能力。

该包聚焦权限表达和消费，不直接持有登录态、用户态，也不绑定具体业务 store。

## 快速开始

### 创建并注入权限 SDK

```ts
import { PermissionSDK } from '@lsh/permission-kit'

export const permissionSdk = new PermissionSDK({
  fetchResourceList: async () => {
    const response = await fetch('/api/permissions')

    return response.json()
  },
})

await permissionSdk.init()
```

```ts
import { createApp } from 'vue'

import App from './App.vue'
import { permissionSdk } from './permission-sdk'

const app = createApp(App)

app.use(permissionSdk)
app.mount('#app')
```

### 在组件中判断权限

```vue
<script setup lang="ts">
import { PermissionCalculateMode, usePermission } from '@lsh/permission-kit'

const { status, whenGranted } = usePermission({
  codes: ['contract:view', 'contract:list'],
  calculator: PermissionCalculateMode.OR,
})

whenGranted(() => {
  console.log('当前用户拥有至少一个合同相关权限')
})
</script>

<template>
  <div>{{ status }}</div>
</template>
```

### 使用渲染切面和指令

```vue
<script setup lang="ts">
import {
  PermissionCalculateMode,
  PermissionRender,
  usePermissionDirectives,
} from '@lsh/permission-kit'

const { vPermission } = usePermissionDirectives()
</script>

<template>
  <PermissionRender codes="contract:view">
    <template #granted>允许查看合同</template>
    <template #denied>没有查看权限</template>
  </PermissionRender>

  <button
    v-permission="{
      codes: ['contract:create', 'contract:approve'],
      calculator: PermissionCalculateMode.OR,
    }"
  >
    新建或审批合同
  </button>
</template>
```

### 创建路由权限守卫

```ts
import { createPermissionRouterGuard } from '@lsh/permission-kit'

router.beforeEach(
  createPermissionRouterGuard(permissionSdk, {
    excludes: ['Login', '403'],
    getPermissionOptions: (to) => to.meta.permission,
    onDenied: (_to, _from, next) => {
      next({ name: '403' })
    },
  })
)
```

## 文档

- [整体设计](./docs/design.md)
- [API 文档](./docs/api.md)
