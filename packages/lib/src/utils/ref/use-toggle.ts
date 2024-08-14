import type { Ref } from 'vue'

import { ref } from 'vue'
import { evaluate } from '../function/evaluate'

type ToggleValues = boolean | (1 | 0) | ('on' | 'off')
type ToggleFn<T extends ToggleValues> = {
  (): void
  (value: T | ((value: T) => T | undefined)): void
}

// prettier-ignore
type UseToggle = {
  (): [Ref<boolean>, ToggleFn<boolean>]
  <T extends 1 | 0>(value: T): [Ref<1 | 0>, ToggleFn<1 | 0>]
  <T extends 'on' | 'off'>(value: T): [Ref<'on' | 'off'>, ToggleFn<'on' | 'off'>]
}

export const useToggle: UseToggle = function (value: any = false): any {
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

    if (typeof value === 'function') {
      toggle(evaluate(value, state.value))
      return
    }

    state.value = value
  }

  return [state, toggle]
}
