import {
  isReadonly,
  shallowReactive,
  watch,
  type Ref,
  type ShallowReactive,
  type UnwrapRef
} from 'vue'

export const ProxyValue = Symbol('value')

export type WithProxyRef<T extends Ref> = ShallowReactive<UnwrapRef<T>> & {
  [ProxyValue]: UnwrapRef<T>
}
export function toProxy<T extends Ref<object>>(
  refValue: T,
  readonly = false
): WithProxyRef<T> {
  const reactiveTarget = shallowReactive(refValue.value)

  watch(refValue, (v) => Object.assign(reactiveTarget, v))

  return new Proxy(reactiveTarget, {
    get: (target, key, receiver) =>
      key === ProxyValue ? target : Reflect.get(target, key, receiver),
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
