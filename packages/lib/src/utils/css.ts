import { ColorEngine } from './color-engine'
import { toCamelCase } from './string'

export const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
export const prefixes = [
  'font',
  'size',
  'icon',
  'padding',
  'component'
] as const

export type SizePrefixes = (typeof prefixes)[number]
export type Sizes = (typeof sizes)[number]
export type SizeUnits =
  | 'px'
  | 'rem'
  | 'em'
  | 'vh'
  | 'vw'
  | 'vmin'
  | 'vmax'
  | '%'
  | 'ch'
  | 'cm'
  | 'mm'
  | 'in'
  | 'pt'
  | 'pc'
  | 'dvh'
  | 's'
  | 'ms'
  | 'deg'
  | 'dvw'

export type SizeType =
  | 'auto'
  | 'initial'
  | 'inherit'
  | 'unset'
  | String
  | number

export type SizeDict = { [key in Sizes]: SizeType }
export type SizeRecord = { [key in SizePrefixes]: SizeDict }
export type SizesString =
  | SizeType
  | `#${Sizes}`
  | `#${SizePrefixes}-${Sizes}`
  | '#rounded'

export const DefaultSizes: SizeRecord = {
  padding: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28
  },
  component: {
    xxs: 24,
    xs: 32,
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
    xxl: 72
  },
  size: {
    xxs: 48,
    xs: 56,
    sm: 64,
    md: 72,
    lg: 80,
    xl: 88,
    xxl: 96
  },
  font: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22
  },
  icon: {
    xxs: 8,
    xs: 12,
    sm: 16,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36
  }
}

export function isNumberString(value: number): true
export function isNumberString(value: string | number | String): boolean
export function isNumberString(value: string | String | number): boolean {
  if (typeof value === 'number') return true
  return /^-?\d+(\.\d+)?$/.test(String(value))
}

export function addUnit(value: SizeType, unit: SizeUnits = 'px'): string {
  const size = String(value).trim()
  return isNumberString(size) ? size + unit : size
}

export function toVar(
  key: string | String,
  value?: String | string | number
): `var(--${string})` {
  const value_ = value ? ', ' + value : ''
  return `var(--${key}${value_})`
}

export const addPX = (value: SizeType) => addUnit(value)

export function getCSSValue(
  value: SizeType,
  unit?: SizeUnits,
  type?: SizePrefixes | String
): string
export function getCSSValue(
  value?: SizeType,
  unit?: SizeUnits,
  type?: SizePrefixes | String
): string | undefined
export function getCSSValue(
  value?: undefined,
  unit?: SizeUnits,
  type?: SizePrefixes | String
): undefined
export function getCSSValue(
  value?: SizeType,
  unit: SizeUnits = 'px',
  type?: SizePrefixes | String
): string | undefined {
  if (!value) return undefined

  const size = String(value).trim()
  const varType = String(type || '').trim()

  if (size.includes('var(')) return size
  if (isNumberString(value)) return addUnit(value, unit)
  if (size.includes(' ')) {
    const sizes = size.split(' ')
    return sizes.map((v) => getCSSValue(v, unit, type)).join(' ')
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

const engine = new ColorEngine('#0df')
const engineShades: Record<string, string> = engine.getShades()
const engineColors: Record<string, string> = engine.getColorVariables()

export const shades = [
  0, 1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100
] as const

export const colorVariants = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'error'
] as const

export type ColorShades = (typeof shades)[number]
export type ColorAlphas = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90
export type ColorVariants = (typeof colorVariants)[number]
export type ColorString =
  | `$${ColorVariants}`
  | `$${ColorVariants}-${ColorShades}`
  | `$${ColorVariants}-${ColorShades}-${ColorAlphas}`
  | String

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
