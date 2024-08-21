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
  closeable?: boolean
  focusLock?: boolean
}

const defaultUtility: UtilityFunction<ModalProps> = {
  id: Number.NaN,
  close: () => {},
  modify: () => {}
}

export const MODAL = {
  DEFAULT_UTILITY: defaultUtility,

  PRESET_ACTION_CLOSE: [
    {
      label: 'Close',
      onClick: (utils) => utils.close()
    }
  ] as ModalAction[],

  PRESET_ACTION_CONFIRM: function (confirmation: ModalActionOnClick) {
    return [
      {
        label: 'Cancel',
        variant: 'outlined',
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
