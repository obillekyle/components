import { onMounted, onUnmounted } from 'vue'

export function useKeyEvent(
  key: string | string[],
  handler: (event: KeyboardEvent) => void
) {
  const keys = Array.isArray(key) ? key : [key]
  const keyDown = (event: KeyboardEvent) => {
    keys.includes(event.key) && handler(event)
  }

  onMounted(() => addEventListener('keydown', keyDown))
  onUnmounted(() => removeEventListener('keydown', keyDown))
}

export function useKeyEvents(
  handlers: Record<string, (event: KeyboardEvent) => void>
) {
  const keyDown = (event: KeyboardEvent) => {
    const handler = handlers[event.key] || handlers[event.code]
    handler && handler(event)
  }

  onMounted(() => addEventListener('keydown', keyDown))
  onUnmounted(() => removeEventListener('keydown', keyDown))
}
