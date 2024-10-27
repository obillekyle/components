import type { Ref } from 'vue'

import { replaceDeep } from '@/utils/object/merge'
import { parser, stringify } from '@/utils/object/transform'
import { onMounted, onUnmounted, ref, watch } from 'vue'

export function useLocalStorage<T>(key: string): Ref<T | undefined>
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T>
export function useLocalStorage<T>(key: string, defaultValue?: T) {
  let ignore = true
  const value = ref<T | undefined>(defaultValue)

  function getData(): any {
    const data = localStorage.getItem(key)
    return data ? parser(data) : defaultValue
  }

  function handleDataChange(event: StorageEvent) {
    if (event.key === key) {
      ignore = true
      value.value = replaceDeep(value.value, getData())
    }
  }

  function watcher(data: any) {
    if (ignore) return (ignore = false)

    localStorage.setItem(key, stringify(data))
  }

  onMounted(() => {
    value.value = replaceDeep(value.value, getData())
    addEventListener('storage', handleDataChange)
  })

  onUnmounted(() => removeEventListener('storage', handleDataChange))
  watch(value, watcher, { deep: true })

  return value
}
