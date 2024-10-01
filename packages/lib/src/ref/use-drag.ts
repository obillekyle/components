import type { Position } from '@/utils/dom/events'
import type { Ref } from 'vue'

import { getClientPos } from '@/utils/dom/events'
import { ref } from 'vue'

type DragEventHandler = (e: TouchEvent | MouseEvent | PointerEvent) => void

type DragHandlerTuple = [
  dragging: Readonly<Ref<boolean>>,
  handler: DragEventHandler
]

function dummyElement() {
  const element = document.createElement('div')
  element.style.position = 'fixed'
  element.style.inset = '0'

  return element
}

export function isTouch(event: Event) {
  return (
    event instanceof TouchEvent ||
    (event as PointerEvent).pointerType === 'touch'
  )
}

interface DragState extends Position {
  scrolledX: boolean
  scrolledY: boolean
  startX: number
  startY: number
  offsetX: number
  offsetY: number
}

interface DragEndState extends DragState {
  flingX: boolean
  flingY: boolean
}

type DragMoveHandler = (
  state: DragState,
  event: TouchEvent | MouseEvent
) => void

type DragEndHandler = (state: DragEndState) => void
type DragHandlers = {
  move?: DragMoveHandler
  end?: DragEndHandler
}

export function useDrag(
  callback: DragMoveHandler,
  prevent?: boolean
): DragHandlerTuple
export function useDrag(
  handlers: DragHandlers,
  prevent?: boolean
): DragHandlerTuple
export function useDrag(
  handler: DragMoveHandler | DragHandlers,
  prevent = true
): DragHandlerTuple {
  if (typeof handler === 'function') {
    handler = { move: handler }
  }

  const handlers = handler
  const dragging = ref(false)
  const element = dummyElement()

  let start: number
  let firstPos = { x: 0, y: 0 }
  let scrolled = { x: false, y: false }

  function dragMove(event: TouchEvent | MouseEvent, block = prevent) {
    const pos = getClientPos(event)

    firstPos.x ||= pos.x || 0.1
    firstPos.y ||= pos.y || 0.1

    const offsetX = pos.x - firstPos.x
    const offsetY = pos.y - firstPos.y

    scrolled.x ||= Math.abs(offsetX) > 40
    scrolled.y ||= Math.abs(offsetY) > 40

    handlers.move?.(
      {
        ...pos,
        scrolledX: scrolled.x,
        scrolledY: scrolled.y,
        startX: firstPos.x,
        startY: firstPos.y,
        offsetX,
        offsetY
      },
      event
    )

    block && event.preventDefault()
  }

  function dragEnd(event: TouchEvent | MouseEvent) {
    removeEventListener('mousemove', dragMove)
    removeEventListener('mouseup', dragEnd)

    removeEventListener('touchmove', dragMove)
    removeEventListener('touchcancel', dragEnd)
    removeEventListener('touchend', dragEnd)

    element.remove()
    document.body.style.removeProperty('cursor')
    document.body.style.removeProperty('user-select')
    document.body.style.removeProperty('overscroll-behavior')

    let flingX = false
    let flingY = false

    const pos = getClientPos(event)
    const offsetX = pos.x - firstPos.x
    const offsetY = pos.y - firstPos.y

    if (start && Date.now() - start < 300) {
      flingX = Math.abs(offsetX) > 20
      flingY = Math.abs(offsetY) > 20
    }

    handlers.end?.({
      ...pos,
      scrolledX: scrolled.x,
      scrolledY: scrolled.y,
      startX: firstPos.x,
      startY: firstPos.y,
      offsetX,
      offsetY,
      flingX,
      flingY
    })

    firstPos = { x: 0, y: 0 }
    scrolled = { x: false, y: false }
    dragging.value = false
  }

  return [
    dragging,
    (event) => {
      if (dragging.value) return
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      document.body.style.overscrollBehavior = 'none'

      start = Date.now()

      addEventListener('mousemove', dragMove)
      addEventListener('mouseup', dragEnd)

      addEventListener('touchmove', dragMove, { passive: false })
      addEventListener('touchcancel', dragEnd)
      addEventListener('touchend', dragEnd)

      dragging.value = true
      prevent && document.body.append(element)

      dragMove(event, isTouch(event))
    }
  ]
}
