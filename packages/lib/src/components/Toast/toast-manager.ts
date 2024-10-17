import type { ToastProps } from './util'

import { ComponentManager, injected } from '@/utils/component-manager'
import { inject } from 'vue'

export const ToastManager = new ComponentManager<ToastProps>({
  defaults: {
    variant: 'short'
  }
})

export const useToast = () => inject('toast-manager', ToastManager)
export const useToastUtils = () => injected<ToastProps>('toast-utils')
