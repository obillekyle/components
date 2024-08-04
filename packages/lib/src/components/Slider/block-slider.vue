<script setup lang="ts">
  import type { Component, HTMLAttributes } from 'vue'

  import { getClientPos } from '@/utils/dom'
  import { clamp, mapNumberToRange } from '@/utils/number'
  import { evaluate } from '@/utils/object'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
  import IconOrComponent from '../Misc/icon-or-component.vue'

  interface MasterSliderProperties
    extends /* @vue-ignore */ Omit<HTMLAttributes, 'onChange'> {
    value?: number
    defaultValue?: number
    min?: number
    max?: number
    step?: number
    decimal?: number
    icon?: string | Component
    onChange?: (value: number) => void
  }

  defineOptions({ name: 'MdBlockSlider' })
  const props = withDefaults(defineProps<MasterSliderProperties>(), {
    min: 0,
    max: 100,
    step: 1,
    decimal: 0
  })

  let timeout: any
  let observer: ResizeObserver
  const dragging = ref(false)
  const model = defineModel<number>()
  const wrapper = ref<HTMLElement>()
  const rect = ref({ width: 0, height: 0 })

  const sliderVal = computed({
    get: () =>
      props.value ??
      model.value ??
      props.defaultValue ??
      props.min ??
      props.max / 2,
    set(value) {
      model.value = clamp(value, props.min, props.max)
      evaluate(props.onChange, model.value)
    }
  })

  const steps = computed(() => props.step ?? 1 / 10 ** props.decimal)
  const position = computed(() => {
    const newMin = rect.value.height / rect.value.width
    const oldMin = (sliderVal.value - props.min) / (props.max - props.min)
    return mapNumberToRange(oldMin * 100, 0, 100, newMin * 100, 100)
  })

  function dragDown(e: MouseEvent | TouchEvent) {
    timeout && clearTimeout(timeout)
    dragging.value = true
    dragMove(e)
  }

  function dragMove(e: MouseEvent | TouchEvent) {
    if (!dragging.value) return
    if (!wrapper.value) return

    const element = wrapper.value
    const rect = element.getBoundingClientRect()

    e.preventDefault()

    const clientX = getClientPos(e).x
    const pos = clientX - rect.left

    const cursorPos = clamp(pos - rect.height, 0, rect.width)
    const pad = (cursorPos / rect.width) * rect.height

    const offset = clamp(cursorPos + pad, 0, rect.width)
    const value = (offset / rect.width) * (props.max - props.min)

    model.value = props.step
      ? Math.round(value / props.step) * props.step
      : Math.round(value * 10 ** props.decimal) / 10 ** props.decimal
  }

  function dragUp() {
    dragging.value = false
  }

  const keyHandlers: Record<string, (e: KeyboardEvent) => any> = {
    ArrowLeft: () => (sliderVal.value -= steps.value),
    ArrowRight: () => (sliderVal.value += steps.value)
  }

  function handleKeydown(e: KeyboardEvent) {
    const root = e.currentTarget as HTMLElement
    if (e.key in keyHandlers) {
      e.preventDefault()
      keyHandlers[e.key](e)

      root.classList.add('dragging')
      timeout && clearTimeout(timeout)
      timeout = setTimeout(() => root.classList.remove('dragging'), 500)
    }
  }

  onMounted(() => {
    observer = new ResizeObserver(([entry]) => {
      rect.value = entry.contentRect
    })

    observer.observe(wrapper.value!)
    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragUp)
    document.addEventListener('touchmove', dragMove)
    document.addEventListener('touchend', dragUp)
  })

  onBeforeUnmount(() => {
    observer.disconnect()
    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('mouseup', dragUp)
    document.removeEventListener('touchmove', dragMove)
    document.removeEventListener('touchend', dragUp)
  })
</script>

<template>
  <div
    tabindex="0"
    ref="wrapper"
    class="md-block-slider"
    :class="{ dragging }"
    @mousedown="dragDown"
    @touchstart="dragDown"
    @keydown="handleKeydown"
    :style="{ '--pos': position }"
  >
    <div class="md-block-slider-icon" :data-value="sliderVal">
      <IconOrComponent :icon="props.icon" />
    </div>
    <div class="md-block-slider-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
  .md-block-slider {
    --height: var(--component-xxl);

    user-select: none;
    position: relative;
    width: 100%;
    display: grid;
    overflow: hidden;
    gap: var(--xs);
    grid-template-columns: var(--height) 1fr;
    min-height: var(--height);
    background: var(--secondary-container);
    border-radius: calc(var(--height) / 2.25);
    font-size: var(--font-lg);

    &-icon {
      width: var(--height);
      height: var(--height);
      display: grid;
      place-items: center;
      z-index: 1;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      background-color: var(--inverse-primary);
    }

    &::before {
      inset: 0;
      width: calc((var(--pos) * 1%));
      min-width: var(--height);
      height: 100%;
      border-radius: inherit;
      transition: border-radius 0.2s;
    }

    &::after {
      top: 50%;
      right: calc(var(--height) / 4);
      width: calc(var(--height) * 0.1);
      aspect-ratio: 1;
      transform: translateY(-50%);
      border-radius: inherit;
    }

    &.dragging {
      &::before {
        border-top-right-radius: var(--xxs);
        border-bottom-right-radius: var(--xxs);
      }

      .md-block-slider-icon {
        > * {
          display: none;
        }

        &::before {
          display: block !important;
          content: attr(data-value);
        }
      }
    }

    &-content {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
    }
  }
</style>
