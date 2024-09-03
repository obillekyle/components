import type { ColorOptions, ColorParam } from '../colors'
import type { ColorEngineVars } from './types'

import { darken, saturate } from 'color2k'
import { Colors, parseColors, shades } from '../colors'

function dim(color: string, amount: number) {
  return saturate(darken(color, amount), -0.2)
}

export class ColorEngine {
  colors: ColorOptions<Colors>

  constructor(color?: ColorParam) {
    this.colors = parseColors(color ?? '#fff')
  }

  getColorVariables(theme: 'light' | 'dark' = 'light'): ColorEngineVars {
    const isLight = theme === 'light'
    const colors = ['primary', 'secondary', 'tertiary', 'error', 'neutral']
    const getColor = (key: number, light: number, dark?: number) =>
      this.colors[colors[key]].shade(isLight ? light : (dark ?? light))

    return {
      primary: getColor(0, 40, 80),
      secondary: getColor(1, 40, 80),
      tertiary: getColor(2, 40, 80),
      error: getColor(3, 40, 80),

      onPrimary: getColor(0, 100, 20),
      onSecondary: getColor(1, 100, 20),
      onTertiary: getColor(2, 100, 20),
      onError: getColor(3, 100, 20),

      primaryContainer: getColor(0, 90, 30),
      secondaryContainer: getColor(1, 90, 30),
      tertiaryContainer: getColor(2, 90, 30),
      errorContainer: getColor(3, 90, 30),

      onPrimaryContainer: getColor(0, 30, 90),
      onSecondaryContainer: getColor(1, 30, 90),
      onTertiaryContainer: getColor(2, 30, 90),
      onErrorContainer: getColor(3, 30, 90),

      primaryFixed: getColor(0, 95),
      secondaryFixed: getColor(1, 95),
      tertiaryFixed: getColor(2, 95),

      primaryFixedDim: dim(getColor(0, 95), 0.1),
      secondaryFixedDim: dim(getColor(1, 95), 0.1),
      tertiaryFixedDim: dim(getColor(2, 95), 0.1),

      onPrimaryFixed: getColor(0, 15),
      onSecondaryFixed: getColor(1, 15),
      onTertiaryFixed: getColor(2, 15),

      onPrimaryFixedVariant: getColor(0, 30),
      onSecondaryFixedVariant: getColor(1, 30),
      onTertiaryFixedVariant: getColor(2, 30),

      surface: getColor(4, 98, 6),
      surfaceDim: getColor(4, 94, 6),
      surfaceBright: getColor(4, 98, 8),

      surfaceContainerLowest: getColor(4, 98, 6),
      surfaceContainerLow: getColor(4, 96, 10),
      surfaceContainer: getColor(4, 94, 14),
      surfaceContainerHigh: getColor(4, 92, 18),
      surfaceContainerHighest: getColor(4, 90, 22),

      onSurface: getColor(4, 10, 90),
      onSurfaceVariant: getColor(4, 30, 80),

      inverseSurface: getColor(4, 20, 90),
      inverseOnSurface: getColor(4, 90, 20),
      inversePrimary: getColor(0, 80, 40),

      outline: getColor(4, 50, 60),
      outlineVariant: getColor(4, 90, 30),

      scrim: getColor(4, 0),
      shadow: getColor(4, 0)
    }
  }

  getShades(theme: 'light' | 'dark' = 'light') {
    const values = new Map<string, string>()
    const light = theme === 'light'
    for (const [prefix, colors] of Object.entries(this.colors)) {
      for (const shade of shades) {
        const key = prefix + '-' + shade
        const value = light ? shade : 100 - shade
        values.set(key, colors.shade(value))

        for (let index = 0; index < 9; index++) {
          const alpha = (index + 1) * 0.1
          const color = colors.shade(value, (index + 1) * 0.1)
          values.set(key + '-' + alpha, color)
        }
      }
    }

    return Object.freeze(values) as ReadonlyMap<string, string>
  }

  clear() {
    this.colors = undefined as any
  }
}

export default ColorEngine
export type * from './types'
