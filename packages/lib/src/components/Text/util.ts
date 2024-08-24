import type { ColorString, SizesString } from '@/utils/css/type'

export type TextProps = {
  color?: ColorString
  size?: SizesString
  italic?: boolean
  spacing?: SizesString
  lineHeight?: SizesString
  weight?: `${number}` | number
  textAlign?: 'left' | 'center' | 'right'
  wrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
}
