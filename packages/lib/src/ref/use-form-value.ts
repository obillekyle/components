import type { Reactive, Ref } from 'vue'

import { computed, inject, reactive, watch } from 'vue'

export type VModelProps<T> = {
  defaultValue?: T
  name?: string
  value?: T
}

export type BoolVModelProps = {
  defaultChecked?: boolean
  checked?: boolean
  name?: string
}

const FORM_INJECT_KEY = 'md-form-value'
export function useFormValue<T extends object>(): Reactive<T> {
  return inject(FORM_INJECT_KEY, reactive<any>({}))
}

function createValue<T>(
  defaultValue: T,
  props: any,
  model: Ref<T | undefined>,
  onSet = (value: T): T | void => value,
  bool = false
) {
  const [defKey, valKey] = bool
    ? ['defaultChecked', 'checked']
    : ['defaultValue', 'value']

  const form = useFormValue<any>()
  const name = computed(() => props.name ?? '')
  const defs = props[defKey] ?? defaultValue

  const value = computed({
    get: () => props[valKey] ?? model.value ?? form[name.value] ?? defs,
    set: (value) => (model.value = onSet(value) ?? value)
  })

  watch([value, name], ([value, name]) => name && (form[name] = value), {
    immediate: true
  })

  return value
}

export function useValue<T>(
  defaultValue: T,
  props: VModelProps<T>,
  model: Ref<T | undefined>,
  onSet = (value: T): T | void => value
): Ref<T> {
  return createValue(defaultValue, props, model, onSet)
}

export function useBoolValue(
  defaultChecked: boolean,
  props: BoolVModelProps,
  model: Ref<boolean | undefined>,
  onSet = (value: boolean): boolean | void => value
): Ref<boolean> {
  return createValue(defaultChecked, props, model, onSet, true)
}
