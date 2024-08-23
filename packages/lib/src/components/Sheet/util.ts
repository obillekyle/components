import type { UtilityFunction } from '@/utils/component-manager'
import type { Component } from 'vue'

export interface SheetProps {
  title?: Component | string
  content: Component | string
  type?: 'standard' | 'modal'
  direction?: 'top' | 'right' | 'bottom' | 'left'
  closeable?: boolean
  resizable?: boolean
  focusLock?: boolean
  size?: number
}

const defaultUtility: UtilityFunction<SheetProps> = {
  id: Number.NaN,
  close: () => {},
  modify: () => {}
}

export const SHEET = {
  DEFAULT_UTILITY: defaultUtility
}
