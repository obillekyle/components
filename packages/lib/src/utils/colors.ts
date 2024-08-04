import BezierEasing from 'bezier-easing'
import { adjustHue, hsla, parseToHsla, parseToRgba, toHex } from 'color2k'
export type Curve = [number, number, number, number]
export type ColorOptions<T = string> = {
  primary: T
  secondary: T
  tertiary: T
  error: T
  neutral: T
  [key: string]: T
}

export function parseColors(
  colors:
    | string
    | String
    | Colors
    | Partial<ColorOptions<string | Colors | String>>
): ColorOptions<Colors> {
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

export class Colors {
  private main = parseToHsla('white')
  private curve = BezierEasing(0.2, 0.2, 1, 1)

  constructor(color?: string | String, curve?: Curve) {
    this.curve = curve ? BezierEasing(...curve) : this.curve
    this.set(color ?? 'white')
  }

  static from(color: string | String | Colors): Colors {
    return color instanceof Colors ? color : new Colors(color)
  }

  static isLight(color: string): boolean {
    const [r, g, b] = parseToRgba(color)
    return r > 180 || r + g + b > 450
  }

  set(colorString: string | String): this {
    const [h, s, l] = parseToHsla(colorString.toString())
    this.main = [h, Math.min(s, 1), l, 1]
    return this
  }

  shade(shade: number, alpha = 1) {
    const [h, s] = this.main
    ;('hsl(0, 100%, 88%)')

    const val = (h + (shade / 100) * 15) % 360
    const hue = val < 0 ? val + 360 : val
    const lightness = this.curve(shade / 100)
    const satMultiplier = 1 + Math.abs(lightness - 0.5)
    return toHex(hsla(hue, s * satMultiplier, lightness, alpha))
  }

  toString() {
    return toHex(hsla(...this.main))
  }

  isLight(shade = 50) {
    return Colors.isLight(this.shade(shade))
  }

  get opposite() {
    const [h, s, l] = this.main
    return new Colors(hsla((h + 180) % 360, s, l, 1))
  }

  get hex() {
    return this.toString()
  }
}
