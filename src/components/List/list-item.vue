<script setup lang="ts">
  import type { ListProps } from './types'

  import { inject, onBeforeUnmount, onMounted, ref } from 'vue'
  import { addPX, evaluate, getClientPos } from '@/utils'
  import { Icon } from '@iconify/vue'

  const props = defineProps<{
    index: number
    props: any
  }>()

  const parentProps = inject<ListProps>('parentProps')!
  const swipeEvent = ref<MouseEvent | TouchEvent | null>(null)
  const arrangeEvent = ref<MouseEvent | TouchEvent | null>(null)
  const content = ref<HTMLElement | null>(null)
  const wrapper = ref<HTMLElement | null>(null)
  const value = ref(0)
  const lastTop = ref(0)

  function swipeDown(e: MouseEvent | TouchEvent) {
    const target = e.target as HTMLElement
    if (!content.value) return
    if (target.matches('.draggable')) return
    if (parentProps.swipe === 'off') return
    content.value.style.transition = 'none'
    swipeEvent.value = e
  }

  function swipeMove(e: MouseEvent | TouchEvent) {
    const oldEvent: MouseEvent | TouchEvent | null = swipeEvent.value
    if (!oldEvent) return

    const element = content.value!
    let offset = 0

    const clientX = getClientPos(e).x
    const oldX = getClientPos(oldEvent).x

    offset = clientX - oldX

    const registerSwipe = Math.abs(offset) > 32

    if (registerSwipe) {
      e.preventDefault()
    }

    offset =
      offset > 0 &&
      parentProps.swipe === 'custom' &&
      !parentProps.swipeOptions?.left
        ? offset * 0.1
        : offset

    offset =
      offset < 0 &&
      parentProps.swipe === 'custom' &&
      !parentProps.swipeOptions?.right
        ? offset * 0.1
        : offset

    document.body.style.cursor = 'grabbing'
    element.style.left = addPX(registerSwipe ? offset : 0)
    value.value = offset
  }

  function dismiss() {
    const element = content.value!
    element.style.removeProperty('transition')
    element.style.left = value.value > 0 ? '100%' : '-100%'

    setTimeout(() => {
      evaluate(parentProps.onDismiss, props.index)
    }, 200)
  }

  function swipeUp(e: MouseEvent | TouchEvent) {
    if (!swipeEvent.value) return
    e.preventDefault()

    swipeEvent.value = null
    document.body.style.removeProperty('cursor')
    const distance = parentProps.swipeDistance ?? 200
    const element = content.value!

    if (Math.abs(value.value) >= distance) {
      switch (parentProps.swipe) {
        case 'dismiss': {
          dismiss()
          return
        }
        case 'custom': {
          value.value > 0
            ? evaluate(parentProps.swipeOptions?.left?.handler, props.index)
            : evaluate(parentProps.swipeOptions?.right?.handler, props.index)
        }
      }
    }
    element.style.removeProperty('transition')
    element.style.left = '0px'
  }

  function dragUp(e: MouseEvent | TouchEvent) {
    if (!arrangeEvent.value) return

    e.preventDefault()
    const element = wrapper.value!
    arrangeEvent.value = null
    element.classList.remove('dragged')
    element.style.top = addPX(props.index * 60)
    document.body.style.removeProperty('cursor')
    lastTop.value = props.index * 56
  }

  function dragMove(e: MouseEvent | TouchEvent) {
    const oldEvent: MouseEvent | TouchEvent | null = arrangeEvent.value
    if (!oldEvent) return
    e.preventDefault()

    const clientY = getClientPos(e).y
    const oldY = getClientPos(oldEvent).y

    const element = wrapper.value!
    const offset = clientY - oldY

    const y = lastTop.value + offset + 2
    const index = Math.floor(y / 56)

    if (index !== props.index) {
      evaluate(parentProps.onReorder, props.index, index)
    }

    document.body.style.cursor = 'grabbing'
    element.style.top = addPX(y)
  }

  function dragDown(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    if (!wrapper.value) return
    if (arrangeEvent.value) return
    if (!parentProps.sortable) return
    wrapper.value.classList.add('dragged')
    arrangeEvent.value = e
  }

  onMounted(() => {
    document.addEventListener('mousemove', swipeMove)
    document.addEventListener('mouseup', swipeUp)
    document.addEventListener('mouseleave', swipeUp)

    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragUp)
    document.addEventListener('mouseleave', dragUp)

    document.addEventListener('touchmove', swipeMove)
    document.addEventListener('touchend', swipeUp)

    document.addEventListener('touchmove', dragMove)
    document.addEventListener('touchend', dragUp)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', swipeMove)
    document.removeEventListener('mouseup', swipeUp)
    document.removeEventListener('mouseleave', swipeUp)

    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('mouseup', dragUp)
    document.removeEventListener('mouseleave', dragUp)

    document.removeEventListener('touchmove', swipeMove)
    document.removeEventListener('touchend', swipeUp)

    document.addEventListener('touchmove', dragMove)
    document.addEventListener('touchend', dragUp)
    document.body.style.removeProperty('cursor')
  })
</script>

<template>
  <div
    ref="wrapper"
    class="list-item"
    @mousedown="swipeDown"
    @touchstart="swipeDown"
    :style="{ top: addPX(index * 60) }"
  >
    <div class="list-content" ref="content" :data-index="props.index">
      <component :is="parentProps.listComp" v-bind="props.props" />
      <div
        class="draggable"
        @mousedown="dragDown"
        @touchmove="dragDown"
        v-if="parentProps.sortable"
      >
        <Icon icon="material-symbols:drag-handle" :width="24" />
      </div>
    </div>
    <div class="swipe-indicator" v-if="parentProps.swipe === 'custom'">
      <template :key="k" v-for="(i, k) in parentProps.swipeOptions">
        <div
          :class="k"
          v-if="typeof i == 'object'"
          :style="{ background: i.color }"
          v-show="k == 'left' ? value > 0 : value < 0"
        >
          <Icon v-if="typeof i.icon == 'string'" :icon="i.icon" :width="24" />
          <component v-else :is="i.icon" />
        </div>
      </template>
    </div>
  </div>
</template>
