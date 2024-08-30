import type { ColorEngineVars } from '@/utils/color-engine/types'
import type { ColorOptions } from '@/utils/colors/type'
import type {
  ColorString,
  SizeDict,
  SizeRecord,
  SizeType
} from '@/utils/css/type'
import type { ShallowRef } from 'vue'

import { ColorEngine } from '@/utils/color-engine'
import { Colors } from '@/utils/colors/class'
import { DefaultSizes } from '@/utils/css/defaults'
import { addPX } from '@/utils/css/sizes'
import { inject, shallowRef } from 'vue'

export function getSizes(object: SizeDict, prefix: string) {
  const object_: Record<string, string> = {}
  const sizes = object as Record<string, number>

  for (const key in sizes) {
    object_[prefix + '-' + key] = addPX(sizes[key])
  }

  return object_
}

export type ElementSizes = {
  navbar: SizeType
  header: SizeType
  fab: SizeType
}

export const DefaultElementSizes: ElementSizes = {
  navbar: '#size-lg',
  header: '#size-sm',
  fab: '#size-xs'
}

export interface LayoutOther {
  [key: string]: any
}

export type ThemeBase = {
  theme: 'light' | 'dark'
  color: ColorString
  fontFamily: string
  sizes: SizeRecord
  component: ElementSizes
  other: LayoutOther
}

export type ThemeOptions = {
  colors: string | Partial<ColorOptions<Colors | string>>
} & ThemeBase

export type ThemeObject = {
  colors: ColorOptions<Colors> & { $vars: ColorEngineVars }
} & ThemeBase

export type ThemeProps = {
  global?: boolean
  options?: Partial<ThemeOptions>
  inherit?: boolean
}

const color = new ColorEngine('#0df')

export const DefaultThemeObject: ThemeObject = {
  theme: 'dark',
  color: '$on-surface',
  colors: Object.assign({}, color.colors, {
    $vars: color.getColorVariables()
  }),
  fontFamily: 'Roboto, sans-serif',
  sizes: DefaultSizes,
  component: DefaultElementSizes,
  other: {}
}

export function useTheme(): ShallowRef<ThemeObject> {
  return inject('theme', shallowRef(DefaultThemeObject))
}
