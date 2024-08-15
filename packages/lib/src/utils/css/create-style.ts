import type * as CSS from 'csstype'
import type { ComputedRef } from 'vue'
import type { ColorString, SizesString } from './type'

import { computed, onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { $ } from '../dom/selector'
import { toKebabCase } from '../string/cases'
import { hashStr } from '../string/hash'
import { getCSSColor } from './color'
import { canBeNumber } from './main'
import { addUnit, getCSSValue } from './sizes'

type ValueGetter = (
  value?: ColorString | SizesString | any[],
  defs?: string | number,
  unit?: string
) => string

export const cssPropValue: ValueGetter = (value, def, unit) => {
  value ??= def &&= String(def)
  if (value === null) return ''
  if (value === undefined) return ''
  if (Array.isArray(value)) return getCSSValue(value, unit)

  const prop = String(value).trim()
  if (prop.startsWith('$')) return getCSSColor(prop)
  if (prop.includes('#')) return getCSSValue(prop, unit)
  if (canBeNumber(prop)) return addUnit(prop, unit)

  return prop
}

const keyByPrefix = {
  p: 'padding',
  px: 'padding-inline',
  py: 'padding-block',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  m: 'margin',
  mx: 'margin-inline',
  my: 'margin-block',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  r: 'border-radius'
}

const unitsByProp: Record<string, string | undefined> = {
  rotate: 'deg',
  scale: '',
  opacity: '',
  skew: 'deg',
  translate: '%',
  transitionDuration: 's',
  transitionDelay: 's',
  transformOrigin: '%',
  backgroundSize: '%',
  borderImageWidth: '%',
  borderImageSlice: '%',
  flexGrow: '',
  flexShrink: '',
  fontWeight: '',
  lineHeight: '',
  zIndex: '',
  order: ''
}

type CustomCSSProperties = {
  [key in keyof typeof keyByPrefix]?: SizesString | SizesString[]
}

type AdditionalCSSProperties = {
  color?: ColorString
}

type DefaultCSSProperties = CSS.Properties<
  ColorString | SizesString | SizesString[],
  string | number
>

type CSSVariables = {
  [key: `--${string}`]:
    | ColorString
    | SizesString
    | SizesString[]
    | undefined
}

export type CSSProperties = Omit<
  DefaultCSSProperties,
  keyof AdditionalCSSProperties
> &
  CustomCSSProperties &
  AdditionalCSSProperties &
  CSSVariables

type CreateStyleOptions = {
  prefix?: string
  resolveVars?: boolean
}

type CreateStyle = (
  style: () => CSSProperties,
  options?: CreateStyleOptions
) => ComputedRef<string>

function dismount(name: string) {
  if (!name || typeof window === 'undefined') return

  const style = $(`style[for=${name}]`)

  if (style) {
    const count = Number(style.dataset.count || 0) - 1
    count <= 0 ? style.remove() : (style.dataset.count = String(count))
  }
}

function mount(name: string, object?: Record<string, any>, resolve = true) {
  if (!name || typeof window === 'undefined') return

  let style = $(`style[for=${name}]`)

  if (style) {
    const count = Number(style.dataset.count || 0) + 1
    style.dataset.count = String(count)
    return
  }

  let value: string = ''
  style = document.createElement('style')
  style.setAttribute('for', name)
  style.dataset.count = '1'

  for (const key in object) {
    if (object[key]) {
      const current = object[key]
      const prop = (keyByPrefix as any)[key] ?? toKebabCase(key)
      const cssValue = resolve
        ? cssPropValue(current, undefined, unitsByProp[key])
        : addUnit(current, unitsByProp[key])

      value += `${prop}: ${cssValue}; `
    }
  }

  object = undefined
  document.head.append(style)
  style.innerHTML = `.${name} { ${value} }`
}

// prettier-ignore
export const createStyle: CreateStyle = 
  function createStyle(styles: any, { prefix = 'md-css-', resolveVars } = {}) {

    const object = ref(getStyles())
    
    const name = computed(() => {
      const string = JSON.stringify(object.value)
      return string === '{}' ?  "" :  prefix + hashStr(string, 6)
    })

    function getStyles(value?: any): Record<string, any> {
      const style = value ?? styles();
      return Object.assign(
        {},
        style, 
        style.styled, 
        { as: undefined, styled: undefined }
      )
    }

    watch(styles, (value) => {
      object.value = getStyles(value)
    }, { deep: true })

    watch(name, (newName, oldName) => {
      mount(newName, object.value, resolveVars)
      dismount(oldName)
    })

    onBeforeMount(() => mount(name.value, object.value, resolveVars))
    onUnmounted(() => dismount(name.value))

    return name
  }
