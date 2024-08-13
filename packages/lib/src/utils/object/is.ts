// prettier-ignore
export type TypeFromTypes<T extends Types> = 
  T extends 'array'     ? any[]     :
  T extends 'bigint'    ? bigint    : 
  T extends 'boolean'   ? boolean   : 
  T extends 'function'  ? Function  : 
  T extends 'null'      ? null      : 
  T extends 'number'    ? number    : 
  T extends 'object'    ? object    : 
  T extends 'string'    ? string    : 
  T extends 'symbol'    ? symbol    : 
  T extends 'undefined' ? undefined : 
  never

export type Types =
  | 'array'
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'null'
  | 'number'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined'

export function is<T extends Types>(
  value: unknown,
  type: T
): value is TypeFromTypes<T> {
  if (type === 'array') return Array.isArray(value)
  if (type === 'null') return value === null
  if (type === 'object') return value !== null

  return typeof value === type
}

export const as = <T>(v: any): T => v