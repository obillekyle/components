import { throttler } from '../function/perf'

type KeyClickFunction = (
  event: KeyboardEvent,
  key?: string | string[]
) => void

export const keyClick: KeyClickFunction = (event, key = ' ') => {
  key = Array.isArray(key) ? key : [key]

  const target = event.currentTarget as HTMLElement
  if (target.matches(':focus-visible') && key.includes(event.key)) {
    event.preventDefault()
    throttler(() => target.click(), {
      wait: 80,
      key: 'keyClick'
    })
  }
}

/**  @deprecated Use `keyClick` instead */
export const keyboardClick = keyClick

type Position = { x: number; y: number }

export function getClientPos(event: TouchEvent | MouseEvent): Position {
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

function dummyElement() {
  const element = document.createElement('div')
  element.style.position = 'fixed'
  element.style.inset = '0'

  return element
}

export function dragPos(
  callback: (pos: Position) => void
): (event: TouchEvent | MouseEvent) => void {
  let dragging = false
  const element = dummyElement()

  function dragMove(event: TouchEvent | MouseEvent) {
    dragging && callback(getClientPos(event))
  }

  function dragEnd() {
    removeEventListener('mousemove', dragMove)
    removeEventListener('mouseup', dragEnd)

    removeEventListener('touchmove', dragMove)
    removeEventListener('touchcancel', dragEnd)
    removeEventListener('touchend', dragEnd)

    element.remove()
    document.body.style.removeProperty('cursor')
    dragging = false
  }

  return () => {
    document.body.append(element)
    document.body.style.cursor = 'grabbing'

    addEventListener('mousemove', dragMove)
    addEventListener('mouseup', dragEnd)

    addEventListener('touchmove', dragMove)
    addEventListener('touchcancel', dragEnd)
    addEventListener('touchend', dragEnd)
    dragging = true
  }
}
