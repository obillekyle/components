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

export type Position = { x: number; y: number }

export function getClientPos(event: TouchEvent | MouseEvent): Position {
  return 'changedTouches' in event
    ? {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      }
    : { x: event.clientX, y: event.clientY }
}

type TargetsSelfFn = {
  <T extends Event>(event: T, handler: (event: T) => any): void
}

export const targetsSelf: TargetsSelfFn = (event, handler) => {
  const { currentTarget, target } = event
  if (target === currentTarget) handler(event)
}
