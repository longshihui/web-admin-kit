export type MaybePromise<T> = T | Promise<T>

export type EventMap = Record<string, unknown>

export type EventHandler<Payload> = (payload: Payload) => void

export type Unsubscribe = () => void

export interface AdminKitContext {
  appId: string
  environment: 'development' | 'test' | 'staging' | 'production'
  metadata?: Record<string, unknown>
}

export function defineAdminKitContext(context: AdminKitContext): Readonly<AdminKitContext> {
  return Object.freeze({
    ...context,
    metadata: context.metadata ? Object.freeze({ ...context.metadata }) : undefined
  })
}

export function createEventBus<Events extends EventMap>() {
  const listeners = new Map<keyof Events, Set<EventHandler<Events[keyof Events]>>>()

  function on<Name extends keyof Events>(name: Name, handler: EventHandler<Events[Name]>): Unsubscribe {
    const handlers = listeners.get(name) ?? new Set<EventHandler<Events[keyof Events]>>()
    handlers.add(handler as EventHandler<Events[keyof Events]>)
    listeners.set(name, handlers)

    return () => {
      handlers.delete(handler as EventHandler<Events[keyof Events]>)
      if (handlers.size === 0) {
        listeners.delete(name)
      }
    }
  }

  function emit<Name extends keyof Events>(name: Name, payload: Events[Name]): void {
    listeners.get(name)?.forEach((handler) => {
      ;(handler as EventHandler<Events[Name]>)(payload)
    })
  }

  function clear<Name extends keyof Events>(name?: Name): void {
    if (name) {
      listeners.delete(name)
      return
    }

    listeners.clear()
  }

  return {
    on,
    emit,
    clear
  }
}
