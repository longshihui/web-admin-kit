import type { App } from 'vue'

import { and } from './calculator'
import { INJECTION_KEY } from './constants'
import { normalizeCalculator, normalizeCodes } from './helpers'
import { PermissionStore } from './store'
import type {
  PermissionCode,
  PermissionListener,
  PermissionOptions,
} from './types'

export interface PermissionSDKOptions {
  fetchResourceList: () => Promise<PermissionCode[]>
}

export class PermissionSDK {
  readonly options: PermissionSDKOptions
  readonly store: PermissionStore
  // 是否已初始化
  private isInitialed: boolean
  constructor(options: PermissionSDKOptions) {
    this.options = options
    this.store = new PermissionStore()
    this.isInitialed = false
  }
  async init() {
    this.isInitialed = false

    this.setCodes(await this.options.fetchResourceList())

    this.isInitialed = true
  }
  getCodes() {
    return this.store.codes
  }
  setCodes(codes: PermissionCode[]) {
    this.store.setCodes(codes)
  }
  hasPermission(props: PermissionOptions) {
    if (typeof props === 'string') {
      return and([props], this.getCodes().value)
    }

    const codes = Array.isArray(props) ? props : normalizeCodes(props.codes)
    const calculator = Array.isArray(props) ? and : normalizeCalculator(props.calculator)

    return calculator(codes, this.getCodes().value)
  }
  watch(listener: PermissionListener) {
    return this.store.watch(listener)
  }
  whenInitialed(cb?: () => void) {
    return new Promise<void>((resolve) => {
      const unwatch = this.store.watch(() => {
        /**
         * 当store变更时，初始化仍未完成
         * 故将初始化是否完成的判断推迟至下一个事件循环中进行判断
         */
        Promise.resolve().then(() => {
          if (this.isInitialed) {
            unwatch()
            cb?.()
            resolve()
          }
        })
      })
    })
  }
  install(app: App) {
    app.provide(INJECTION_KEY, this)
  }
}
