import type { Ref } from 'vue'

import { onMounted, onUnmounted, ref, watch } from 'vue'
import { $, getParent } from '../dom/selector'

const focusableSelector =
  'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'

function focusFirstFocusable(element?: HTMLElement | EventTarget | null) {
  $(focusableSelector, element)?.focus()
}

function focusLastLockable() {
  const lastFocusLock = document.querySelectorAll('[focus-lock]')

  if (lastFocusLock.length > 0) {
    focusFirstFocusable([...lastFocusLock].at(-1))
  }
}

function focusDummy() {
  const focusDummy = document.createElement('div')
  focusDummy.setAttribute('tabindex', '0')
  focusDummy.setAttribute(
    'style',
    'position: absolute; opacity: 0; pointer-events: none;'
  )
  return focusDummy
}

export function useFocusLock(
  elem: Ref<HTMLElement | undefined>,
  state = true
) {
  const dummy = focusDummy()
  const enabled = ref(state)
  let ignore = false

  function onClick(event: MouseEvent) {
    const root = elem.value
    const target = event.target as HTMLElement

    if (root) {
      ignore = root.contains(target)
      ignore || focusFirstFocusable(root)
    }
  }

  function onBlur(event: FocusEvent) {
    const root = event.currentTarget as HTMLElement
    const target = event.relatedTarget as HTMLElement

    if (ignore) {
      ignore = false
      return
    }

    if (!enabled.value) return
    if (root.contains(target)) return
    if (getParent(target, '[focus-lock]')) return

    event.preventDefault()
    focusFirstFocusable(root)
  }

  function mountEvent(element: HTMLElement) {
    element.setAttribute('focus-lock', '')
    element.after(dummy)

    document.addEventListener('pointerdown', onClick)
    document.addEventListener('focusin', focusOther)
    element.addEventListener('focusout', onBlur)

    focusFirstFocusable(element)
  }

  function unmountEvent(element: HTMLElement) {
    element.removeAttribute('focus-lock')
    document.removeEventListener('pointerdown', onClick)
    document.removeEventListener('focusin', focusOther)
    element.removeEventListener('focusout', onBlur)
  }

  function focusOther(event: FocusEvent) {
    if (!enabled.value) return
    if (getParent(event.relatedTarget, '[focus-lock]')) return
    focusLastLockable()
  }

  watch(elem, (newElement, oldElement) => {
    oldElement && unmountEvent(oldElement)
    newElement && mountEvent(newElement)
  })

  onMounted(() => elem.value && mountEvent(elem.value))

  onUnmounted(() => {
    dummy.remove()
    elem.value && unmountEvent(elem.value)

    focusLastLockable()
  })

  return enabled
}
