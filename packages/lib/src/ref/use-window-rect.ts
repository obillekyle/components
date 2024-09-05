import { onMounted, onUnmounted, ref } from 'vue'
import { toProxy } from './tools'

export function useWindowSize() {
  const rect = ref({ width: 0, height: 0 })

  function handleResize() {
    rect.value = { width: window.innerWidth, height: window.innerHeight }
  }

  onMounted(() => {
    handleResize()
    addEventListener('resize', handleResize)
  })
  onUnmounted(() => removeEventListener('resize', handleResize))
  return toProxy(rect, true)
}
