import type { ShallowRef } from 'vue'
import type { ThemeObject } from './types'

import { toProxy } from '@/ref/tools'
import { inject, shallowRef } from 'vue'
import { DefaultThemeObject } from './defaults'

export function useTheme() {
  const theme: ShallowRef<ThemeObject> = inject(
    'theme-options',
    shallowRef(DefaultThemeObject)
  )

  return toProxy(theme)
}
