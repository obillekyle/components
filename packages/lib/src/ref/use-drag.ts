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

type Scrolled = {
  scrolledX: boolean
  scrolledY: boolean
}

export function useDrag(
  callback: (
    pos: Position & Scrolled,
    event: TouchEvent | MouseEvent
  ) => void,
  prevent = true
): DragHandlerTuple {
  const dragging = ref(false)
  const element = dummyElement()
  let firstPos = { x: 0, y: 0 }
  let scrolled = { x: false, y: false }

  function dragMove(event: TouchEvent | MouseEvent, block = prevent) {
    const pos = getClientPos(event)

    firstPos.x ||= pos.x || 0.1
    firstPos.y ||= pos.y || 0.1

    scrolled.x ||= Math.abs(pos.x - firstPos.x!) > 40
    scrolled.y ||= Math.abs(pos.y - firstPos.y!) > 40

    callback(
      {
        ...pos,
        scrolledX: scrolled.x,
        scrolledY: scrolled.y
      },
      event
    )

    block && event.preventDefault()
  }

  function dragEnd() {
    removeEventListener('mousemove', dragMove)
    removeEventListener('mouseup', dragEnd)

    removeEventListener('touchmove', dragMove)
    removeEventListener('touchcancel', dragEnd)
    removeEventListener('touchend', dragEnd)

    element.remove()
    document.body.style.removeProperty('cursor')
    document.body.style.removeProperty('user-select')
    document.body.style.removeProperty('overscroll-behavior')

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
