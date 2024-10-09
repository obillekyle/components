import type { ColorString, SizesString } from '../css/type'
import type { CreateStyle, CreateStyleOptions } from './types'

import { computed, onUnmounted, shallowRef, watch } from 'vue'
import { getCSSColor } from '../css/color'
import { canBeNumber } from '../css/main'
import { addUnit, getCSSValue } from '../css/sizes'
import { toKebabCase } from '../string/cases'
import { hashStr } from '../string/hash'
import { keyPrefix } from './variables'

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

type MountedStyle = {
  count: number
  value: string
}

class Styles {
  public name = ''
  private options = {
    prefix: 'md-css-',
    resolveVars: true
  }

  private get parser() {
    return this.options.resolveVars ? cssPropValue : addUnit
  }

  public static store = new Map<string, MountedStyle>()
  constructor(options: CreateStyleOptions = {}) {
    Object.assign(this.options, options)
  }

  private static remove(name: string) {
    Styles.store.delete(name)
    const style = document.querySelector(`style[for=${name}]`)
    setTimeout(() => style?.remove(), 5000)
  }

  private static add(name: string, value: string) {
    const style = document.createElement('style')
    style.setAttribute('for', name)
    style.textContent = `.${name} { ${value} }`
    document.head.append(style)

    Styles.store.set(name, { count: 1, value })
  }

  public static toInline(object: any, resolve = (v: any) => v) {
    const declarations: string[] = []

    for (const [key, value] of Object.entries<any>(object)) {
      if (!value && value !== 0) continue

      const prop = (keyPrefix as any)[key] ?? toKebabCase(key)
      const key2 = prop[0] === '$' ? '--' + prop.slice(1) : prop

      declarations.push(key2 + ': ' + resolve(value))
    }

    return declarations.join('; ')
  }

  public static normalize(object: any) {
    return Object.assign({}, object, object.styled, {
      as: undefined,
      styled: undefined
    })
  }

  public getID(value: string) {
    const json = JSON.stringify(value)
    return json === '{}' ? '' : this.options.prefix + hashStr(json, 8)
  }

  public mount(object: any) {
    this.dismount()

    object = Styles.normalize(object)
    this.name = this.getID(object)

    if (!this.name) return ''

    Styles.store.has(this.name)
      ? Styles.store.get(this.name)!.count++
      : Styles.add(this.name, Styles.toInline(object, this.parser))

    return this.name
  }

  public dismount() {
    if (Styles.store.has(this.name)) {
      const style = Styles.store.get(this.name)!

      if (--style.count === 0) {
        Styles.remove(this.name)
      }
    }
  }
}

export const createStyle: CreateStyle = (styles: any, options) => {
  const sheets = new Styles(options)
  const object = shallowRef(styles())

  const setter = (value: any) => (object.value = value)
  const name = computed(() => sheets.mount(object.value))
  watch(styles, setter, { deep: true })
  onUnmounted(() => sheets.dismount())

  return name
}
