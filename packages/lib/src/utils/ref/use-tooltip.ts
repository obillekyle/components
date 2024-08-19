import '@/assets/tooltip.scss'
import { onMounted, onUnmounted, watch, type Ref } from 'vue'
import { getParent } from '../dom/selector'
import { debounce } from '../function/perf'

export function useTooltip(
  ref: Ref<HTMLElement | undefined>,
  attr: string | string[] = 'title'
) {
  let tooltip = ''
  let timeout: any
  let enabled = true
  let current: HTMLElement | undefined
  let floater: HTMLElement | undefined

  const selector = Array.isArray(attr)
    ? attr.map((i) => `[${i}]`).join(',')
    : attr

  function getAttr(element: HTMLElement) {
    const search = Array.isArray(attr) ? attr : [attr]
    return search.map((i) => element.getAttribute(i) ?? '').find(Boolean)
  }

  function showTooltip(this: HTMLElement) {
    this.classList.add('show')
  }

  console.log('start')

  function onEnter(event: Event) {
    if (!enabled) return

    debounce(
      () => {
        const container = ref.value!
        const newTarget = getParent(event.target, selector, true)

        if (newTarget === current) return
        if (newTarget === undefined) return
        if (newTarget === event.currentTarget) return

        cleanupTooltip.bind(current)()
        event.preventDefault()

        current = newTarget
        tooltip = getAttr(current) ?? ''

        if (attr.includes('title') && current.hasAttribute('title')) {
          current.setAttribute('title', '')
        }

        const newFloater = document.createElement('div')

        floater = newFloater
        floater.textContent = tooltip
        floater.className = 'md-tooltip'

        container.append(floater)

        const tRect = current.getBoundingClientRect()
        const fRect = floater.getBoundingClientRect()
        const cRect = container.getBoundingClientRect()

        const onBottom = tRect.top < fRect.height
        const top = onBottom ? tRect.top + tRect.height : tRect.top
        const left = tRect.width / 2 + tRect.left
        const maxWidth =
          tRect.left < fRect.width / 2
            ? tRect.width / 2
            : cRect.width - (tRect.left + fRect.width / 2)

        floater.classList.toggle('bottom', onBottom)

        floater.style.top = top + 'px'
        floater.style.left = left + 'px'
        floater.style.maxWidth = maxWidth + 'px'

        timeout && clearTimeout(timeout)
        timeout = setTimeout(showTooltip.bind(floater), 800)

        current.addEventListener('mouseleave', cleanupTooltip)
        current.addEventListener('touchend', cleanupTooltip)
      },
      { key: 'tooltip', wait: 200 }
    )
  }

  function cleanupTooltip(this: HTMLElement | void, event?: Event) {
    if (event?.type === 'touchend') {
      event.preventDefault()
    }

    if (floater && this) {
      this.removeEventListener('mouseleave', cleanupTooltip)
      this.removeEventListener('touchend', cleanupTooltip)

      if (attr.includes('title') && this.hasAttribute('title')) {
        this.setAttribute('title', tooltip)
      }

      if (!floater.classList.contains('show')) {
        timeout && clearTimeout(timeout)
        floater.remove()
      }

      floater.classList.remove('show')
      floater.addEventListener('transitionend', function () {
        this.remove()
      })
    }
  }

  function mount(element: HTMLElement) {
    element.addEventListener('mousemove', onEnter)
    element.addEventListener('touchstart', onEnter)
  }

  function unmount(element: HTMLElement) {
    element.removeEventListener('mousemove', onEnter)
    element.removeEventListener('touchstart', onEnter)
  }

  watch(ref, (newElement, oldElement) => {
    newElement && mount(newElement)
    oldElement && unmount(oldElement)
  })

  onMounted(() => ref.value && mount(ref.value))
  onUnmounted(() => ref.value && unmount(ref.value))

  return {
    toggle: () => {
      enabled = !enabled
    },
    get target() {
      return current
    }
  }
}
