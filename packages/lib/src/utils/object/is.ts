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
  if (type === 'null') return value === null
  if (type === 'array') return Array.isArray(value)
  if (type === 'object') return typeof value === 'object' && value !== null

  return typeof value === type
}

export const as = <T>(v: any): T => v

export function assert(value: any, message?: string): asserts value {
  if (!value) throw new Error(message)
}

export const isPureObject = (obj: any): boolean =>
  typeof obj === 'object' && obj !== null && obj.constructor === Object
