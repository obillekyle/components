import type { ColorOptions, ColorParam } from './type'

import { hsla, toHex } from 'color2k'
import { pipe } from '../function/pipe'
import { Colors } from './class'

export function parseColors(colors: ColorParam): ColorOptions<Colors> {
  if (typeof colors === 'string' || colors instanceof Colors) {
    const color = Colors.from(colors)
    const [h, s] = color['main']

    return {
      primary: color,
      secondary: pipe(hsla(h, s * 0.4, 0.2, 1), toHex, Colors.from),
      neutral: pipe(hsla(h, s * 0.05, 0.5, 1), toHex, Colors.from),
      tertiary: color.opposite,
      error: Colors.from('red')
    }
  }

  const primary = Colors.from(colors.primary ?? '#fff')
  const [h, s] = primary['main']

  const newColors = Object.assign({}, colors)

  newColors.secondary ??= toHex(hsla(h, s * 0.4, 0.2, 1))
  newColors.tertiary ??= primary.opposite.toString()
  newColors.neutral ??= toHex(hsla(h, s * 0.05, 0.5, 1))
  newColors.error ??= 'red'

  for (const color in newColors) {
    if (color.startsWith('$')) continue
    newColors[color] = Colors.from(newColors[color] ?? '#fff')
  }

  return newColors as ColorOptions<Colors>
}
