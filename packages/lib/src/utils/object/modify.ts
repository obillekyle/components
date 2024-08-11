export function pick<T extends any, K extends (keyof T)[] = []>(
  object: T,
  keys: K
): Pick<T, K[number]>
export function pick(object: any, keys: string[]) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => keys.includes(key))
  )
}

type ExcludeFunction = <T extends object, K extends (keyof T)[] = []>(
  object: T,
  key: K
) => Omit<T, K[number]>

export const exclude: ExcludeFunction = (object, keys: any): any => {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key))
  )
}
