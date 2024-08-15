import type { ColorOptions } from '../colors'
import type { ColorEngineVars } from './types'

import { darken, saturate } from 'color2k'
import { Colors } from '../colors/class'
import { parseColors } from '../colors/parse-colors'
import { AppShades } from '../colors/vars'

function dim(color: string, amount: number) {
  return saturate(darken(color, amount), -0.2)
}

export class ColorEngine {
  colors: ColorOptions<Colors>

  constructor(color?: string | Partial<ColorOptions<string | Colors>>) {
    this.colors = parseColors(color ?? '#fff')
  }

  getColorVariables(theme: 'light' | 'dark' = 'light'): ColorEngineVars {
    const use = (l: number, d: number) => (theme === 'light' ? l : d)
    const { primary, secondary, tertiary, error, neutral } = this.colors

    return {
      primary: primary.shade(use(40, 80)),
      secondary: secondary.shade(use(40, 80)),
      tertiary: tertiary.shade(use(40, 80)),
      error: error.shade(use(40, 80)),

      onPrimary: primary.shade(use(100, 20)),
      onSecondary: secondary.shade(use(100, 20)),
      onTertiary: tertiary.shade(use(100, 20)),
      onError: error.shade(use(100, 20)),

      primaryContainer: primary.shade(use(90, 30)),
      secondaryContainer: secondary.shade(use(90, 30)),
      tertiaryContainer: tertiary.shade(use(90, 30)),
      errorContainer: error.shade(use(90, 30)),

      onPrimaryContainer: primary.shade(use(30, 90)),
      onSecondaryContainer: secondary.shade(use(30, 90)),
      onTertiaryContainer: tertiary.shade(use(30, 90)),
      onErrorContainer: error.shade(use(30, 90)),

      primaryFixed: primary.shade(95),
      secondaryFixed: secondary.shade(95),
      tertiaryFixed: tertiary.shade(95),

      primaryFixedDim: dim(primary.shade(95), 0.1),
      secondaryFixedDim: dim(secondary.shade(95), 0.1),
      tertiaryFixedDim: dim(tertiary.shade(95), 0.1),

      onPrimaryFixed: primary.shade(15),
      onSecondaryFixed: secondary.shade(15),
      onTertiaryFixed: tertiary.shade(15),

      onPrimaryFixedVariant: primary.shade(30),
      onSecondaryFixedVariant: secondary.shade(30),
      onTertiaryFixedVariant: tertiary.shade(30),

      surface: neutral.shade(use(98, 6)),
      surfaceDim: neutral.shade(use(94, 6)),
      surfaceBright: neutral.shade(use(98, 8)),

      surfaceContainerLowest: neutral.shade(use(98, 0)),
      surfaceContainerLow: neutral.shade(use(96, 5)),
      surfaceContainer: neutral.shade(use(94, 10)),
      surfaceContainerHigh: neutral.shade(use(92, 15)),
      surfaceContainerHighest: neutral.shade(use(90, 20)),

      onSurface: neutral.shade(use(10, 90)),
      onSurfaceVariant: neutral.shade(use(30, 80)),

      inverseSurface: neutral.shade(use(20, 90)),
      inverseOnSurface: neutral.shade(use(90, 20)),
      inversePrimary: primary.shade(use(80, 40)),

      outline: neutral.shade(use(50, 60)),
      outlineVariant: neutral.shade(use(90, 50)),

      scrim: neutral.shade(0),
      shadow: neutral.shade(0)
    }
  }

  getShades(theme: 'light' | 'dark' = 'light') {
    const values: Record<string, string> = {}
    const light = theme === 'light'
    for (const prefix in this.colors) {
      const colors = this.colors[prefix]

      for (const shade of AppShades) {
        const key = prefix + '-' + shade
        const value = light ? shade : 100 - shade
        values[key] = colors.shade(value)

        for (let index = 0; index < 9; index++) {
          const color = colors.shade(value, (index + 1) * 0.1)
          values[key + '-' + (index + 1) * 10] = color
        }
      }
    }
    return values
  }

  clear() {
    this.colors = undefined as any
  }
}

export default ColorEngine
export type * from './types'
