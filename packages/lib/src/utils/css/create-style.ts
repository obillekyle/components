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
  unit?: string
) => string

export const cssPropValue: ValueGetter = (value, unit) => {
  if (value === null) return ''
  if (value === undefined) return ''
  if (Array.isArray(value))
    return value.map((v) => cssPropValue(v, unit)).join(' ')

  const prop = String(value).trim()
  if (prop.startsWith('raw:')) return prop.slice(4)
  if (prop.startsWith('$')) return getCSSColor(prop)
  if (prop.includes('#')) return getCSSValue(prop, unit)
  if (canBeNumber(prop)) return addUnit(prop, unit)

  return prop
}

const keyPrefix: Record<string, string> = {
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
  const count = Number(style?.dataset.count || 0) - 1

  count > 0 ? (style!.dataset.count = String(count)) : style?.remove()
}

function parseStyleObject(name: string, object: any, resolve = true) {
  let declarations: string = ''
  const parser = resolve ? cssPropValue : addUnit

  for (const key in object) {
    if (!object[key]) continue

    const property = keyPrefix[key] ?? toKebabCase(key)
    const cssValue = parser(object[key], unitsByProp[key])

    declarations += `${property.replace('$', '--')}: ${cssValue}; `
  }

  return `.${name} { ${declarations} }`
}

function mount(name: string, object: any, resolve = true) {
  if (!name || typeof window === 'undefined') return

  const style = $(`style[for=${name}]`) ?? document.createElement('style')
  const count = Number(style.dataset.count || 0) + 1

  if (count > 1) {
    style.dataset.count = String(count)
    return
  }

  style.dataset.count = String(count)
  style.setAttribute('for', name)
  style.dataset.count = String(count)
  style.innerHTML = parseStyleObject(name, object, resolve)

  document.head.append(style)
}

function getStyles(style: any): Record<string, any> {
  return Object.assign({}, style, style.styled, {
    as: undefined,
    styled: undefined
  })
}

// prettier-ignore
export const createStyle: CreateStyle = (styles: any, options) => {
    const prefix = options?.prefix ?? 'md-css-'
    const resolve = options?.resolveVars
    const object = ref(getStyles(styles()))
    
    const name = computed(() => {
      const string = JSON.stringify(object.value)
      return string === '{}' ?  "" :  prefix + hashStr(string, 6)
    })

    watch(name, (newName, oldName) => {
      mount(newName, object.value, resolve)
      dismount(oldName)
    })
    
    watch(styles, (value) => {object.value = getStyles(value)}, {deep: true})
    onBeforeMount(() => mount(name.value, object.value, resolve))
    onUnmounted(() => setTimeout(() => dismount(name.value), 5000))

    return name
  }
