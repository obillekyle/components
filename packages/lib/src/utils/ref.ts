import type { ComponentPublicInstance, Ref } from 'vue'

type RefGetter = (
  ref: Element | ComponentPublicInstance | null,
  refs: Record<string, any>
) => void

export function fnRef<T extends Ref>(ref: T): RefGetter {
  return (value) => {
    if (!value) return
    ref.value = '$el' in value ? value.$el : value
  }
}
