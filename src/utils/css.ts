export const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
export const prefixes = [
  'font',
  'size',
  'icon',
  'padding',
  'component'
] as const
export type AppSizesPrefixes = (typeof prefixes)[number]
export type AppSizes = (typeof sizes)[number]
export type CSSMetricUnits =
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

export type SizesString =
  | 'auto'
  | 'initial'
  | 'inherit'
  | 'unset'
  | `${number}${CSSMetricUnits}`
  | String
  | number

export type AppSizesString = AppSizes | SizesString | 'rounded'

export function addUnit(
  value: AppSizesString = 0,
  unit: CSSMetricUnits = 'px'
): string {
  if (typeof value === 'number') return value + unit
  if (value.match(/^-?\d+(\.\d+)?$/)) return value + unit
  return value.toString()
}

export const addPX = (value: AppSizesString) => addUnit(value, 'px')

export function getCSSValue(
  value: AppSizesString,
  unit?: CSSMetricUnits,
  varType?: AppSizesPrefixes | String
): string
export function getCSSValue(
  value?: AppSizesString,
  unit?: CSSMetricUnits,
  varType?: AppSizesPrefixes | String
): string | undefined
export function getCSSValue(
  value?: undefined,
  unit?: CSSMetricUnits,
  varType?: AppSizesPrefixes | String
): undefined
export function getCSSValue(
  value?: AppSizesString,
  unit: CSSMetricUnits = 'px',
  varType?: AppSizesPrefixes | String
): string | undefined {
  if (value === undefined) return

  const newValue = typeof value === 'string' ? value.trim() : value
  if (typeof newValue === 'string' && newValue.includes(' ')) {
    return newValue
      .split(' ')
      .map((v) => getCSSValue(v, unit, varType))
      .join(' ')
  }

  if (sizes.find((size) => newValue === size)) {
    varType = varType ? varType + '-' : ''
    return `var(--${varType}${newValue})`
  }
  if (newValue === 'rounded') return '9999px'
  return addUnit(newValue, unit)
}

export const c = (value: AppColorString) => getCSSColor(value)
export const colorVariants = ['primary', 'secondary', 'mono', 'error'] as const
export type AppColorVariants = (typeof colorVariants)[number]
export type ColorShades =
  | 0
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000
type ColorAlphas = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90
export type AppColorString<props extends string = 'primary'> =
  | props
  | AppColorVariants
  | `${AppColorVariants | props}-${ColorShades}`
  | `${AppColorVariants | props}-${ColorShades}-${ColorAlphas}`
  | ColorString

export type ColorString =
  | `#${string}`
  | `rgb(${number}, ${number}, ${number})`
  | `rgba(${number}, ${number}, ${number}, ${number})`
  | `hsl(${number}, ${number}, ${number})`
  | `hsla(${number}, ${number}, ${number}, ${number})`
  | String

export function getCSSColor(value: AppColorString): string {
  value = value.trim()
  if (
    colorVariants.some((v) => value.startsWith(v) || value.startsWith('color'))
  ) {
    return colorVariants.some((v) => v === value) || value === 'color'
      ? `var(--${value}-500)`
      : `var(--${value})`
  }

  return value.toString()
}
