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
