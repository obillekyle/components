import '@/assets/tooltip.scss'
import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { getParent } from '../dom'
import { debounce } from '../function'

export function useTooltip(
  ref: Ref<HTMLElement | undefined>,
  attr: string | string[] = 'title'
) {
  let tooltip = ''
  let timeout: any
  let enabled = true
  let target: HTMLElement | undefined
  let floater: HTMLElement | undefined

  const selector = Array.isArray(attr)
    ? attr.map((i) => `[${i}]`).join(',')
    : attr

  function getAttr(element: HTMLElement) {
    const search = Array.isArray(attr) ? attr : [attr]
    return search.map((i) => element.getAttribute(i) ?? '').find(Boolean)
  }

  function onEnter(event: MouseEvent) {
    debounce(
      () => {
        const newTarget =
          getParent<HTMLElement>(
            event.target as HTMLElement,
            selector,
            true
          ) ?? undefined

        if (target === newTarget) return
        if (newTarget === event.currentTarget) return
        if (!newTarget) return

        target = newTarget

        if (enabled) {
          tooltip = getAttr(target) ?? ''
          const rect = target.getBoundingClientRect()

          if (attr.includes('title') && target.hasAttribute('title')) {
            target.setAttribute('title', '')
          }

          floater = document.createElement('div')
          floater.textContent = tooltip
          floater.className = 'md-tooltip'
          const onBottom = rect.top < rect.height
          const top = onBottom ? rect.top + rect.height : rect.top

          const left = rect.width / 2 + rect.left

          floater.style.top = `${top}px`
          floater.style.left = `${left}px`
          floater.style.maxWidth = rect.width + 'px'
          floater.classList.toggle('bottom', onBottom)

          ref.value?.append(floater)

          target.addEventListener('mouseleave', cleanup, { once: true })
          target.addEventListener('dragstart', cleanup, { once: true })
          timeout && clearTimeout(timeout)
          timeout = setTimeout(() => {
            floater?.classList.add('show')
          }, 800)
        }
      },
      { key: 'tooltip', wait: 200 }
    )
  }

  function cleanup() {
    if (floater && target) {
      if (attr.includes('title') && target.hasAttribute('title')) {
        target.setAttribute('title', tooltip)
      }

      if (floater.classList.contains('show')) {
        floater.classList.remove('show')
        floater.addEventListener('transitionend', function () {
          this.remove()
        })
        return
      }
      timeout && clearTimeout(timeout)
      floater.remove()
    }
  }

  watch(ref, (newElement, oldElement) => {
    oldElement && oldElement.removeEventListener('mousemove', onEnter)
    newElement && newElement.addEventListener('mousemove', onEnter)
  })

  onMounted(() => {
    const element = ref.value

    if (element) {
      element.addEventListener('mousemove', onEnter)
      element.addEventListener('mouseleave', cleanup)
    }
  })

  onUnmounted(() => {
    const element = ref.value

    if (element) {
      element.removeEventListener('mouseenter', onEnter)
      element.removeEventListener('mouseleave', cleanup)
    }
  })

  return {
    toggle: () => {
      enabled = !enabled
    }
  }
}
