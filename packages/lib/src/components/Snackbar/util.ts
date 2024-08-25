import type { UtilityFunction } from '@/utils/component-manager'
import type { Component } from 'vue'

type SnackbarAction = {
  label: string
  onClick: (utils: UtilityFunction<SnackbarProps>) => void
}

export interface SnackbarProps {
  message: string | Component
  icon?: string
  timeout?: number
  actions?: (Component | SnackbarAction)[]
  closeable?: boolean
}

export const SNACKBAR = {
  ID_STARTS_FROM: 1000,
  DEFAULT_TIMEOUT: 3000
}
