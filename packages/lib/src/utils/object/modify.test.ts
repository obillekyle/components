import { exclude, pick } from './modify'

describe('Modifying objects', () => {
  test('exclude keys', () => {
    expect(exclude({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 })
  })

  test('pick keys', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 })
  })
})
