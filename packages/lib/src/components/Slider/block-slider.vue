<script setup lang="ts">
  import type { Component } from 'vue'

  import { useDrag } from '@/ref/use-drag'
  import { useValue } from '@/ref/use-form-value'
  import { useRect } from '@/ref/use-rect'
  import { clamp, mapNumberToRange } from '@/utils/number/range'
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
  const model = defineModel<number>()
  const emits = defineEmits<BlockSliderEmits>()
  const props = defineProps<BlockSliderProps>()

  let timeout: any

  const root = ref<HTMLElement>()
  const rect = useRect(root)

  const option = computed(() => {
    let { min, max, step, decimal } = props
    min ??= 0
    max ??= 100

    return {
      min,
      max,
      offset: max - min,
      step: step ?? 1 / 10 ** (decimal || 0),
      decimal: decimal ?? String(step).split('.')[1]?.length ?? 0
    }
  })

  const sliderVal = useValue(option.value.min, props, model, (value) => {
    value = clamp(value, option.value.min, option.value.max)
    emits('change', value)
    return value
  })

  const [dragging, dragEvent] = useDrag((position) => {
    if (!rect.ready) return

    const { min, max, step } = option.value
    const { width, height, left } = rect
    const maxOffset = max - min
    const boxWidth = width - height

    const client = position.x - left
    const cursor = clamp(client - height, 0, width)
    const offset = clamp(cursor, 0, width)

    const value = (offset / boxWidth) * maxOffset

    sliderVal.value = Math.round(value / step) * step
  })

  const position = computed(() => {
    if (!rect.ready) return 0

    const { min, max } = option.value

    const newMin = rect.height / rect.width
    const oldMin = (sliderVal.value - min) / (max - min)
    return mapNumberToRange(oldMin * 100, 0, 100, newMin * 100, 100)
  })

  const keyHandlers: Record<string, (e: KeyboardEvent) => any> = {
    ArrowLeft: () => (sliderVal.value -= option.value.step),
    ArrowRight: () => (sliderVal.value += option.value.step)
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
    ref="root"
    class="md-block-slider"
    :class="{ dragging }"
    @mousedown="dragEvent"
    @touchstart="dragEvent"
    @keydown="handleKeydown"
    :style="{ '--pos': position }"
  >
    <HybridIcon
      :icon
      :data-value="sliderVal"
      class="md-block-slider-icon"
    />
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
      aspect-ratio: 1;
      right: calc(var(--height) / 4);
      width: calc(var(--height) * 0.1);
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
