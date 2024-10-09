import { evaluate } from '../function'

function invalidFunction() {
  throw new Error('Invalid function')
}

const transform = {
  string: {
    stringify: (str: string) => 'string:' + str,
    parser: (str: string) => str.slice(7)
  },
  number: {
    stringify: (num: number) => 'number:' + num,
    parser: (str: string) => Number(str.slice(7))
  },
  bigint: {
    stringify: (num: bigint) => 'bigint:' + num,
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
    stringify: (sym: symbol) => 'symbol:' + sym.description,
    parser: (str: string) => Symbol.for(str.slice(7))
  },
  object: {
    stringify: (obj: any) => {
      if (obj === null) return 'object:null'
      if (obj instanceof Date) return 'object:date:' + obj.getTime()

      if (Array.isArray(obj)) {
        const array = obj.map((i) => stringify(i))
        return 'object:' + JSON.stringify(array)
      }

      const strObj: any = {}
      for (const key in obj) strObj[key] = stringify(obj[key])
      return 'object:' + JSON.stringify(strObj)
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

export function parser(str: string): any {
  if (typeof str !== 'string') return str

  const type = str.split(':', 2)[0] as keyof typeof transform
  return evaluate(transform[type].parser ?? ((v: string) => v), str)
}
