import { Colors } from './class'
import { parseColors } from './parse-colors'

test('parse color string', () => {
  const colors = parseColors('red')
  expect(colors.primary).toBeInstanceOf(Colors)
  expect(colors.secondary).toBeInstanceOf(Colors)
  expect(colors.tertiary).toBeInstanceOf(Colors)
  expect(colors.neutral).toBeInstanceOf(Colors)
  expect(colors.error).toBeInstanceOf(Colors)
})

test('parse color class', () => {
  const colors = parseColors(new Colors('red'))

  expect(colors.primary).toBeInstanceOf(Colors)
  expect(colors.secondary).toBeInstanceOf(Colors)
  expect(colors.tertiary).toBeInstanceOf(Colors)
  expect(colors.neutral).toBeInstanceOf(Colors)
  expect(colors.error).toBeInstanceOf(Colors)
})

test('parse color object', () => {
  const colors = parseColors({
    primary: 'red'
  })

  expect(colors.primary).toBeInstanceOf(Colors)
  expect(colors.secondary).toBeInstanceOf(Colors)
  expect(colors.tertiary).toBeInstanceOf(Colors)
  expect(colors.neutral).toBeInstanceOf(Colors)
  expect(colors.error).toBeInstanceOf(Colors)
})

test('parse color object mixed', () => {
  const colors = parseColors({
    primary: 'red',
    secondary: new Colors('blue')
  })

  expect(colors.primary).toBeInstanceOf(Colors)
  expect(colors.secondary).toBeInstanceOf(Colors)
  expect(colors.tertiary).toBeInstanceOf(Colors)
  expect(colors.neutral).toBeInstanceOf(Colors)
  expect(colors.error).toBeInstanceOf(Colors)
})

test('parse color object with additional colors', () => {
  const colors = parseColors({
    primary: 'red',
    appColor: 'blue'
  })

  expect(colors.primary).toBeInstanceOf(Colors)
  expect(colors.secondary).toBeInstanceOf(Colors)
  expect(colors.tertiary).toBeInstanceOf(Colors)
  expect(colors.neutral).toBeInstanceOf(Colors)
  expect(colors.error).toBeInstanceOf(Colors)
  expect(colors.appColor).toBeInstanceOf(Colors)
})
