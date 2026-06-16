<template>
  <template v-if="status === 'granted'">
    <slot name="granted">
      <slot />
    </slot>
  </template>
  <template v-else>
    <slot name="denied"></slot>
  </template>
</template>

<script setup lang="ts">
import { watch } from 'vue'

import { PermissionCalculateMode } from '../constants'
import { usePermission } from '../hooks/use-permission'
import type { PermissionCommonProps } from '../types'

interface PermissionRenderEvents {
  // 已授权
  (e: 'granted'): void
  // 未授权
  (e: 'denied'): void
}

const props = withDefaults(defineProps<PermissionCommonProps>(), {
  calculator: () => PermissionCalculateMode.AND,
})
const emit = defineEmits<PermissionRenderEvents>()

const { status } = usePermission(props)

watch(status, () => {
  if (status.value === 'granted') {
    emit('granted')
  } else {
    emit('denied')
  }
}, {
  immediate: true,
})
</script>
