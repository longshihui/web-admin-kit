import { inject } from 'vue'

import { INJECTION_KEY } from '../constants'

/**
 * 使用权限
 */
export function usePermissionSDK() {
  const sdk = inject(INJECTION_KEY)

  if (!sdk) {
    throw new Error('Permission SDK没有被正确install, 请检查是否在使用该API前使用app.install了SDK')
  }

  return {
    sdk,
  }
}
