import { toProxy } from '@/ref/tools'
import { inject, shallowRef } from 'vue'
import { DefaultThemeObject } from './defaults'

export function useTheme() {
  const theme = inject('theme-options', shallowRef(DefaultThemeObject))

  return toProxy(theme)
}
