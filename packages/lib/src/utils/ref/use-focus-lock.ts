import type { Ref } from 'vue'

import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

export function useFocusLock(
  elem: Ref<HTMLElement | undefined>,
  state = true
) {
  const enabled = ref(state)

  function onBlur(event: FocusEvent) {
    if (!enabled.value) return
    if (getParent(event.relatedTarget, '[focus-lock]')) return

    event.preventDefault()
    focusFirstFocusable(event.currentTarget)
  }

  function mountEvent(element: HTMLElement) {
    element.setAttribute('focus-lock', '')
    element.addEventListener('focusout', onBlur)
    focusFirstFocusable(element)
  }

  function unmountEvent(element: HTMLElement) {
    element.removeAttribute('focus-lock')
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

  onMounted(() => {
    elem.value && mountEvent(elem.value)
    document.addEventListener('focusin', focusOther)
  })

  onBeforeUnmount(() => {
    elem.value && unmountEvent(elem.value)
    document.removeEventListener('focusin', focusOther)

    focusLastLockable()
  })

  return enabled
}
