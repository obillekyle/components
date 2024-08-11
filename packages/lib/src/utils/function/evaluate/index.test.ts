import { evaluate } from '.'

function add(a: number, b: number) {
  return a + b
}

test('evaluate function', () => {
  expect(evaluate(() => 1)).toBe(1)
})

test('evaluate function with arguments', () => {
  expect(evaluate(add, 1, 2)).toBe(3)
})

test('evaluate object', () => {
  expect(evaluate('a')).toBe('a')
})

test('evaluate object with arguments', () => {
  expect(evaluate('a', 1, 2)).toBe('a')
})
