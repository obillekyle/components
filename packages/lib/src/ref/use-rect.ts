import type { Ref } from 'vue'

import { FrameQueue } from '@/utils/other/frame-queue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { toProxy } from './tools'

const isSimilar = (a: DOMRect, b: DOMRect) =>
  a.left === b.left &&
  a.top === b.top &&
  a.right === b.right &&
  a.bottom === b.bottom &&
  a.width === b.width &&
  a.height === b.height

type RectType = { ready: false } | ({ ready: true } & DOMRect)
export function useRect(elem: Ref<HTMLElement | undefined>) {
  const rect = ref<RectType>({ ready: false })

  function updateRect() {
    if (!elem.value && rect.value.ready) {
      rect.value = { ready: false }
      return
    }

    if (!elem.value) return

    const oldRect = rect.value
    const newRect = elem.value.getBoundingClientRect()

    if (!oldRect.ready || !isSimilar(oldRect, newRect)) {
      rect.value = Object.assign(newRect, { ready: true })
    }
  }

  onMounted(() => FrameQueue.add(updateRect))
  onBeforeUnmount(() => FrameQueue.remove(updateRect))

  return toProxy(rect, true)
}
