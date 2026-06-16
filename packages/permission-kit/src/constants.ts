import type { InjectionKey } from 'vue'

import type { PermissionSDK } from './sdk'

export enum PermissionCalculateMode {
  AND = 'and',
  OR = 'or',
}

export const INJECTION_KEY: InjectionKey<PermissionSDK> = Symbol()
