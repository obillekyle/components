import type { SheetProps } from './util'

import { ComponentManager } from '@/utils/component-manager'
import { getCurrentInstance, inject } from 'vue'

export const SheetManager = new ComponentManager<SheetProps>({
  defaults: {
    type: 'modal',
    focusLock: true,
    resizable: true,
    closeable: false,
    direction: 'right'
  }
})

export function useSheet() {
  return getCurrentInstance()
    ? inject('sheet-manager', SheetManager)
    : SheetManager
}
