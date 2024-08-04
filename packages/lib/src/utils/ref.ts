import type { ComponentPublicInstance, Ref } from 'vue'

import { computed, onMounted, onUnmounted, ref } from 'vue'
import { evaluate, parser, stringify } from './object'

type RefGetter = (
  ref: Element | ComponentPublicInstance | null,
  refs: Record<string, any>
) => void

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

type StateFn<T> = (v: T | ((v: T) => T)) => any

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

export function useLocalStorage<T>(key: string): Ref<T | undefined>
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T>
export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const value = ref<T | undefined>(defaultValue)

  function getData(): any {
    const data = localStorage.getItem(key)
    return data ? parser(data) : defaultValue
  }

  function handleDataChange(event: StorageEvent) {
    if (event.key === key) {
      value.value = getData()
    }
  }

  onMounted(() => {
    value.value = getData()
    addEventListener('storage', handleDataChange)
  })

  onUnmounted(() => {
    removeEventListener('storage', handleDataChange)
  })

  return computed({
    get: () => value.value,
    set: (v) => {
      localStorage.setItem(key, stringify(v))
      value.value = v
    }
  })
}

type ToggleValues = boolean | (1 | 0) | ('on' | 'off')
type ToggleFn<T extends ToggleValues> = {
  (): void
  (value: T | ((value: T) => T | undefined)): void
}

export function useToggle(): [Ref<boolean>, ToggleFn<boolean>]
export function useToggle<T extends 'on' | 'off'>(
  value: T
): [Ref<'on' | 'off'>, ToggleFn<'on' | 'off'>]
export function useToggle<T extends 1 | 0>(
  value: T
): [Ref<1 | 0>, ToggleFn<1 | 0>]
export function useToggle(value: any = false): [Ref<any>, ToggleFn<any>] {
  const state = ref(value)

  function toggle(value?: any) {
    if (value instanceof Event) {
      value = undefined
    }

    if (!value) {
      switch (typeof state.value) {
        case 'boolean': {
          state.value = !state.value
          break
        }
        case 'string': {
          state.value = state.value === 'on' ? 'off' : 'on'
          break
        }
        case 'number': {
          state.value = state.value ? 0 : 1
          break
        }
      }
      return
    }

    state.value = evaluate(value, state.value) ?? state.value
  }

  return [state, toggle]
}
