import { ref, type Ref } from 'vue'
import { evaluate } from '../function/evaluate'
import type { RefGetter, StateFn } from './types'

export function customRef<T>(): [
  Ref<T | undefined>,
  T extends Element ? RefGetter : StateFn<T | undefined>
]
export function customRef<T>(defaultValue: T): [Ref<T>, StateFn<T>]
export function customRef<T>(defaultValue?: T): [Ref<T>, StateFn<T>] {
  const value = ref<any>(defaultValue)
  return [
    value,
    function setRef(v: T | undefined | ((v: T) => T)) {
      if (typeof v === 'function') {
        value.value = evaluate(v, value.value)
        return
      }

      if (typeof v === 'object' && v && '$el' in v) {
        value.value = v.$el
        return
      }

      value.value = v
    }
  ]
}
