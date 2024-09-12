import { computed, inject, ref, watch, type Ref } from 'vue'

export type VModelProps<T> = {
  defaultValue?: T
  name?: string
  value?: T
}

export type BoolVModelProps<T> = {
  defaultChecked?: T
  name?: string
  checked?: T
}

const FORM_INJECT_KEY = 'md-form-value'
export function useFormValue<T>(): Ref<T> {
  return inject(FORM_INJECT_KEY, ref({} as any))
}

export function useValue<T, R extends Ref>(
  defaultValue: T,
  props: VModelProps<T>,
  model: R,
  onSet: (value: T) => T = (value) => value
): Ref<T> {
  const form = inject(FORM_INJECT_KEY, ref({} as any))
  const value = computed({
    get: () =>
      props.value ??
      model.value ??
      form.value[props.name ?? ''] ??
      props.defaultValue ??
      defaultValue,
    set: (value: T) => (model.value = onSet(value))
  })

  watch(value, (value) => props.name && (form.value[props.name] = value))
  return value
}

export function useBoolValue<T extends boolean>(
  defaultChecked: T,
  props: BoolVModelProps<T>,
  model: Ref<boolean | undefined>,
  onSet: (value: T) => T = (value) => value
): Ref<T> {
  const form = inject(FORM_INJECT_KEY, ref({} as any))
  const value = computed({
    get: () =>
      props.checked ??
      model.value ??
      form.value[props.name ?? ''] ??
      props.defaultChecked ??
      defaultChecked,
    set: (value: T) => (model.value = onSet(value))
  })

  watch(value, (value) => props.name && (form.value[props.name] = value))
  return value
}
