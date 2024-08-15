import type { Colors } from './class'

export type Curve = [number, number, number, number]
export type ColorOptions<T = string> = {
  primary: T
  secondary: T
  tertiary: T
  error: T
  neutral: T
  [key: string]: T
}

export type ColorParam =
  | string
  | Colors
  | Partial<ColorOptions<string | Colors>>
