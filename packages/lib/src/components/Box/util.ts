import type { CSSProperties, ColorVariants, SizesString } from '@/utils/css'
import type { Component, Ref } from 'vue'

import { reactive, shallowRef, watch } from 'vue'
const boxKeys = [
  'm',
  'p',
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
  'r',
  'as',
  'styled'
] as const

export type BoxProps = {
  px?: SizesString
  py?: SizesString
  pl?: SizesString
  pr?: SizesString
  pt?: SizesString
  pb?: SizesString

  mx?: SizesString
  my?: SizesString
  ml?: SizesString
  mr?: SizesString
  mt?: SizesString
  mb?: SizesString

  width?: SizesString
  height?: SizesString

  m?: SizesString
  p?: SizesString
  r?: SizesString
  as?: string | Component
  bg?: ColorVariants | 'on-bg'
  styled?: CSSProperties
}

type GetBoxProps = (props: BoxProps, defs?: BoxProps) => Ref<BoxProps>
export const getBoxProps: GetBoxProps = (props: any, defs: any = {}) => {
  const obj = shallowRef(getProps(props))

  function getProps(props: BoxProps) {
    const newObj: Record<string, string> = {}

    for (const boxKey of boxKeys) {
      if (props[boxKey] || defs[boxKey])
        newObj[boxKey] = props[boxKey] ?? defs[boxKey]
    }

    return newObj
  }

  watch(reactive(props), (props) => {
    obj.value = getProps(props)
  })

  return obj
}
