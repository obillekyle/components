import type { SizePrefixes, SizeType, SizeUnits, SizesString } from './type'

import { is } from '../object/is'
import { DefaultSizes } from './defaults'
import { canBeNumber, toVar } from './main'
import { sizes } from './vars'

export function addUnit(
  value: SizeType | SizeType[],
  unit: SizeUnits | String = 'px'
): string {
  if (is(value, 'array')) {
    return value.map((v) => addUnit(v, unit)).join(' ')
  }

  const size = String(value).trim()
  return canBeNumber(size) ? size + unit : size
}

export const addPX = (value: SizeType) => addUnit(value)

// prettier-ignore
type ValueGetter = {
  (value: SizesString | SizesString[], unit?: SizeUnits | (string & {}), type?: SizePrefixes | (string & {})): string
  (value?: SizesString | SizesString[], unit?: SizeUnits | (string & {}), type?: SizePrefixes | (string & {})): string | undefined
  (value?: undefined, unit?: SizeUnits | (string & {}), type?: SizePrefixes | (string & {})): undefined
}

export const getCSSValue: ValueGetter = (value: any, unit = 'px', type) => {
  if (!value) return value

  function map(a: any[]) {
    return a.map((v) => getCSSValue(v, unit, type))
  }
  if (is(value, 'array')) return map(value).join(' ')

  value = String(value).trim()
  type = String(type || '').trim()

  const match = value.match(/(var\(--.*?\)|#\S+|\S+)/g)

  if (match && match.length > 1) return map(match).join(' ')
  if (canBeNumber(value)) return addUnit(value, unit)
  if (value.includes('var(')) return value

  if (value.startsWith('#')) {
    const record = DefaultSizes as Record<string, Record<string, number>>
    const [, prefix, suffix] = value.match(/#(\w+)(?:-(\w+))?/) || []

    if (prefix === 'rounded') {
      return toVar(prefix, addPX(999))
    }

    if (sizes.includes(prefix as any)) {
      if (type in record) {
        const key = type + '-' + prefix
        const def = record[type][prefix]
        return toVar(key, addUnit(def, unit))
      }

      const def = record.padding[suffix]
      return toVar(prefix, addUnit(def, unit))
    }

    if (prefix in record && suffix in record[prefix]) {
      const key = prefix + '-' + suffix
      const def = record[prefix][suffix]
      return toVar(key, addUnit(def, unit))
    }
  }

  return addUnit(value, unit)
}
