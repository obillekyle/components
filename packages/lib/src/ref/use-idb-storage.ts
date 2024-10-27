import type { Ref } from 'vue'

import { IDBStorage as IDB } from '@/utils/idb'

import { replaceDeep } from '@/utils/object/merge'
import { onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue'

export function useIDBStorage<T>(key: string): Ref<T | undefined>
export function useIDBStorage<T>(key: string, defaultValue: T): Ref<T>
export function useIDBStorage<T>(key: string, defaultValue?: T) {
  let ignore = true
  const index = ref<T | undefined>(defaultValue)

  async function itemUpdate(data: { key: string }) {
    if (data.key === key) {
      ignore = true
      index.value = replaceDeep(index.value, await IDB.getItem(key))
    }
  }

  onMounted(async () => {
    if (await IDB.hasItem(key)) {
      const data = await IDB.getItem(key)
      index.value = replaceDeep(index.value, data)
    }

    IDB.addEventListener('storage', itemUpdate)
  })

  function watcher(data: any) {
    if (ignore) return (ignore = false)

    IDB.setItem(key, toRaw(data))
  }

  onBeforeUnmount(() => IDB.removeEventListener('storage', itemUpdate))
  watch(index, watcher, { deep: true })

  return index
}
