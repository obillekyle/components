import type { ColorString } from './type'

import { ColorEngine } from '../color-engine'
import { toCamelCase } from '../string/cases'
import { toVar } from './main'

const engine = new ColorEngine('#0df')
const engineShades: Record<string, string> = engine.getShades()
const engineColors: Record<string, string> = engine.getColorVariables()

export const c = getCSSColor
export function getCSSColor(value: ColorString): string {
  value = value.trim()

  if (value.startsWith('$')) {
    const key = value.slice(1).trim()
    const objKey = toCamelCase(key)

    if (objKey in engineColors) {
      return toVar(key, engineColors[objKey])
    }

    if (key in engineShades) {
      return toVar(key, engineShades[key])
    }
  }

  return String(value)
}
