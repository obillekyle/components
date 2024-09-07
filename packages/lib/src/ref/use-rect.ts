import type { Ref } from 'vue'

import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { toProxy } from './tools'

type RectType = { ready: false } | ({ ready: true } & DOMRect)

export function useRect(elem: Ref<HTMLElement | undefined>) {
  let observer: ResizeObserver
  const rect = ref<RectType>({ ready: false })

  onBeforeMount(() => {
    if (typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver(([entry]) => {
      rect.value = Object.assign(entry.target.getBoundingClientRect(), {
        ready: true
      })
    })

    elem.value && observer.observe(elem.value)
  })

  watch(elem, (newElement, oldElement) => {
    oldElement && observer.unobserve(oldElement)
    newElement && observer.observe(newElement)
  })

  onBeforeUnmount(() => observer.disconnect())
  return toProxy(rect, true)
}
