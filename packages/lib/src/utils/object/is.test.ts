/* eslint-disable unicorn/no-null */
import { is } from './is'

// i don't know why aligned it,
// i just wasted my time here
// prettier-ignore
test('`is` check', () => {
  expect(is(     1     ,   'number'  )).toBe(true)
  expect(is(    [ ]    ,   'array'   )).toBe(true)
  expect(is(    { }    ,   'object'  )).toBe(true)
  expect(is(   false   ,  'boolean'  )).toBe(true)
  expect(is(    'a'    ,   'string'  )).toBe(true)
  expect(is( undefined , 'undefined' )).toBe(true)
  expect(is( () => 'a' ,  'function' )).toBe(true)
  expect(is(  Symbol() ,   'symbol'  )).toBe(true)
  expect(is(    null   ,    'null'   )).toBe(true)
})
