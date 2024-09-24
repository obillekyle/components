<script setup lang="ts">
  import type { BoxProps } from '../Box/util'

  import { useDrag } from '@/ref/use-drag'
  import { Colors } from '@/utils/colors/class'
  import { addPX } from '@/utils/css/sizes'
  import { evaluate } from '@/utils/function/evaluate'
  import { clamp } from '@/utils/number/range'
  import { Icon } from '@iconify/vue'
  import { reactive, ref, watch } from 'vue'
  import { useList } from './util'

  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface ListItemProps extends /* @vue-ignore */ BoxProps {
    index: number
    value: number | string
    label: number | string
  }

  const root = ref<HTMLElement>()
  const wrapper = ref<HTMLElement>()
  const props = defineProps<ListItemProps>()
  const swipe = reactive({
    start: 0,
    end: 0
  })

  const list = useList()

  const sort = reactive({
    top: 0,
    start: 0,
    end: 0
  })

  const [sorting, sortEvent] = useDrag(({ y }) => {
    if (!root.value) return

    sort.start ||= y
    sort.top ||= props.index * list.size || 0.1

    const length = list.items.value.length
    const top = sort.top - (sort.start - y)
    const newIndex = clamp(Math.round(top / list.size), 0, length - 1)

    root.value.style.top = addPX(top)

    if (props.index !== newIndex) {
      const element = list.items.value[props.index]
      const newArray = [...list.items.value]

      newArray.splice(props.index, 1)
      newArray.splice(newIndex, 0, element)

      list.items.value = newArray

      list.emit('reorder', {
        from: props.index,
        to: newIndex,
        item: element,
        value: newArray
      })
    }
  })

  watch(sorting, (sorting) => {
    if (sorting || !root.value) return
    Object.assign(sort, { top: 0, start: 0, end: 0 })
    root.value.style.top = addPX(props.index * list.size)
  })

  const isSwipingLeft = ref(false)
  function noSwipe(position: 'left' | 'right', offset: number) {
    return position === 'left'
      ? offset > 0 && list.swipe === 'custom' && !list.swipeOptions.left
      : offset < 0 && list.swipe === 'custom' && !list.swipeOptions.right
  }

  const [swiping, swipeEvent] = useDrag(({ x, scrolledY }) => {
    if (sorting.value || !wrapper.value) return
    if (list.swipe === 'off') return

    swipe.start ||= x
    swipe.end = x

    let offset = x - swipe.start

    const registerSwipe = Math.abs(swipe.start - x) > 32

    if (!registerSwipe || scrolledY) {
      swipe.end = swipe.start
      wrapper.value.style.left = '0px'
      return
    }

    offset *= noSwipe('left', offset) ? 0.1 : 1
    offset *= noSwipe('right', offset) ? 0.1 : 1

    wrapper.value.style.left = addPX(offset)
  }, false)

  const swipeHandler = (e: any) => list.swipe !== 'off' && swipeEvent(e)

  watch(swiping, (swiping) => {
    if (swiping || !wrapper.value) return
    const value = swipe.end - swipe.start
    Object.assign(swipe, { start: 0, end: 0 })

    if (value > list.swipeDistance || value < -list.swipeDistance) {
      switch (list.swipe) {
        case 'dismiss': {
          dismiss(value)
          return
        }
        case 'custom': {
          value > 0
            ? evaluate(list.swipeOptions.left?.handler, props.index)
            : evaluate(list.swipeOptions.right?.handler, props.index)
        }
      }
    }

    wrapper.value.style.removeProperty('left')
  })

  function dismiss(value: number) {
    const element = wrapper.value!
    element.style.left = value >= 0 ? '100%' : '-100%'

    element.addEventListener(
      'transitionend',
      function () {
        list.items.value = list.items.value.filter(
          (_, index) => index !== props.index
        )

        list.emit('dismiss', {
          index: props.index,
          value: list.items.value,
          item: {
            value: props.value,
            label: props.label
          }
        })

        setTimeout(() => {
          this.style.removeProperty('left')
        }, 300)
      },
      { once: true }
    )
  }

  watch(
    () => swipe.end,
    (value) => value && (isSwipingLeft.value = swipe.end > swipe.start)
  )
</script>

<template>
  <div
    ref="root"
    class="md-list-item"
    :class="{ sorting, swiping }"
    @pointerdown="swipeHandler"
    :style="{ top: addPX(index * list.size), height: addPX(list.size) }"
  >
    <div class="md-list-item-wrapper" ref="wrapper" :data-index="index">
      <component :value :is="list.component" class="md-list-item-content">
        {{ label }}
      </component>
      <div v-if="list.sortable" class="draggable" @pointerdown="sortEvent">
        <Icon icon="material-symbols:drag-handle" :width="24" />
      </div>
    </div>
    <div class="md-list-swipe-indicator" v-if="list.swipe === 'custom'">
      <template :key="key" v-for="(item, key) in list.swipeOptions">
        <HybridIcon
          v-if="item"
          v-show="(key === 'left') === isSwipingLeft"
          :class="key"
          :style="{
            background: item.color,
            color: Colors.isLight(item.color) ? '#000' : '#fff'
          }"
          :icon="item.icon"
        />
      </template>
    </div>
  </div>
</template>
