import type {
  SizePrefixes,
  SizeType,
  SizeUnits,
  Sizes,
  SizesString
} from './type'

import { is } from '../object/is'
import { DefaultSizes } from './defaults'
import { isNum, isVar, toVar } from './main'
import { sizes } from './vars'

export function addUnit(
  value: SizeType | SizeType[],
  unit: SizeUnits | String = 'px'
): string {
  if (is(value, 'array')) {
    return value.map((v) => addUnit(v, unit)).join(' ')
  }

  const size = String(value).trim()
  return isNum(size) ? size + unit : size
}

export const addPX = (value: SizeType) => addUnit(value)
type SizesValue = SizesString | SizesString[]

// prettier-ignore
type ValueGetter = {
  (value: SizesValue, unit?: SizeUnits, type?: SizePrefixes | (string & {})): string
  (value?: SizesValue, unit?: SizeUnits, type?: SizePrefixes | (string & {})): string | undefined
  (value?: undefined, unit?: SizeUnits, type?: SizePrefixes | (string & {})): undefined
}

const SIZES_VAR = /#(\w+)(?:-(\w+))?/
const MULTI_VALUE = /(var\(--.*?\)|#\S+|\S+){2,}/g
function processMultiValue(
  value: SizesValue,
  unit: string,
  type: string = 'padding'
): string {
  value = is(value, 'array') ? value : String(value).trim()
  value = is(value, 'array') ? value : value.match(MULTI_VALUE) || []

  return value.map((value) => getCSSValue(value, unit, type)).join(' ')
}

const isMultiValue = function (value: any) {
  return is(value, 'array') || String(value).match(MULTI_VALUE)?.length! > 1
}

export const getCSSValue: ValueGetter = function (
  value: any,
  unit = 'px',
  type = 'padding'
) {
  if (!value) return
  if (isMultiValue(value)) return processMultiValue(value, unit, type)

  value = String(value).trim()
  type = String(type).trim()

  if (isVar(value)) return value
  if (isNum(value)) return addUnit(value, unit)
  if (value === '#rounded') return toVar('rounded', addPX(999))

  const match: [string, string, Sizes] = value.match(SIZES_VAR)

  if (match) {
    let prefix = match[1]
    let suffix = match[2]

    if (!suffix) {
      suffix = prefix as any
      prefix = type
    }

    if (sizes.includes(suffix) && prefix in DefaultSizes) {
      const key = prefix + '-' + suffix
      const def = DefaultSizes[prefix][suffix]
      return toVar(key, addUnit(def, unit))
    }
  }

  return addUnit(value, unit)
}
