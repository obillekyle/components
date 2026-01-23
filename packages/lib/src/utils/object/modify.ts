export function pick<T extends any, K extends (keyof T)[] = []>(
  object: T,
  keys: K
): Pick<T, K[number]>
export function pick(object: any, keys: string[]) {
  const keySet = new Set(keys)
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => keySet.has(key))
  )
}

type ExcludeFunction = <T extends object, K extends (keyof T)[] = []>(
  object: T,
  key: K
) => Omit<T, K[number]>

export const exclude: ExcludeFunction = (object, keys: any): any => {
  const keySet = new Set(keys)
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keySet.has(key))
  )
}

type ToArrayFunction = {
  <T>(value: Iterable<T>): T[]
}

export const toArray: ToArrayFunction = (value) => {
  if (Array.isArray(value)) return value
  if (typeof value[Symbol.iterator] === 'function') return [...value]

  throw new TypeError('Unsupported type')
}
