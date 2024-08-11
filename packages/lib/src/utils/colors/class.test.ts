import { Colors } from './class'

test('static colors from string', () => {
  expect(Colors.from('red')).toBeInstanceOf(Colors)
})

test('static colors from Colors', () => {
  const colors = new Colors('red')
  expect(Colors.from(colors)).toBeInstanceOf(Colors)
})

test('static colors is isLight', () => {
  expect(Colors.isLight('white')).toBe(true)
  expect(Colors.isLight('black')).toBe(false)
})

test('colors constructor', () => {
  expect(new Colors('red')).toBeInstanceOf(Colors)
})

test('colors set string', () => {
  const colors = new Colors('red')
  const setYellow = colors.set('yellow')
  expect(setYellow).toBeInstanceOf(Colors)
})

const validHex = (hex: string) =>
  [4, 5, 7, 9].includes(hex.length) && hex.startsWith('#')
test('colors shade hex', () => {
  const colors = new Colors('red')
  expect(colors.shade(50)).toSatisfy(validHex)
  expect(colors.shade(50, 0.5)).toSatisfy(validHex)
})

test('colors isLight', () => {
  const color = new Colors('white')

  expect(color.isLight(20)).toBe(false)
  expect(color.isLight(80)).toBe(true)
})

test('colors to string', () => {
  const colors = new Colors('red')
  expect(colors.toString()).toSatisfy(validHex)
})

test('colors get hex', () => {
  const colors = new Colors('red')
  expect(colors.hex).toSatisfy(validHex)
})

test('colors get opposite', () => {
  const colors = new Colors('red')
  expect(colors.opposite).toBeInstanceOf(Colors)
})
