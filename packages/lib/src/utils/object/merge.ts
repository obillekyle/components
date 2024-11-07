import { reactive } from 'vue'
import { isPureObject } from './is'

export function mergeObject<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const output = { ...target } as Record<string, any>

  for (const key of Object.keys(source)) {
    const targetValue = (target as any)[key]
    const sourceValue = (source as any)[key]

    if (sourceValue === undefined) continue

    output[key] =
      isPureObject(targetValue) && isPureObject(sourceValue)
        ? mergeObject(targetValue, sourceValue)
        : sourceValue
  }

  return output as T & U
}

export function shallowMerge<T extends object, O>(
  target: T,
  source: O
): T & O {
  return Object.assign({}, target, source)
}

/** Modifies original object, beware of side effects */
export function replaceDeep(ref: any, value: any, shallow = false) {
  if (!isPureObject(value)) return value

  ref = isPureObject(ref) ? ref : reactive({})

  for (const key in value)
    ref[key] = shallow ? value[key] : replaceDeep(ref[key], value[key])
  for (const key in ref) key in value || delete ref[key]

  return ref
}
