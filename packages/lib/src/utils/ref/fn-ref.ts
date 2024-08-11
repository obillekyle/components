import type { Ref } from 'vue'
import type { RefGetter } from './types'

export function fnRef<T extends Ref<Element | undefined | Element[]>>(
  ref: T
): RefGetter {
  return (value) => {
    if (!value) return

    const element: Element = '$el' in value ? value.$el : value
    if (Array.isArray(ref.value)) {
      ref.value.push(element)
      return
    }

    ref.value = element
  }
}
