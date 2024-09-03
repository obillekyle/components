import type { ComponentPublicInstance } from 'vue'

export type RefGetter = (
  ref: Element | ComponentPublicInstance | null,
  refs: Record<string, any>
) => void

export type StateFn<T> = (v: T | ((v: T) => T)) => any
