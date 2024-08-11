import '@/assets/ripple.scss'
import { $ } from './selector'

export function rippleEffect(e: PointerEvent, to?: string) {
  const target = e.currentTarget as HTMLElement
  const element = to ? $(to, target) || target : target

  if ('disabled' in element && element.disabled) return
  if (e.pointerType === 'mouse' && e.button === 2) return

  const rect = element.getBoundingClientRect()
  const ripple = document.createElement('span')

  ripple.className = 'md-ripple'
  ripple.style.top = e.clientY - rect.top + 'px'
  ripple.style.left = e.clientX - rect.left + 'px'
  ripple.style.width =
    (rect.height > rect.width ? rect.height : rect.width) + 'px'
  ripple.style.height = ripple.style.width

  function removeRipple() {
    ripple.classList.add('fade')
    ripple.addEventListener('animationend', () => ripple.remove(), {
      once: true
    })
  }

  document.addEventListener('pointerup', removeRipple, { once: true })
  document.addEventListener('pointercancel', removeRipple, { once: true })

  element.append(ripple)
}
