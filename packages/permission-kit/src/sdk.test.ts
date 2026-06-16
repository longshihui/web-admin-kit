import { describe, expect, it, vi } from 'vitest'

import { PermissionSDK } from './sdk'

describe('PermissionSDK', () => {
  it('hydrates permission codes from the async fetcher', async () => {
    const sdk = new PermissionSDK({
      fetchResourceList: vi.fn(async () => ['user:list', 'user:create'])
    })

    await sdk.init()

    expect(sdk.getCodes().value).toEqual(['user:list', 'user:create'])
    expect(sdk.hasPermission('user:list')).toBe(true)
    expect(sdk.hasPermission(['user:list', 'user:create'])).toBe(true)
    expect(sdk.hasPermission('user:delete')).toBe(false)
  })

  it('waits until initialization is completed before resolving', async () => {
    const sdk = new PermissionSDK({
      fetchResourceList: async () => ['dashboard:view']
    })

    const initialedPromise = sdk.whenInitialed()

    await sdk.init()
    await expect(initialedPromise).resolves.toBeUndefined()
  })
})
