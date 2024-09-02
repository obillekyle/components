<script setup lang="ts">
  import type { BoxProps } from '../Box/util'

  import { useDrag } from '@/ref/use-drag'
  import { Colors } from '@/utils/colors/class'
  import { addPX } from '@/utils/css/sizes'
  import { evaluate } from '@/utils/function/evaluate'
  import { Icon } from '@iconify/vue'
  import { ref, watch } from 'vue'
  import { useList } from './util'

  import { clamp } from '@/utils/number/range'
  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface ListItemProps extends /* @vue-ignore */ BoxProps {
    index: number
    value: number | string
    label: number | string
  }

  const props = defineProps<ListItemProps>()
  const swipe = ref({
    start: 0,
    end: 0
  })

  const list = useList()

  const wrapper = ref<HTMLElement>()
  const root = ref<HTMLElement>()

  const sort = ref({
    top: 0,
    start: 0,
    end: 0
  })

  const [sorting, sortEvent] = useDrag(({ y }) => {
    if (!root.value) return

    sort.value.start ||= y
    sort.value.top ||= props.index * list.size || 0.1

    const length = list.items.value.length
    const top = sort.value.top - (sort.value.start - y)
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
    sort.value = { top: 0, start: 0, end: 0 }
    root.value.style.top = addPX(props.index * list.size)
  })

  const [swiping, swipeEvent] = useDrag(({ x }, event) => {
    if (sorting.value || !wrapper.value) return
    if (list.swipe === 'off') return

    swipe.value.start ||= x
    swipe.value.end = x

    let offset = x - swipe.value.start

    const registerSwipe = Math.abs(x - swipe.value.start) > 32

    if (!registerSwipe) {
      wrapper.value.style.left = '0px'
      return
    }

    event.preventDefault()

    offset =
      offset > 0 && list.swipe === 'custom' && !list.swipeOptions.left
        ? offset * 0.1
        : offset

    offset =
      offset < 0 && list.swipe === 'custom' && !list.swipeOptions.right
        ? offset * 0.1
        : offset

    wrapper.value.style.left = addPX(offset)
  }, false)

  function swipeHandler(e: any) {
    if (list.swipe === 'off') return
    swipeEvent(e)
  }

  watch(swiping, (swiping) => {
    if (swiping || !wrapper.value) return
    const value = swipe.value.end - swipe.value.start
    swipe.value = { start: 0, end: 0 }

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

  const isSwipingLeft = ref(false)
  watch(
    () => swipe.value.end,
    (value) => {
      if (!value) return
      isSwipingLeft.value = swipe.value.end > swipe.value.start
    }
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
