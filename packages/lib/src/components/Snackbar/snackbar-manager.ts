import type { SnackbarProps } from './util'

import { ComponentManager } from '@/utils/component-manager'
import { getCurrentInstance, inject } from 'vue'

export const SnackbarManager = new ComponentManager<SnackbarProps>({
  defaults: {
    timeout: 8000,
    closeable: false
  }
})

export function useSnackbar() {
  return getCurrentInstance()
    ? inject('snackbar-manager', SnackbarManager)
    : SnackbarManager
}
