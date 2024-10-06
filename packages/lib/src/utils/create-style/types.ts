import type * as CSS from 'csstype'
import type { ComputedRef } from 'vue'
import type { ColorString, SizesString } from '../css/type'
import type { keyPrefix } from './variables'

type CustomCSSProperties = {
  [key in keyof typeof keyPrefix]?: SizesString | SizesString[]
}

type AdditionalCSSProperties = {
  color?: ColorString
}

type CSSPropertyValue = ColorString | SizesString | SizesString[]
type DefaultCSSProperties = CSS.Properties<CSSPropertyValue, number>

type CSSVariables = {
  [key: `--${string}`]: CSSPropertyValue | undefined
} & { [key: `$${string}`]: CSSPropertyValue | undefined }

export type CSSProperties = Omit<
  DefaultCSSProperties,
  keyof AdditionalCSSProperties
> &
  CustomCSSProperties &
  AdditionalCSSProperties &
  CSSVariables

export type CreateStyleOptions = {
  prefix?: string
  resolveVars?: boolean
}

export type CreateStyle = (
  style: () => CSSProperties,
  options?: CreateStyleOptions
) => ComputedRef<string>
