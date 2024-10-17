import type { ColorOptions, ColorParam } from './type'

import { hsla, toHex } from 'color2k'
import { Colors } from './class'

export function parseColors(colors: ColorParam): ColorOptions<Colors> {
  if (typeof colors === 'string' || colors instanceof Colors) {
    colors = { primary: colors }
  }

  const primary = Colors.from(colors.primary ?? '#fff')
  const [h, s] = primary['main']

  const newColors = Object.assign({ primary }, colors)

  newColors.secondary ??= toHex(hsla(h, s * 0.4, 0.2, 1))
  newColors.tertiary ??= primary.opposite
  newColors.neutral ??= toHex(hsla(h, s * 0.05, 0.5, 1))
  newColors.error ??= 'red'

  for (const color in newColors) {
    color.startsWith('$')
      ? delete newColors[color]
      : (newColors[color] = Colors.from(newColors[color] ?? '#fff'))
  }

  return newColors as ColorOptions<Colors>
}
