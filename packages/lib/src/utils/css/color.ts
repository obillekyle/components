import type { ColorString } from './type'

import { toCamelCase } from '../string/cases'
import { toVar } from './main'

import { DefaultThemeObject } from '@/components/ThemeProvider/defaults'
import type { ThemeObject } from '@/components/ThemeProvider/types'

export const c = getCSSColor
export function getCSSColor(
  this: ThemeObject | void,
  value: ColorString,
  raw = false
): string {
  value = value.trim()
  const { $vars, $shades } = (this || DefaultThemeObject).colors

  if (value.startsWith('$')) {
    const colorKey = value.slice(1)
    const objectId = toCamelCase(colorKey)

    if (objectId in $vars) {
      const value = $vars[objectId]
      return raw ? value : toVar(colorKey, value)
    }

    if ($shades.has(colorKey)) {
      const value = $shades.get(colorKey)!
      return raw ? value : toVar(colorKey, value)
    }
  }

  return String(value)
}
