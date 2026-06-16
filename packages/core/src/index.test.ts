import { describe, expect, it } from 'vitest'
import { createEventBus, defineAdminKitContext } from './index'

describe('@lsh/core', () => {
  it('creates an immutable admin kit context', () => {
    const context = defineAdminKitContext({
      appId: 'admin',
      environment: 'development',
      metadata: {
        region: 'cn'
      }
    })

    expect(Object.isFrozen(context)).toBe(true)
    expect(Object.isFrozen(context.metadata)).toBe(true)
    expect(context.appId).toBe('admin')
  })

  it('emits typed events and supports unsubscribe', () => {
    const bus = createEventBus<{ ready: { appId: string } }>()
    const received: string[] = []
    const unsubscribe = bus.on('ready', (payload) => {
      received.push(payload.appId)
    })

    bus.emit('ready', { appId: 'admin' })
    unsubscribe()
    bus.emit('ready', { appId: 'ignored' })

    expect(received).toEqual(['admin'])
  })
})
