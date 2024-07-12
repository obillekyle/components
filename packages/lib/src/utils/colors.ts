import Color from 'color'
import { CustomEventHandler } from './event'

export type ColorEvents = {
  update: [color: Color, oldColor: Color]
}

export function isLight(color: Color) {
  const [r, g, b] = color.rgb().array()
  return r > 180 || r + g + b > 450
}

export class Colors extends CustomEventHandler<ColorEvents> {
  main: Color = Color('white')

  constructor(color?: string | Color) {
    super()
    this.set(color ?? this.main)
  }

  set(colorString: string | Color): this {
    const old = this.main
    this.main = Color(colorString)
    this.dispatchEvent('update', [this.main, old])
    return this
  }

  shade(shade: number, alpha = 1) {
    const [h, s] = this.main.hsl().array()
    return Color({
      h,
      s: s > 80 ? 80 : s,
      l: shade,
      alpha
    })
  }
}
