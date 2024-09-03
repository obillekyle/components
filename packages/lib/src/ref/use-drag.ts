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

function isTouch(event: Event) {
  return (
    event instanceof TouchEvent ||
    (event as PointerEvent).pointerType === 'touch'
  )
}

export function useDrag(
  callback: (pos: Position, event: TouchEvent | MouseEvent) => void,
  prevent = true
): DragHandlerTuple {
  const dragging = ref(false)
  const element = dummyElement()

  function dragMove(event: TouchEvent | MouseEvent, block?: boolean) {
    ;(block ?? prevent) && event.preventDefault()
    callback(getClientPos(event), event)
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
      const touch = isTouch(event)
      touch || document.body.append(element)

      dragMove(event, touch)
    }
  ]
}
