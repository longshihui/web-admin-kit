import { computed, watch } from 'vue'

import type { PermissionOptions } from '../types'
import { usePermissionSDK } from './use-permission-sdk'

interface PermissionChangeCallback {
  (): void | Promise<void>
}
/**
 * 使用权限
 */
export function usePermission(options: PermissionOptions) {
  const { sdk } = usePermissionSDK()

  const status = computed(() => {
    return sdk.hasPermission(options) ? 'granted' : 'denied'
  })
  const whenGrantedCallbacks: Array<PermissionChangeCallback> = []
  const whenDeniedCallbacks: Array<PermissionChangeCallback> = []

  watch(
    status,
    () => {
      invokeCallbacks(status.value === 'granted' ? whenGrantedCallbacks : whenDeniedCallbacks)
    },
    {
      immediate: true,
    }
  )

  const whenGranted = (fun: PermissionChangeCallback) => {
    whenGrantedCallbacks.push(fun)
  }

  const whenDenied = (fun: PermissionChangeCallback) => {
    whenDeniedCallbacks.push(fun)
  }

  return {
    status,
    whenGranted,
    whenDenied,
  }
}

function invokeCallbacks(cbs: PermissionChangeCallback[]) {
  cbs.forEach((cb) => cb())
}
