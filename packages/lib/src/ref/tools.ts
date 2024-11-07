import type { MaybeFunction } from '@/utils'
import type { ComputedRef, Ref, ShallowReactive } from 'vue'

import { replaceDeep } from '@/utils/object/merge'
import { computed, isReadonly, isRef, shallowReactive, watch } from 'vue'

export const ProxyValue = Symbol('value')
export type WithProxyRef<T extends object> = ShallowReactive<T> & {
  [ProxyValue]: T
}
export function toProxy<T extends object>(
  ref: Ref<T>,
  readonly = false
): WithProxyRef<T> {
  const state = shallowReactive<any>(ref.value)
  watch(ref, (v) => replaceDeep(state, v, true), {
    immediate: true,
    deep: true
  })

  return new Proxy(state, {
    get: (t, k, r) => (k === ProxyValue ? t : Reflect.get(t, k, r)),
    set(_, key, value) {
      if (readonly || isReadonly(ref)) return false

      key === ProxyValue
        ? (ref.value = value)
        : ((ref.value as any)[key] = value)
      return true
    }
  }) as WithProxyRef<T>
}

export function modifiedComputed<T>(
  value: MaybeFunction<T> | Ref<T>
): ComputedRef<T> {
  return computed(
    (typeof value === 'function'
      ? value
      : () => (isRef(value) ? value.value : value)) as any
  )
}
