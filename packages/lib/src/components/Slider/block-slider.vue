<script setup lang="ts">
  import type { Component } from 'vue'

  import { clamp, mapNumberToRange } from '@/utils/number/range'
  import { useDrag } from '@/utils/ref/use-drag'
  import { useRect } from '@/utils/ref/use-rect'
  import { computed, ref } from 'vue'

  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface BlockSliderProps {
    value?: number
    defaultValue?: number
    min?: number
    max?: number
    step?: number
    decimal?: number
    icon?: string | Component
  }

  type BlockSliderEmits = {
    (e: 'change', value: number): void
  }

  defineOptions({ name: 'MdBlockSlider' })
  const emit = defineEmits<BlockSliderEmits>()
  const props = withDefaults(defineProps<BlockSliderProps>(), {
    min: 0,
    max: 100,
    step: 1,
    decimal: 0
  })

  let timeout: any

  const model = defineModel<number>()
  const wrapper = ref<HTMLElement>()
  const rect = useRect(wrapper)

  const sliderVal = computed({
    get: () =>
      props.value ??
      model.value ??
      clamp(props.defaultValue ?? props.min, props.min, props.max),
    set(value) {
      value = clamp(value, props.min, props.max)
      model.value = value
      emit('change', value)
    }
  })

  const step = computed(() => props.step ?? 1 / 10 ** props.decimal)
  const [dragging, dragEvent] = useDrag((position) => {
    if (!rect.value) return

    const { width, height, left } = rect.value

    const pos = position.x - left
    const maxOffset = props.max - props.min

    const cursorPos = clamp(pos - height, 0, width)
    const pad = (cursorPos / width) * height

    const offset = clamp(cursorPos + pad, 0, width)
    const value = (offset / width) * maxOffset

    sliderVal.value = Math.round(value / step.value) * step.value
  })

  const position = computed(() => {
    if (!rect.value) return 0
    const newMin = rect.value.height / rect.value.width
    const oldMin = (sliderVal.value - props.min) / (props.max - props.min)
    return mapNumberToRange(oldMin * 100, 0, 100, newMin * 100, 100)
  })

  const keyHandlers: Record<string, (e: KeyboardEvent) => any> = {
    ArrowLeft: () => (sliderVal.value -= step.value),
    ArrowRight: () => (sliderVal.value += step.value)
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
</script>

<template>
  <div
    tabindex="0"
    ref="wrapper"
    class="md-block-slider"
    :class="{ dragging }"
    @mousedown="dragEvent"
    @touchstart="dragEvent"
    @keydown="handleKeydown"
    :style="{ '--pos': position }"
  >
    <div class="md-block-slider-icon" :data-value="sliderVal">
      <HybridIcon :icon="icon" />
    </div>
    <div class="md-block-slider-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
  .md-block-slider {
    --height: var(--component-xl);

    user-select: none;
    position: relative;
    width: 100%;
    display: grid;
    overflow: hidden;
    gap: var(--xs);
    grid-template-columns: var(--height) 1fr;
    min-height: var(--height);
    background: var(--secondary-container);
    border-radius: 999px;
    font-size: var(--font-md);
    font-weight: 500;

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
