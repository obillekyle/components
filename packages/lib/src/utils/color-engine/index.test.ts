import { ColorEngine } from '.'
import Colors from '../colors'

const colorEngine = new ColorEngine('#0df')
test('valid color engine', () => {
  expect(colorEngine).instanceOf(ColorEngine)
  expect(colorEngine.colors.primary).instanceOf(Colors)
  expect(colorEngine.colors.secondary).instanceOf(Colors)
  expect(colorEngine.colors.tertiary).instanceOf(Colors)
  expect(colorEngine.colors.neutral).instanceOf(Colors)
  expect(colorEngine.colors.error).instanceOf(Colors)
})

test('get color variables', () => {
  const variables = colorEngine.getColorVariables('light')

  expect(variables).property('primary')
  expect(variables).property('secondary')
  expect(variables).property('tertiary')
  expect(variables).property('surface')
  expect(variables).property('error')
})
