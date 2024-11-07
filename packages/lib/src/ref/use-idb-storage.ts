import type { Ref, UnwrapRef } from 'vue'

import { IDBStorage as IDB } from '@/utils/idb'

import { onMounted, onUnmounted, ref, toRaw, watch } from 'vue'

type WithEvent<T> = Ref<T> & {
  ready: Ref<boolean>
  onload?: (v: UnwrapRef<T>) => void
}

export function useIDBStorage<T>(key: string): WithEvent<T | undefined>
export function useIDBStorage<T>(key: string, def: T): WithEvent<T>
export function useIDBStorage<T>(key: string, defaultValue?: T) {
  let ignore = true
  const ready = ref(false)
  const index = ref<T | undefined>(defaultValue)
  const state = Object.assign(index, { ready }) as WithEvent<Ref<any>>

  async function itemUpdate(data: { key: string }) {
    if (data.key === key) {
      const data = (await IDB.hasItem(key))
        ? await IDB.getItem(key)
        : defaultValue

      ignore = true
      index.value = data
    }
  }

  async function storeCleared() {
    index.value = defaultValue
  }

  function watcher(data: any) {
    if (ignore) ignore = false
    else IDB.setItem(key, toRaw(data))
  }
  onMounted(async () => {
    if (await IDB.hasItem(key)) {
      const data = await IDB.getItem(key)
      index.value = data
    }

    ready.value = true
    state.onload?.(index.value)
    IDB.addEventListener('storage', itemUpdate)
    IDB.addEventListener('store-cleared', storeCleared)
  })

  onUnmounted(() => {
    IDB.removeEventListener('storage', itemUpdate)
    IDB.removeEventListener('store-cleared', storeCleared)
  })

  watch(index, watcher, { deep: true })

  return Object.assign(index, { ready })
}
