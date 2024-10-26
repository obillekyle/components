import type { Ref } from 'vue'

import { IDBStorage } from '@/utils/idb'
import { onMounted, onUnmounted, ref, toRaw, watch } from 'vue'

export function useIDBStorage<T>(key: string): Ref<T | undefined>
export function useIDBStorage<T>(key: string, defaultValue: T): Ref<T>
export function useIDBStorage<T>(key: string, defaultValue?: T) {
  const index = ref<T | undefined>(defaultValue)

  async function itemUpdate(data: { key: string }) {
    if (data.key === key) {
      index.value = await IDBStorage.getItem(key)
    }
  }

  onMounted(async () => {
    if (await IDBStorage.hasItem(key)) {
      index.value = await IDBStorage.getItem(key)
    }

    IDBStorage.addEventListener('storage', itemUpdate)
  })

  onUnmounted(() => {
    IDBStorage.removeEventListener('storage', itemUpdate)
  })

  watch(index, (value) => IDBStorage.setItem(key, toRaw(value)), {
    deep: true
  })

  return index
}
