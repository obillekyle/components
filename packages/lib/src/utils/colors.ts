import { parseToRgba, parseToHsla, hsla, toHex } from 'color2k'
import { CustomEventHandler } from './event'

export type ColorEvents = {
  update: [color: string, oldColor: string]
}

export function isLight(color: string): boolean {
  const [r, g, b] = parseToRgba(color)
  return r > 180 || r + g + b > 450
}

export class Colors extends CustomEventHandler<ColorEvents> {
  main = parseToHsla('white')

  constructor(color?: string | String) {
    super()
    this.set(color ?? 'white')
  }

  static from(color: string | String | Colors): Colors {
    return color instanceof Colors ? color : new Colors(color)
  }

  set(colorString: string | String): this {
    const old = hsla(...this.main)
    this.main = parseToHsla(colorString.toString())
    this.dispatchEvent('update', [hsla(...this.main), old])
    return this
  }

  shade(shade: number, alpha = 1) {
    const [h, s] = this.main
    return toHex(hsla(h, s > 0.8 ? 0.8 : s, shade / 100, alpha))
  }

  toString() {
    return toHex(hsla(...this.main))
  }
}
