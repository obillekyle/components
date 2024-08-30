import { ref, type Ref } from 'vue'
import { getClientPos, type Position } from '../dom/events'

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

export function useDrag(
  callback: (pos: Position) => void
): DragHandlerTuple {
  const dragging = ref(false)
  const element = dummyElement()

  function dragMove(event: TouchEvent | MouseEvent, block = true) {
    if (dragging.value) {
      block && event.preventDefault()
      callback(getClientPos(event))
    }
  }

  function dragEnd() {
    removeEventListener('mousemove', dragMove)
    removeEventListener('mouseup', dragEnd)

    removeEventListener('touchmove', dragMove)
    removeEventListener('touchcancel', dragEnd)
    removeEventListener('touchend', dragEnd)

    element.remove()
    document.body.style.removeProperty('cursor')
    document.body.style.removeProperty('overscroll-behavior')
    dragging.value = false
  }

  return [
    dragging,
    (event) => {
      if (dragging.value) return
      document.body.append(element)
      document.body.style.cursor = 'grabbing'
      document.body.style.overscrollBehavior = 'none'

      addEventListener('mousemove', dragMove)
      addEventListener('mouseup', dragEnd)

      addEventListener('touchmove', dragMove, { passive: false })
      addEventListener('touchcancel', dragEnd)
      addEventListener('touchend', dragEnd)

      dragging.value = true

      event && dragMove(event, event instanceof TouchEvent)
    }
  ]
}
