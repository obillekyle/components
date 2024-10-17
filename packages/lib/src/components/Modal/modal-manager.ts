import type { ModalProps } from './util'

import { ComponentManager, injected } from '@/utils/component-manager'
import { inject } from 'vue'

export const ModalManager = new ComponentManager<ModalProps>({
  defaults: {
    content: '',
    focusLock: true,
    closeable: false
  }
})

export const useModal = () => inject('modal-manager', ModalManager)
export const useModalUtils = () => injected<ModalProps>('modal-utils')
