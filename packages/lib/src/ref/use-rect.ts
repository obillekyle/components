import type { Ref } from 'vue'

import { toDecimalFixed } from '@/utils'
import { shallowMerge } from '@/utils/object/merge'
import { FrameQueue } from '@/utils/other/frame-queue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { toProxy } from './tools'

const isSimilar = (a: DOMRect, b: DOMRect, onMove: boolean) => {
  if (onMove) {
    return (
      a.left === b.left &&
      a.top === b.top &&
      a.right === b.right &&
      a.bottom === b.bottom &&
      a.width === b.width &&
      a.height === b.height
    )
  }
  return a.width === b.width && a.height === b.height
}

type RectType =
  | { ready: false }
  | ({ ready: true } & Omit<DOMRect, 'toJSON'>)

export function useRect(elem: Ref<HTMLElement | undefined>, onMove = true) {
  const rect = ref<RectType>({ ready: false })

  function updateRect() {
    if (!elem.value && rect.value.ready) {
      rect.value = { ready: false }
      return
    }

    if (!elem.value) return

    const oldRect: any = rect.value
    const newRect: any = elem.value.getBoundingClientRect().toJSON()

    for (const key in newRect) {
      newRect[key] = toDecimalFixed(newRect[key], 2)
    }

    if (!oldRect.ready || !isSimilar(oldRect, newRect, onMove)) {
      rect.value = shallowMerge(newRect, { ready: true })
    }
  }

  onMounted(() => FrameQueue.add(updateRect))
  onBeforeUnmount(() => FrameQueue.remove(updateRect))

  return toProxy(rect, true)
}
