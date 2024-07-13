import type { AppSizesString } from '@/utils/css'

export type TextProps = {
  color?: string
  size?: AppSizesString
  weight?: number
  italic?: boolean
  spacing?: number
  lineHeight?: number | string
  textAlign?: 'left' | 'center' | 'right'
}
