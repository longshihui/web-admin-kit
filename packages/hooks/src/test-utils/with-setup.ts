import { effectScope, nextTick } from 'vue'

export async function withSetup<T>(setup: () => T): Promise<[T, () => void]> {
  const scope = effectScope()
  let result!: T

  scope.run(() => {
    result = setup()
  })

  await nextTick()

  return [result, () => scope.stop()]
}
