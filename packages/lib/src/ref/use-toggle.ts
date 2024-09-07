import type { Ref } from 'vue'

import { ref } from 'vue'
import { evaluate } from '../utils/function/evaluate'

type ToggleFn<I> = {
  (): void
  (value: I | ((value: I) => I | undefined)): void
}

// prettier-ignore
type UseToggle = {
  (): [Ref<boolean>, ToggleFn<boolean>]
  (defaultValue?: boolean): [Ref<boolean>, ToggleFn<boolean>]
  <O, I>(defaultValue: I | O, off: O, on: I): [Ref<I | O>, ToggleFn<I | O>]
}

export const useToggle: UseToggle = function (
  value = false,
  off = false,
  on = true
): any {
  const state = ref(value)

  function toggle(value?: any) {
    if (value instanceof Event) {
      value = undefined
    }

    if (value === undefined) {
      value = state.value === off ? on : off
      return
    }

    if (typeof value === 'function') {
      toggle(evaluate(value, state.value))
      return
    }

    state.value = value === off || value === on ? value : off
  }

  return [state, toggle]
}
