import type { ColorString, SizesString } from '@/utils/css/type'

export type TextProps = {
  color?: ColorString
  size?: SizesString
  weight?: number
  italic?: boolean
  spacing?: SizesString
  lineHeight?: SizesString
  textAlign?: 'left' | 'center' | 'right'
  wrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
}
