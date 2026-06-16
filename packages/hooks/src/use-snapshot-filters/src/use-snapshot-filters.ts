import { cloneDeep } from 'lodash-es'
import { ref, toRaw, watch } from 'vue'
import type { Ref } from 'vue'

import type { UseSnapshotFiltersOptions, UseSnapshotFiltersReturn } from './types'

export function useSnapshotFilters<F extends Record<string, unknown>>(
  options: UseSnapshotFiltersOptions<F>
): UseSnapshotFiltersReturn<F> {
  const { filters, defaultValues } = options
  const cacheFilters = ref<F>(cloneDeep(filters.value)) as Ref<F>
  const _defaultValues = defaultValues ?? createDefaultValues(filters.value)

  const commit = () => {
    filters.value = cloneDeep(toRaw(cacheFilters.value))
  }

  const reset = () => {
    Object.keys(_defaultValues).forEach((key: keyof F) => {
      cacheFilters.value[key] = _defaultValues[key]()
    })

    commit()
  }

  const restore = () => {
    cacheFilters.value = cloneDeep(toRaw(filters.value))
  }

  watch(filters, restore, {
    deep: true,
  })

  return {
    filters,
    cacheFilters,
    reset,
    commit,
    restore,
  }
}

function createDefaultValues<F extends Record<string, unknown>>(
  filters: F
): Required<UseSnapshotFiltersOptions<F>>['defaultValues'] {
  return Object.keys(filters).reduce((defaultValues, key) => {
    const defaultValue = cloneDeep(filters[key])

    defaultValues[key] = () => defaultValue

    return defaultValues
  }, Object.create(null))
}
