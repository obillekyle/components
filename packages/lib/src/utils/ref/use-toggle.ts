import { ref, type Ref } from 'vue'
import { evaluate } from '../function/evaluate'

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
