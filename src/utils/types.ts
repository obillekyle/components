import type { Component } from 'vue'
import type { AppColorVariants, AppSizesString } from './css'

export type TemplateString = [string[] | TemplateStringsArray, ...any[]]

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
