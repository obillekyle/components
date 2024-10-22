import type { MaybeFunction } from '@/utils'
import type { ComputedRef, Ref, ShallowReactive, UnwrapRef } from 'vue'

import { computed, isReadonly, isRef, shallowReactive, watch } from 'vue'

export const ProxyValue = Symbol('value')

export type WithProxyRef<T extends Ref> = ShallowReactive<UnwrapRef<T>> & {
  [ProxyValue]: UnwrapRef<T>
}
export function toProxy<T extends Ref<object>>(
  refValue: T,
  readonly = false
): WithProxyRef<T> {
  const reactiveTarget = shallowReactive<any>(refValue.value)
  watch(
    refValue,
    (v: any, o: any) => {
      for (const key in o) delete reactiveTarget[key]
      for (const key in v) reactiveTarget[key] = v[key]
    },
    { immediate: true }
  )

  return new Proxy(reactiveTarget, {
    get: (t, k, r) => (k === ProxyValue ? t : Reflect.get(t, k, r)),
    set(_, key, value, receiver) {
      if (readonly || isReadonly(refValue)) return false

      if (key === ProxyValue) {
        refValue.value = value
        return true
      }

      return Reflect.set(refValue.value, key, value, receiver)
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
