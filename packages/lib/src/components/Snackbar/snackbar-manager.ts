import type { SnackbarProps } from './util'

import { ComponentManager, injected } from '@/utils/component-manager'
import { inject } from 'vue'

export const SnackbarManager = new ComponentManager<SnackbarProps>({
  defaults: {
    timeout: 8000,
    closeable: false
  }
})

export const useSnackbar = () => inject('snackbar-manager', SnackbarManager)
export const useSnackbarUtils = () =>
  injected<SnackbarProps>('snackbar-utils')
