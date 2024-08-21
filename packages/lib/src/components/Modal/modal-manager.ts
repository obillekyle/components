import type { ModalProps } from './util'

import { ComponentManager } from '@/utils/component-manager'
import { getCurrentInstance, inject } from 'vue'

export const ModalManager = new ComponentManager<ModalProps>({
  defaults: {
    content: '',
    focusLock: true,
    closeable: false
  }
})

export function useModal() {
  return getCurrentInstance()
    ? inject('modal-manager', ModalManager)
    : ModalManager
}
