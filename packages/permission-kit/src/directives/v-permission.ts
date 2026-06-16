import type { FunctionDirective } from 'vue'

import { usePermissionSDK } from '../hooks'
import type { PermissionSDK } from '../sdk'
import type { PermissionOptions } from '../types'

export function createPermissionDirectives(sdk: PermissionSDK) {
  const displayCache = new WeakMap<HTMLElement, string>()

  const vPermission: FunctionDirective<HTMLElement, PermissionOptions> = (el, binding) => {
    const { value } = binding

    if (sdk.hasPermission(value)) {
      el.style.display = displayCache.get(el) ?? ''
    } else {
      displayCache.set(el, el.style.display || '')
      el.style.display = 'none'
    }
  }

  return {
    vPermission,
  }
}

export const usePermissionDirectives = () => {
  const { sdk } = usePermissionSDK()

  return createPermissionDirectives(sdk)
}
