import '@/assets/tooltip.scss'
import { FrameQueue } from '@/utils/other/frame-queue'
import {
  onMounted,
  onUnmounted,
  shallowReactive,
  watch,
  type Ref
} from 'vue'

function newFloater(content: string): HTMLElement {
  const floater = document.createElement('div')

  floater.textContent = content
  floater.classList.add('md-tooltip')

  return floater
}

function getFloaterPos(
  target: HTMLElement,
  floater: HTMLElement
): { top: string; left: string } {
  const tRect = target.getBoundingClientRect()
  const fRect = floater.getBoundingClientRect()

  const onBottom = tRect.top < fRect.height
  const top = onBottom ? tRect.top + tRect.height : tRect.top
  const left = tRect.width / 2 + tRect.left

  return { top: top + 'px', left: left + 'px' }
}

export function useTooltip(
  elem: Ref<HTMLElement | undefined>,
  attr: string | string[] = 'title',
  state = true
) {
  const target = shallowReactive({
    enabled: state,
    current: undefined as HTMLElement | undefined,
    floater: undefined as HTMLElement | undefined
  })

  const selector = Array.isArray(attr)
    ? attr.map((i) => `[${i}]:hover`).join(',')
    : `[${attr}]:hover`

  function getAttr(element: HTMLElement) {
    const search = Array.isArray(attr) ? attr : [attr]
    return search.map((i) => element.getAttribute(i) ?? '').find(Boolean)
  }

  function changeSetter() {
    if (!target.enabled || !elem.value) return

    const elements = elem.value.querySelectorAll(selector)
    // eslint-disable-next-line unicorn/prefer-at
    const current = elements[elements.length - 1]

    if (current && current !== target.current) {
      target.current = current as HTMLElement
      return
    }

    if (!current) {
      target.current = undefined
    }
  }

  watch(
    () => target.current,
    (current) => {
      if (!elem.value) return

      if (target.floater) {
        const floater = target.floater

        if (floater.classList.contains('show')) {
          floater.classList.remove('show')
          setTimeout(() => floater.remove(), 500)
        } else {
          floater.remove()
        }

        target.floater = undefined
      }

      if (current) {
        const floater = newFloater(getAttr(current) ?? '')
        Object.assign(floater.style, getFloaterPos(current, floater))
        setTimeout(() => floater.classList.add('show'), 500)

        elem.value.after(floater)
        target.floater = floater
      }
    }
  )

  onMounted(() => FrameQueue.add(changeSetter))
  onUnmounted(() => FrameQueue.remove(changeSetter))

  return target
}
