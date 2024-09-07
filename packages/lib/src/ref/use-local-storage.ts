import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import { parser, stringify } from '../utils/object/transform'

export function useLocalStorage<T>(key: string): Ref<T | undefined>
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T>
export function useLocalStorage<T>(key: string, defaultValue?: T) {
  const value = ref<T | undefined>(defaultValue)

  function getData(): any {
    const data = localStorage.getItem(key)
    return data ? parser(data) : defaultValue
  }

  function handleDataChange(event: StorageEvent) {
    if (event.key === key) {
      value.value = getData()
    }
  }

  onMounted(() => {
    value.value = getData()
    addEventListener('storage', handleDataChange)
  })

  onUnmounted(() => {
    removeEventListener('storage', handleDataChange)
  })

  watch(value, (v) => {
    v === undefined
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, stringify(v))
  })

  return value
}
