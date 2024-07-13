import { parseToRgba, parseToHsla, hsla, toHex } from 'color2k'

export type ColorEvents = {
  update: [color: string, oldColor: string]
}

export function isLight(color: string): boolean {
  const [r, g, b] = parseToRgba(color)
  return r > 180 || r + g + b > 450
}

export class Colors {
  main = parseToHsla('white')

  constructor(color?: string | String) {
    this.set(color ?? 'white')
  }

  set(colorString: string | String): this {
    this.main = parseToHsla(colorString.toString())
    return this
  }

  shade(shade: number, alpha = 1) {
    const [h, s] = this.main
    return toHex(hsla(h, s > 80 ? 80 : s, shade, alpha))
  }
}
