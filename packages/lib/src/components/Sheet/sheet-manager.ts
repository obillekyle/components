import type { SheetProps } from './util'

import { ComponentManager, injected } from '@/utils/component-manager'
import { inject } from 'vue'

export const SheetManager = new ComponentManager<SheetProps>({
  defaults: {
    focusLock: true,
    resizable: true,
    closeable: false,
    direction: 'right'
  }
})

export const useSheet = () => inject('sheet-manager', SheetManager)
export const useSheetUtils = () => injected<SheetProps>('sheet-utils')
