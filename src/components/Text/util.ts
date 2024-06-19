import type { AppSizesString } from '@/utils'

export type TextProps = {
  color?: string
  size?: AppSizesString
  weight?: number
  italic?: boolean
  spacing?: number
  lineHeight?: number | string
  textAlign?: 'left' | 'center' | 'right'
}
