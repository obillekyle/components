import type { SizePrefixes, SizeType, SizeUnits, SizesString } from './type'

import { canBeNumber, toVar } from '.'
import { is } from '../object'
import { DefaultSizes } from './defaults'
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

  if (is(value, 'array')) {
    return value.map((v) => getCSSValue(v, unit, type)).join(' ')
  }

  const size = String(value).trim()
  const varType = String(type || '').trim()

  if (size.includes('var(')) return size
  if (canBeNumber(value)) return addUnit(value, unit)

  if (size.includes(' ')) {
    return getCSSValue(size.split(' '), unit, type)
  }

  if (size.startsWith('--')) {
    return toVar(size.slice(2))
  }

  if (size.startsWith('#')) {
    const record = DefaultSizes as Record<string, Record<string, number>>
    const [, prefix, value] = size.match(/#(\w+)(?:-(\w+))?/) || []

    if (prefix === 'rounded') {
      return toVar(prefix, addUnit(999))
    }
    if (sizes.includes(prefix as any)) {
      return varType in record
        ? toVar(
            varType + '-' + value,
            addUnit(record[varType][prefix], unit)
          )
        : toVar(prefix, addUnit(record.padding[prefix], unit))
    }

    if (prefix in record && value in record[prefix]) {
      return toVar(
        prefix + '-' + value,
        addUnit(record[prefix][value], unit)
      )
    }
  }

  return addUnit(size, unit)
}
