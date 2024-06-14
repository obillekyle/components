import type { Component } from 'vue'
import type { AppColorVariants, AppSizesString } from '../../utils/css'
const boxKeys = [
  'px',
  'py',
  'pl',
  'pr',
  'pt',
  'pb',
  'mx',
  'my',
  'ml',
  'mr',
  'mt',
  'mb',
  'width',
  'height',
  'm',
  'p',
  'r',
  'as',
  'bg'
] as const

export type BoxProps = {
  px?: AppSizesString
  py?: AppSizesString
  pl?: AppSizesString
  pr?: AppSizesString
  pt?: AppSizesString
  pb?: AppSizesString

  mx?: AppSizesString
  my?: AppSizesString
  ml?: AppSizesString
  mr?: AppSizesString
  mt?: AppSizesString
  mb?: AppSizesString

  width?: AppSizesString
  height?: AppSizesString

  m?: AppSizesString
  p?: AppSizesString
  r?: AppSizesString
  as?: string | Component
  bg?: AppColorVariants | 'on-bg'
}
export function getBoxProps(props: BoxProps): BoxProps
export function getBoxProps(props: any): BoxProps {
  return boxKeys.reduce((acc, key) => {
    if (props[key]) acc[key] = props[key]
    return acc
  }, {} as BoxProps)
}
