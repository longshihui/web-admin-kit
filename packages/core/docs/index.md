# @lsh/core

`@lsh/core` contains framework-agnostic shared logic for web admin products.

## Install

```bash
pnpm add @lsh/core
```

## Usage

```ts
import { createEventBus, defineAdminKitContext } from '@lsh/core'

const context = defineAdminKitContext({
  appId: 'admin',
  environment: 'production'
})

const bus = createEventBus<{ ready: { appId: string } }>()
bus.on('ready', (payload) => {
  console.log(payload.appId)
})
bus.emit('ready', { appId: context.appId })
```
