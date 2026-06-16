# @lsh/sdk

`@lsh/sdk` contains framework-agnostic SDK helpers for web admin products.

## Install

```bash
pnpm add @lsh/sdk
```

## Usage

```ts
import { createSdkClient } from '@lsh/sdk'

const client = createSdkClient({
  baseUrl: 'https://example.com/api'
})

const users = await client.request('/users', {
  query: {
    page: 1
  }
})
```
