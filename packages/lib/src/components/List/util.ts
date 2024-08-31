import type { UseList } from './types'

import { inject, shallowRef, type Ref } from 'vue'

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

type WithProxyRef<T> = T & Ref<T>

export function useList() {
  const items = inject('list-provide', shallowRef<UseList>(dummyUseList))

  return new Proxy(items, {
    get(target, key, receiver) {
      if (key === 'value') return target.value
      return Reflect.get(target.value, key, receiver)
    }
  }) as WithProxyRef<UseList>
}
