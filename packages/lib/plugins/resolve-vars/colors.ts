import Color from 'color'

export type ColorEvents = {
  update: [color: Color, oldColor: Color]
}

export function isLight(color: Color) {
  const [r, g, b] = color.rgb().array()
  return r > 180 || r + g + b > 450
}

export class Colors {
  main: Color = Color('white')

  constructor(color?: string | Color | String) {
    this.set(color ?? this.main)
  }

  set(colorString: String | string | Color): this {
    this.main = Color(colorString)
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

export function toColorsObj(color: string | String | Colors): Colors {
  return color instanceof Colors ? color : new Colors(color)
}
