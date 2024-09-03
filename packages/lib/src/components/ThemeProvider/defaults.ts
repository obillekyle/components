import type { ElementSizes, ThemeObject } from './types'

import { ColorEngine } from '@/utils/color-engine'
import { DefaultSizes } from '@/utils/css/defaults'

const color = new ColorEngine('#0df')
export const DefaultElementSizes: ElementSizes = {
  navbar: '#size-lg',
  header: '#size-sm',
  fab: '#size-xs'
}

export const DefaultThemeObject: ThemeObject = {
  theme: 'dark',
  color: '$on-surface',
  colors: Object.assign({}, color.colors, {
    $vars: color.getColorVariables(),
    $shades: color.getShades()
  }),
  fontFamily: 'Roboto, sans-serif',
  sizes: DefaultSizes,
  component: DefaultElementSizes,
  other: {}
}
