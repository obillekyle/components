export function dataURLtoBlob(dataURL: string): Blob | undefined {
  const dataURLRegex = /^data:([^,;]+);base64,(.*)$/
  const match = dataURL.match(dataURLRegex)

  if (!match) return undefined

  const mimeType = match[1]
  const base64Data = match[2]

  const byteCharacters = atob(base64Data)
  const byteNumbers = Array.from<number>({ length: byteCharacters.length })
  for (let index = 0; index < byteCharacters.length; index++) {
    byteNumbers[index] = byteCharacters.codePointAt(index) ?? 0
  }
  const byteArray = new Uint8Array(byteNumbers)

  const blob = new Blob([byteArray], { type: mimeType })
  return blob
}

export type MaybeFunction<T extends any> = T | (() => T)
export function evaluate<
  K extends any,
  V = K extends () => any ? ReturnType<K> : K
>(
  object: K,
  ...arguments_: V extends (...arguments_: infer P) => any ? P : any
): V
export function evaluate(this: any, object: any, ...parameters: any): any {
  return typeof object === 'function'
    ? object.call(this, ...parameters)
    : object
}

export function exclude<T extends any, K extends (keyof T)[] = []>(
  object: T,
  keys: K
): Omit<T, K[number]>
export function exclude(object: any, keys: string[]) {
  if (keys.length === 0) return object

  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key))
  )
}

export function pick<T extends any, K extends (keyof T)[] = []>(
  object: T,
  keys: K
): Pick<T, K[number]>
export function pick(object: any, keys: string[]) {
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => keys.includes(key))
  )
}

export function is(value: null, type: 'null'): true
export function is(value: string, type: 'string'): true
export function is(value: number, type: 'number'): true
export function is(value: bigint, type: 'bigint'): true
export function is(value: symbol, type: 'symbol'): true
export function is(value: boolean, type: 'boolean'): true
export function is(value: () => any, type: 'function'): true
export function is(value: undefined, type: 'undefined'): true
export function is<O extends object>(
  value: object,
  type: 'object'
): value is O
export function is(
  value: any,
  type:
    | 'string'
    | 'number'
    | 'boolean'
    | 'null'
    | 'undefined'
    | 'object'
    | 'function'
    | 'bigint'
    | 'symbol'
): boolean
export function is(value: any, type: string) {
  return value === null ? type === 'null' : typeof value == type
}

export function clean(objectUrl?: string) {
  typeof objectUrl === 'string' &&
    objectUrl.startsWith('blob:') &&
    URL.revokeObjectURL(objectUrl)
}

export const as = <T>(v: any): T => v

export function stringify(obj: any): string {
  const newObj: { [key: string]: string } = {}

  switch (typeof obj) {
    case 'string': {
      return `~$str:${obj}`
    }
    case 'number': {
      return `~$num:${obj.toString()}`
    }
    case 'bigint': {
      return `~$bignum:${obj.toString()}`
    }
    case 'boolean': {
      const boolToString = obj ? '1' : '0'
      return `~$bool:${boolToString}`
    }
    case 'undefined': {
      return '~$udf'
    }
    case 'function': {
      console.warn(
        'Functions will be replaced by a dummy function when parsed'
      )
      return '~$fun'
    }
    case 'symbol': {
      console.warn('Symbols will not be the same when parsed')
      return '~$sym:' + obj.description
    }
    case 'object': {
      if (obj === null) {
        return '~$null'
      }
      if (Array.isArray(obj)) {
        const map = obj.map((o) => stringify(o))
        return `~$arr:${JSON.stringify(map)}`
      }
      if (obj instanceof Date) {
        return `~$date:${obj.getTime()}`
      }
      if (obj instanceof Object) {
        for (const key in obj) {
          newObj[key] = stringify(obj[key])
        }
      }
    }
  }

  return `~$obj:${JSON.stringify(newObj)}`
}

export function parser(str: string): any {
  if (typeof str !== 'string') {
    return str
  }

  if (str === '~$null') {
    // eslint-disable-next-line unicorn/no-null
    return null
  }
  if (str.startsWith('~$num:')) {
    return Number(str.slice(6))
  }
  if (str.startsWith('~$bignum:')) {
    return BigInt(str.slice(9))
  }
  if (str.startsWith('~$str:')) {
    return str.slice(6)
  }
  if (str.startsWith('~$bool:')) {
    return str.slice(7) === '1'
  }
  if (str.startsWith('~$date:')) {
    return new Date(Number(str.slice(7)))
  }
  if (str.startsWith('~$fun')) {
    return () => {}
  }
  if (str.startsWith('~$sym:')) {
    return Symbol(str.slice(6))
  }
  if (str.startsWith('~$udf')) {
    return undefined
  }
  if (str.startsWith('~$arr:')) {
    const obj = JSON.parse(str.slice(6))
    return obj.map((o: any) => parser(o))
  }

  if (str.startsWith('~$obj:')) {
    const obj = JSON.parse(str.slice(6))
    for (const key in obj) {
      obj[key] = parser(obj[key])
    }
    return obj
  }
  return str
}
