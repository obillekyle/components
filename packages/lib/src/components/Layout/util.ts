import { Colors, isLight } from '@/utils/colors'
import {
  type AppSizes,
  type AppSizesPrefixes,
  type AppSizesString,
  type ColorString,
  type AppColorVariants,
  type SizesString,
  type AppColorString,
  addPX
} from '@/utils/css'

export type SizesObject = { [key in AppSizes]: SizesString }
export type AppSizesObject = { [key in AppSizesPrefixes]: SizesObject }
export const AppShades = [
  0, 1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100
] as const
export type AppColorShades = (typeof AppShades)[number]

export const DefaultSizes: AppSizesObject = {
  padding: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28
  },
  component: {
    xxs: 24,
    xs: 32,
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
    xxl: 72
  },
  size: {
    xxs: 24,
    xs: 36,
    sm: 48,
    md: 60,
    lg: 72,
    xl: 84,
    xxl: 96
  },
  font: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22
  },
  icon: {
    xxs: 8,
    xs: 12,
    sm: 16,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36
  }
}

export function getShades(
  color: string | String | Colors,
  prefix: string,
  theme: 'light' | 'dark'
) {
  const colors = Colors.from(color)
  const isDark = theme == 'dark'
  const values: Record<string, string> = {}

  for (const shade of AppShades) {
    const key = prefix + '-' + shade
    const val = isDark ? shade : Math.abs(100 - shade)
    values[key] = colors.shade(val)

    for (let i = 0; i < 9; i++) {
      const color = colors.shade(val, (i + 1) * 0.1)
      values[key + '-' + (i + 1) * 10] = color
    }
  }

  const main = colors.shade(50)
  values[prefix] = main
  values['on-' + prefix] = colors.shade(isLight(main) ? 5 : 95)

  const container = colors.shade(isDark ? 90 : 80)
  values[prefix + '-container'] = container
  values['on-' + prefix + '-container'] = colors.shade(
    isLight(container) ? 5 : 95
  )

  return values
}

export function getSizes(object: SizesObject, prefix: string) {
  const obj: Record<string, string> = {}
  const sizes = object as Record<string, number>

  for (const key in sizes) {
    obj[prefix + '-' + key] = addPX(sizes[key])
  }

  return obj
}

export type ElementSizes = {
  navbar: AppSizesString
  header: AppSizesString
  fab: AppSizesString
}

export const DefaultElementSizes: ElementSizes = {
  navbar: 'xl',
  header: 'md',
  fab: 'md'
}

export interface LayoutOther {
  [key: string]: any
}

export type LayoutOptions = {
  theme: 'light' | 'dark'
  color: AppColorString
  colors: { [key in AppColorVariants]: ColorString | Colors }
  fontFamily: string
  sizes: AppSizesObject
  component: ElementSizes
  other: LayoutOther
}

export const DefaultLayoutOptions: LayoutOptions = {
  theme: 'dark',
  color: 'primary-99',
  colors: {
    primary: '#1a73e8',
    secondary: '#ffbe0d',
    error: '#f01c00',
    mono: '#000000'
  },
  fontFamily: 'Roboto, sans-serif',
  sizes: DefaultSizes,
  component: DefaultElementSizes,
  other: {}
}
