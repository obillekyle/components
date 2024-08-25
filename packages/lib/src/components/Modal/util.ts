import type { UtilityFunction } from '@/utils/component-manager'
import type { Component } from 'vue'

type ModalActionOnClick = (utils: UtilityFunction<ModalProps>) => void

type ModalAction = {
  label: string
  onClick: ModalActionOnClick
  disabled?: boolean
  variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
}

export interface ModalProps {
  icon?: Component | string
  title?: Component | string
  content: Component | string
  actions?: ModalAction[]
  subAction?: Component | string
  fullScreen?: boolean
  closeable?: boolean
  focusLock?: boolean
}

export const MODAL = {
  PRESET_ACTION_CLOSE: function (label = 'Close') {
    return [
      {
        label,
        onClick: (utils) => utils.close()
      }
    ] as ModalAction[]
  },

  PRESET_ACTION_CONFIRM: function (confirmation: ModalActionOnClick) {
    return [
      {
        label: 'Cancel',
        onClick: (utils) => utils.close()
      },
      {
        label: 'Confirm',
        variant: 'filled',
        onClick: confirmation
      }
    ] as ModalAction[]
  }
}
