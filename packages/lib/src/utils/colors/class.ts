import type { Curve } from './type'

import { hsla, parseToHsla, parseToRgba, toHex } from 'color2k'

import BezierEasing from 'bezier-easing'

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
    const [r, g, b] = parseToRgba(color).map((v) => v / 255)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5
  }

  set(colorString: string | String): this {
    this.main = parseToHsla(colorString.toString())
    return this
  }

  shade(shade: number, alpha = 1) {
    const [h, s] = this.main

    const val = (h + (shade / 100) * 5) % 360
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
