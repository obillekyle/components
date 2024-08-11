import type { prefixes, shades, sizes } from './vars'

type CSSDefaults = 'auto' | 'initial' | 'inherit' | 'unset' | 'revert'
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

export type SizeType = CSSDefaults | (string & {}) | number
export type CustomSizes = `#${Sizes}` | `#${SizePrefixes}-${Sizes}`

export type SizeDict = { [key in Sizes]: SizeType }
export type SizeRecord = { [key in SizePrefixes]: SizeDict }
export type SizesString = SizeType | CustomSizes | '#rounded'

export const colorVariants = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'error'
] as const

export type ColorType = CSSDefaults | (string & {})
export type ColorShades = (typeof shades)[number]
export type ColorAlphas = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90
export type ColorVariants = (typeof colorVariants)[number]
export type CustomColors =
  | `$${ColorVariants}`
  | `$${ColorVariants}-${ColorShades}`

export type ColorString = ColorType | CustomColors
