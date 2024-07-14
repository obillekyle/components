import type { Component } from 'vue'
import {
  getCSSValue,
  type AppColorVariants,
  type AppSizesString
} from '@/utils/css'
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

export interface BoxComponentProps extends BoxProps {
  exclude?: boolean
}

export function getBoxProps(props: BoxProps, defs?: BoxProps): BoxProps
export function getBoxProps(props: any, defs: any = {}): BoxProps {
  return boxKeys.reduce((acc, key) => {
    if (props[key]) acc[key] = props[key]
    if (!props[key] && defs[key]) acc[key] = defs[key]
    return acc
  }, {} as BoxProps)
}

export function processBoxProps(props: BoxProps) {
  const styleObj = {} as any

  if (props.p) styleObj.padding = getCSSValue(props.p)
  if (props.m) styleObj.margin = getCSSValue(props.m)
  if (props.r) styleObj.borderRadius = getCSSValue(props.r)
  if (props.px) styleObj.paddingInline = getCSSValue(props.px)
  if (props.py) styleObj.paddingBlock = getCSSValue(props.py)
  if (props.pt) styleObj.paddingTop = getCSSValue(props.pt)
  if (props.pl) styleObj.paddingLeft = getCSSValue(props.pl)
  if (props.pr) styleObj.paddingRight = getCSSValue(props.pr)
  if (props.pb) styleObj.paddingBottom = getCSSValue(props.pb)
  if (props.mx) styleObj.marginInline = getCSSValue(props.mx)
  if (props.my) styleObj.marginBlock = getCSSValue(props.my)
  if (props.mt) styleObj.marginTop = getCSSValue(props.mt)
  if (props.ml) styleObj.marginLeft = getCSSValue(props.ml)
  if (props.mr) styleObj.marginRight = getCSSValue(props.mr)
  if (props.mb) styleObj.marginBottom = getCSSValue(props.mb)
  if (props.width) styleObj.width = getCSSValue(props.width)
  if (props.height) styleObj.height = getCSSValue(props.height)

  return styleObj
}
