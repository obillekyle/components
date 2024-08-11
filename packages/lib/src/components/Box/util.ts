import type { ColorVariants, SizesString } from '@/utils/css'
import type { Component, ComputedRef } from 'vue'

import { getCSSValue } from '@/utils/css'
import { $ } from '@/utils/dom'
import { hashStr } from '@/utils/string'
import { computed, onBeforeMount, onUnmounted, watch } from 'vue'
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
}

export function getBoxProps(
  props: BoxProps,
  defs?: BoxProps
): ComputedRef<BoxProps>
export function getBoxProps(
  props: any,
  defs: any = {}
): ComputedRef<BoxProps> {
  return computed<BoxProps>(() => {
    const obj: Record<string, string> = {}

    for (const boxKey of boxKeys) {
      if (props[boxKey] || defs[boxKey])
        obj[boxKey] = props[boxKey] ?? defs[boxKey]
    }

    return obj as BoxProps
  })
}

function dismount(id: string) {
  if (id === '') return

  const styleOld = $(`style[for=${id}]`)

  if (styleOld) {
    const count = Number(styleOld.dataset.count || 1)
    if (count <= 1) styleOld.remove()
    else styleOld.dataset.count = String(count - 1)
  }
}

function createStyle(id: string, props: BoxProps) {
  if (id === '') return

  const styleNew = $(`style[for=${id}]`)

  if (styleNew) {
    const count = Number(styleNew.dataset.count || 1)
    styleNew.dataset.count = String(count + 1)
    return
  }

  let value = ''

  if (props.p) value += `padding: ${getCSSValue(props.p)};`
  if (props.m) value += `margin :${getCSSValue(props.m)};`
  if (props.r) value += `border-radius :${getCSSValue(props.r)};`
  if (props.px) value += `padding-inline :${getCSSValue(props.px)};`
  if (props.py) value += `padding-block :${getCSSValue(props.py)};`
  if (props.pt) value += `padding-top :${getCSSValue(props.pt)};`
  if (props.pl) value += `padding-left :${getCSSValue(props.pl)};`
  if (props.pr) value += `padding-right :${getCSSValue(props.pr)};`
  if (props.pb) value += `padding-bottom :${getCSSValue(props.pb)};`
  if (props.mx) value += `margin-inline :${getCSSValue(props.mx)};`
  if (props.my) value += `margin-block :${getCSSValue(props.my)};`
  if (props.mt) value += `margin-top :${getCSSValue(props.mt)};`
  if (props.ml) value += `margin-left :${getCSSValue(props.ml)};`
  if (props.mr) value += `margin-right :${getCSSValue(props.mr)};`
  if (props.mb) value += `margin-bottom :${getCSSValue(props.mb)};`
  if (props.width) value += `width :${getCSSValue(props.width)};`
  if (props.height) value += `height :${getCSSValue(props.height)};`

  const newStyle = document.createElement('style')
  newStyle.textContent = `.${id}{${value}}`
  newStyle.setAttribute('for', id)
  newStyle.dataset.count = '1'
  document.head.append(newStyle)
}

export function processBoxProps(props: BoxProps) {
  const data = computed(() => {
    const obj: Record<string, any> = {}

    for (const key of boxKeys) {
      if (!props[key]) continue
      obj[key] = props[key]
    }

    return obj
  })

  const id = computed(() => {
    const key = Object.keys(data.value)
    return key.length === 0
      ? ''
      : `md-` + hashStr(JSON.stringify(data.value), 6)
  })

  watch(id, (newId, oldId) => {
    dismount(oldId)
    createStyle(newId, data.value)
  })

  onBeforeMount(() => createStyle(id.value, data.value))
  onUnmounted(() => dismount(id.value))

  return id
}
