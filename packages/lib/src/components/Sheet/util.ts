import type { Component } from 'vue'

export interface SheetProps {
  title?: Component | string
  content: Component | string
  direction?: 'top' | 'right' | 'bottom' | 'left'
  closeable?: boolean
  resizable?: boolean
  focusLock?: boolean
  size?: number
}
