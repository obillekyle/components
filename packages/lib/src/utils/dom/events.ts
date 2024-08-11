type KeyClickFunction = (
  event: KeyboardEvent,
  key?: string | string[]
) => void

export const keyClick: KeyClickFunction = (event, key = ' ') => {
  key = Array.isArray(key) ? key : [key]

  const target = event.currentTarget as HTMLElement
  if (target.matches(':focus-visible') && key.includes(event.key)) {
    target.click()
    event.preventDefault()
  }
}

/**  @deprecated Use `keyClick` instead */
export const keyboardClick = keyClick

export function getClientPos(event: TouchEvent | MouseEvent) {
  return event instanceof MouseEvent
    ? { x: event.clientX, y: event.clientY }
    : {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      }
}

type TargetsSelfFn = {
  <T extends Event>(event: T, handler: (event: T) => any): void
}

export const targetsSelf: TargetsSelfFn = (event, handler) => {
  const { currentTarget, target } = event
  if (target === currentTarget) handler(event)
}

/**  @deprecated Use `targetsSelf` instead */
export const onSelfEvent = targetsSelf
