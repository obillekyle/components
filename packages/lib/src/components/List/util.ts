import { toProxy } from '@/ref/tools'
import type { UseList } from './types'

import { inject, shallowRef } from 'vue'

const dummyUseList: UseList = {
  items: { value: [] } as any,
  emit: () => {},
  root: undefined,
  size: 56,
  swipeDistance: 300,
  component: 'span',
  sortable: false,
  swipe: 'off',
  swipeOptions: {}
}

export function useList() {
  const items = inject('list-provide', shallowRef<UseList>(dummyUseList))
  return toProxy(items)
}
