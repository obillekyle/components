import type {
  ColorEngineVars,
  ColorOptions,
  ColorString,
  Colors,
  SizeRecord,
  SizeType
} from '@/utils'

export type ElementSizes = {
  navbar: SizeType
  header: SizeType
  fab: SizeType
}

export interface ThemeOther {
  [key: string]: any
}

export type ThemeBase = {
  theme: 'light' | 'dark'
  color: ColorString
  fontFamily: string
  sizes: SizeRecord
  component: ElementSizes
  other: ThemeOther
}

export type ThemeOptions = {
  colors: string | Partial<ColorOptions<Colors | string>>
} & ThemeBase

export type ThemeObject = {
  colors: ColorOptions<Colors> & {
    $vars: ColorEngineVars
    $shades: ReadonlyMap<string, string>
  }
} & ThemeBase

export type ThemeProps = {
  global?: boolean
  options?: Partial<ThemeOptions>
  inherit?: boolean
}
