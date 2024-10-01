<script setup lang="ts">
  import type { BoxProps } from '../Box/util'

  import { useDrag } from '@/ref/use-drag'
  import { Colors } from '@/utils/colors/class'
  import { addPX } from '@/utils/css/sizes'
  import { evaluate } from '@/utils/function/evaluate'
  import { clamp } from '@/utils/number/range'
  import { Icon } from '@iconify/vue'
  import { ref } from 'vue'
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

  const list = useList()

  let sortTop: number | undefined

  const [sorting, sortEvent] = useDrag({
    move: ({ offsetY }) => {
      if (!root.value) return

      sortTop ||= props.index * list.size || 0.1

      const length = list.items.value.length
      const top = sortTop + offsetY
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
    },
    end: () => {
      if (!root.value) return
      root.value.style.top = addPX(props.index * list.size)
      sortTop = undefined
    }
  })

  const isSwipingLeft = ref(false)

  const swiped = (value = 0) => Math.abs(value) > 32
  const noSwipe = (position: 'left' | 'right', offset = 0) =>
    list.swipe === 'custom' &&
    list.swipeOptions[position] === undefined &&
    (position === 'left' ? offset > 0 : offset < 0)

  const [swiping, swipeEvent] = useDrag(
    {
      move: ({ scrolledY, offsetX }) => {
        if (list.swipe === 'off') return
        if (sorting.value || !wrapper.value) return
        if (offsetX !== 0) isSwipingLeft.value = offsetX > 0

        if (!swiped(offsetX) || scrolledY) {
          wrapper.value.style.left = '0px'
          return
        }

        offsetX *= noSwipe('left', offsetX) ? 0.1 : 1
        offsetX *= noSwipe('right', offsetX) ? 0.1 : 1

        wrapper.value.style.left = addPX(offsetX)
      },
      end: ({ offsetX, scrolledY, flingX }) => {
        if (!wrapper.value) return
        if (!swiped(offsetX) || scrolledY) return

        if (Math.abs(offsetX) > list.swipeDistance || flingX) {
          switch (list.swipe) {
            case 'dismiss': {
              dismiss(offsetX)
              return
            }
            case 'custom': {
              offsetX > 0
                ? evaluate(list.swipeOptions.left?.handler, props.index)
                : evaluate(list.swipeOptions.right?.handler, props.index)
            }
          }
        }

        wrapper.value.style.removeProperty('left')
      }
    },
    false
  )

  const swipeHandler = (e: any) => list.swipe !== 'off' && swipeEvent(e)

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
