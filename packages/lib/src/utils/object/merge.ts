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
