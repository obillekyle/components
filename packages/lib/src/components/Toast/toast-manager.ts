import type { ToastProps } from './util'

import { ComponentManager } from '@/utils/component-manager'
import { getCurrentInstance, inject } from 'vue'

export const ToastManager = new ComponentManager<ToastProps>({
  defaults: {
    variant: 'short'
  }
})

export function useToast() {
  return getCurrentInstance()
    ? inject('toast-manager', ToastManager)
    : ToastManager
}
