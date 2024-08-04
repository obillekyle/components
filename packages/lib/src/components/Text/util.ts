import type { SizeType } from '@/utils/css'

export type TextProps = {
  color?: string
  size?: SizeType
  weight?: number
  italic?: boolean
  spacing?: number
  lineHeight?: number | string
  textAlign?: 'left' | 'center' | 'right'
}
