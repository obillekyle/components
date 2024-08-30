import type { sizes } from './vars'

type CSSDefaults = 'auto' | 'initial' | 'inherit' | 'unset' | 'revert'
export type SizePrefixes =
  | 'font'
  | 'size'
  | 'icon'
  | 'padding'
  | 'component'
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
  | (string & {})

export type SizeType = CSSDefaults | (string & {}) | number
export type CustomSizes = `#${Sizes}` | `#${SizePrefixes}-${Sizes}`

export type SizesString = SizeType | CustomSizes | '#rounded'
export type SizeDict = { [key in Sizes]: SizeType }
export type SizeRecord = { [key in SizePrefixes]: SizeDict } & {
  [key: string]: SizeDict
}

export const colorVariants = [
  'primary',
  'secondary',
  'tertiary',
  'neutral',
  'error'
] as const

export type ColorType = CSSDefaults | (string & {})
export type ColorShades =
  | 0
  | 1
  | 5
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 95
  | 99
  | 100
export type ColorAlphas = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90
export type ColorVariants = (typeof colorVariants)[number]
export type CustomColors =
  | `$${ColorVariants}`
  | `$${ColorVariants}-${ColorShades}`

export type ColorString = ColorType | CustomColors
