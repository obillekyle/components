import { adjustHue, hsla, parseToHsla, toHex } from 'color2k'
import { Colors } from './class'
import type { ColorOptions, ColorParam } from './type'

export function parseColors(colors: ColorParam): ColorOptions<Colors> {
  if (
    typeof colors === 'string' ||
    colors instanceof String ||
    colors instanceof Colors
  ) {
    const color = colors.toString()
    const [h, s] = parseToHsla(color)

    return {
      primary: Colors.from(colors),
      secondary: Colors.from(toHex(hsla(h, s * 0.2, 0.2, 1))),
      tertiary: Colors.from(toHex(adjustHue(color, 180))),
      neutral: Colors.from(toHex(hsla(h, s * 0.05, 0.8, 1))),
      error: Colors.from('red')
    }
  }

  const primary = (colors.primary ?? 'white').toString()
  const [h, s] = parseToHsla(primary)

  const newColors = { ...colors } as ColorOptions<string | Colors>
  newColors.secondary ??= toHex(hsla(h, s * 0.2, 0.2, 1))
  newColors.tertiary ??= toHex(adjustHue(primary, 180))
  newColors.neutral ??= toHex(hsla(h, s * 0.1, 0.5, 1))
  newColors.error ??= 'red'

  delete newColors.$vars
  return Object.fromEntries(
    Object.entries(newColors).map(([key, value]) => {
      return [key, Colors.from(value)]
    })
  ) as ColorOptions<Colors>
}
