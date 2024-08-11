import { evaluate } from '../function'

function invalidFunction() {
  throw new Error('Invalid function')
}

const transform = {
  string: {
    stringify: (str: string) => `string:${str}`,
    parser: (str: string) => str.slice(7)
  },
  number: {
    stringify: (num: number) => `number:${num}`,
    parser: (str: string) => Number(str.slice(7))
  },
  bigint: {
    stringify: (num: bigint) => `bigint:${num.toString()}`,
    parser: (str: string) => BigInt(str.slice(8))
  },
  boolean: {
    stringify: (bool: boolean) => 'boolean:' + bool,
    parser: (str: string) => str.slice(8) === 'true'
  },
  undefined: {
    stringify: () => 'undefined',
    parser: () => {}
  },
  function: {
    stringify: () => 'function',
    parser: () => invalidFunction
  },
  symbol: {
    stringify: (sym: symbol) => `symbol:${sym.description}`,
    parser: (str: string) => Symbol.for(str.slice(7))
  },
  object: {
    stringify: (obj: any) => {
      if (obj === null) return 'object:null'
      if (obj instanceof Date) return `object:date:${obj.getTime()}`

      if (Array.isArray(obj)) {
        const array = obj.map((i) => stringify(i))
        return `object:${JSON.stringify(array)}`
      }

      const strObj: any = {}
      for (const key in obj) strObj[key] = stringify(obj[key])
      return `object:${JSON.stringify(strObj)}`
    },
    parser: (str: string) => {
      // eslint-disable-next-line unicorn/no-null
      if (str === 'object:null') return null

      if (str.startsWith('object:date:'))
        return new Date(Number(str.slice(5)))

      const obj = JSON.parse(str.slice(7))

      if (Array.isArray(obj)) {
        return obj.map((str) => parser(str))
      }

      for (const key in obj) {
        obj[key] = parser(obj[key])
      }
      return obj
    }
  }
}

export function stringify(obj?: any): string {
  const type = typeof obj
  return evaluate(transform[type].stringify, obj)
}

function updateStr(str: string) {
  if (!str.startsWith('~$')) return str

  if (str.startsWith('~$fun')) return `function`
  if (str.startsWith('~$udf')) return `undefined`
  if (str.startsWith('~$num:')) return `number:` + str.slice(6)
  if (str.startsWith('~$bignum:')) return `bigint:` + str.slice(9)
  if (str.startsWith('~$str:')) return `string:` + str.slice(6)
  if (str.startsWith('~$sym:')) return `symbol:` + str.slice(6)
  if (str.startsWith('~$null')) return `object:null`
  if (str.startsWith('~$arr:')) return `object:${str.slice(6)}`
  if (str.startsWith('~$obj:')) return `object:${str.slice(6)}`
  if (str.startsWith('~$date:')) return `object:date:` + str.slice(7)
  if (str.startsWith('~$bool:'))
    return `boolean:` + str[8] === '1' ? 'true' : 'false'

  return str
}

export function parser(str: string): any {
  if (typeof str !== 'string') return str

  str = updateStr(str)

  const type = str.split(':', 2)[0] as keyof typeof transform
  return evaluate(transform[type].parser ?? ((v: string) => v), str)
}
