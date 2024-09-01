import type { Ref } from 'vue'

import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'

export function useRect(
  elem: Ref<HTMLElement | undefined>
): Ref<DOMRect | undefined> {
  let observer: ResizeObserver
  const rect = ref<DOMRect>()

  onBeforeMount(() => {
    if (typeof ResizeObserver === 'undefined') return
    observer = new ResizeObserver(([entry]) => {
      rect.value = entry.target.getBoundingClientRect()
    })

    elem.value && observer.observe(elem.value)
  })

  watch(elem, (newElement, oldElement) => {
    oldElement && observer.unobserve(oldElement)
    newElement && observer.observe(newElement)
  })

  onBeforeUnmount(() => observer.disconnect())
  return rect
}
