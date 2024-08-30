import type { ColorString } from './type'

import { toCamelCase } from '../string/cases'
import { toVar } from './main'

import ColorEngine from '../color-engine'

export const engine = new ColorEngine('#0df')
const engineShades = engine.getShades()
const engineColors = engine.getColorVariables()

export const c = getCSSColor
export function getCSSColor(value: ColorString): string {
  value = value.trim()

  if (value.startsWith('$')) {
    const colorKey = value.slice(1)
    const objectId = toCamelCase(colorKey)

    if (objectId in engineColors) {
      return toVar(colorKey, engineColors[objectId])
    }

    if (colorKey in engineShades) {
      return toVar(colorKey, engineShades[colorKey])
    }
  }

  return String(value)
}
