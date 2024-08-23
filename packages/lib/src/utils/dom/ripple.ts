import '@/assets/ripple.scss'

import { getClientPos } from './events'
import { $ } from './selector'

export function rippleEffect(
  event: MouseEvent | TouchEvent | PointerEvent,
  to?: string
) {
  const target = event.currentTarget as HTMLElement
  const element = to ? $(to, target) || target : target

  if ('disabled' in element && element.disabled) return

  if (
    'pointerType' in event &&
    event.pointerType === 'mouse' &&
    event.button === 2
  )
    return

  const rect = element.getBoundingClientRect()
  const ripple = document.createElement('span')
  let { x, y } = getClientPos(event)

  function removeRipple() {
    ripple.classList.add('fade')
    ripple.addEventListener(
      'animationend',
      () => setTimeout(ripple.remove.bind(ripple), 400),
      { once: true }
    )
  }

  if (!event.isTrusted) {
    x = rect.left + rect.width / 2
    y = rect.top + rect.height / 2
    setTimeout(removeRipple, 100)
  }

  if (event.type === 'click' && event.isTrusted) return

  ripple.className = 'md-ripple'
  ripple.style.top = y - rect.top + 'px'
  ripple.style.left = x - rect.left + 'px'
  ripple.style.width =
    (rect.height > rect.width ? rect.height : rect.width) + 'px'
  ripple.style.height = ripple.style.width

  document.addEventListener('pointerup', removeRipple, { once: true })
  document.addEventListener('pointercancel', removeRipple, { once: true })

  element.append(ripple)
}
