import type { SnackbarProps } from './util'

import { ComponentManager } from '@/utils/component-manager'
import { inject } from 'vue'

export const SnackbarManager = new ComponentManager<SnackbarProps>({
  defaults: {
    timeout: 8000,
    closeable: false
  }
})

export const useSnackbar = () => inject('snackbar-manager', SnackbarManager)
