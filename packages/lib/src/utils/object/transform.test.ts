/* eslint-disable unicorn/no-null*/
/* eslint-disable unicorn/no-useless-undefined */

import { parser, stringify } from './transform'

class Dummy {
  constructor() {}
}

describe('stringify', () => {
  test('boolean', () => {
    expect(stringify(true)).toBe('boolean:true')
  })

  test('number', () => {
    expect(stringify(1)).toBe('number:1')
  })

  test('string', () => {
    expect(stringify('a')).toBe('string:a')
  })

  test('undefined', () => {
    expect(stringify()).toBe('undefined')
    expect(stringify(undefined)).toBe('undefined')
  })

  test('null', () => {
    expect(stringify(null)).toBe('object:null')
  })

  test('array', () => {
    expect(stringify([1, 2, 3])).toBe(
      'object:["number:1","number:2","number:3"]'
    )
  })

  test('object', () => {
    expect(stringify({ a: 1, b: 2 })).toBe(
      'object:{"a":"number:1","b":"number:2"}'
    )
  })

  test('function', () => {
    expect(stringify(() => 1)).toBe('function')
  })

  test('class', () => {
    expect(stringify(Dummy)).toBe('function')
  })

  test('constructed class', () => {
    expect(stringify(new Dummy())).toBe('object:{}')
  })

  test('bigint', () => {
    expect(stringify(1n)).toBe('bigint:1')
  })

  test('symbol', () => {
    expect(stringify(Symbol('a'))).toBe('symbol:a')
  })
})

describe('parser', () => {
  test('boolean', () => {
    expect(parser('boolean:true')).toBe(true)
  })

  test('number', () => {
    expect(parser('number:1')).toBe(1)
  })

  test('string', () => {
    expect(parser('string:a')).toBe('a')
  })

  test('undefined', () => {
    expect(parser('undefined')).toBe(undefined)
  })

  test('null', () => {
    expect(parser('object:null')).toBe(null)
  })

  test('array', () => {
    expect(parser('object:["number:1","number:2","number:3"]')).toEqual([
      1, 2, 3
    ])
  })

  test('object', () => {
    expect(parser('object:{"a":"number:1","b":"number:2"}')).toEqual({
      a: 1,
      b: 2
    })
  })

  test('function', () => {
    expect(parser('function')).instanceOf(Function)
    expect(parser('function')).throws('Invalid function')
  })

  test('class', () => {
    expect(parser('function')).instanceOf(Function)
  })

  test('bigint', () => {
    expect(BigInt(1)).toBe(1n)
  })

  test('symbol', () => {
    expect(parser('symbol:a')).toBeTypeOf('symbol')
    expect(parser('symbol:a').description).toBe(Symbol('a').description)
  })
})
