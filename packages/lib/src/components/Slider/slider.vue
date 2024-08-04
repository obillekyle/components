<script setup lang="ts">
  import { getClientPos } from '@/utils/dom'
  import {
    clamp,
    findNearestNumber,
    mapNumberToRange
  } from '@/utils/number'
  import { evaluate } from '@/utils/object'
  import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

  interface SliderProperties {
    value?: number
    defaultValue?: number
    values?: number[] | { label: string; value: number }[]
    min?: number
    max?: number
    step?: number
    decimal?: number
    onChange?: (value: number) => void
    showValue?: boolean
    showLabel?: boolean
  }

  const props = withDefaults(defineProps<SliderProperties>(), {
    min: 0,
    max: 100,
    decimal: 0
  })

  const dragging = ref(false)
  const wrapper = ref<HTMLElement>()
  const model = defineModel<number>()
  const useMD3 = inject('md3', false)

  // TODO: Organize this mess

  const values = computed(() => {
    if (props.values) {
      return props.values
        .map((v) => (typeof v === 'object' ? v.value : v))
        .sort((a, b) => a - b)
    }

    return []
  })

  const minVal = computed(() =>
    values.value.length > 0 ? Math.min(...values.value) : props.min
  )

  const maxVal = computed(() =>
    values.value.length > 0 ? Math.max(...values.value) : props.max
  )

  const sliderVal = computed({
    get: () =>
      props.value ??
      model.value ??
      Math.max(props.defaultValue ?? minVal.value, minVal.value),
    set: (value) => {
      model.value = value
      evaluate(props.onChange, value)
    }
  })

  function dragDown(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    dragging.value = true
    dragMove(e)
  }

  function getLabel(value: number) {
    if (props.values) {
      const item = props.values.find((v) => {
        return typeof v === 'object' && v.value === value
      })
      return typeof item === 'number' ? item : item?.label || value
    }

    return value
  }

  function dragMove(e: MouseEvent | TouchEvent) {
    const element = wrapper.value!

    if (!element) return
    if (!dragging.value) return
    const rect = element.getBoundingClientRect()

    e.preventDefault()

    const clientX = getClientPos(e).x
    const offset = clamp(clientX - rect.left, 0, rect.width)

    const maxOffset = maxVal.value - minVal.value

    if (props.values) {
      const min = minVal.value
      const max = maxVal.value
      const value = Math.round((offset / rect.width) * (max - min) + min)
      sliderVal.value = findNearestNumber(value, values.value)!
      return
    }

    if (props.step) {
      const value = (offset / rect.width) * maxOffset
      const rounded = Math.round(value / props.step) * props.step
      sliderVal.value = Math.max(rounded, minVal.value)
      return
    }

    const value = (offset / rect.width) * maxOffset
    const rounded =
      Math.round(value * 10 ** props.decimal) / 10 ** props.decimal
    sliderVal.value = Math.max(rounded + minVal.value, minVal.value)
  }

  function dragUp() {
    dragging.value = false
  }

  function getPosition(value: number) {
    const number_ =
      ((value - minVal.value) / (maxVal.value - minVal.value)) * 100

    return useMD3
      ? mapNumberToRange(number_, 0, 100, 2.4, 97.6)
      : mapNumberToRange(number_, 0, 100, 0.8, 99.2)
  }

  const thumbPos = computed(() => getPosition(sliderVal.value ?? 0))

  function handleKeydown(e: KeyboardEvent) {
    const step = props.step ?? 1 / 10 ** props.decimal
    if (e.key === 'ArrowLeft') {
      if (props.values) {
        const index = values.value.indexOf(sliderVal.value!)
        const nextIndex = Math.max(index - 1, 0)
        sliderVal.value = values.value[nextIndex]
        return
      }

      const value = sliderVal.value - step
      sliderVal.value = Math.max(value, minVal.value)
    } else if (e.key === 'ArrowRight') {
      if (props.values) {
        const index = values.value.indexOf(sliderVal.value!)
        const nextIndex = Math.min(index + 1, values.value.length - 1)
        sliderVal.value = values.value[nextIndex]
        return
      }

      const value = sliderVal.value + step
      sliderVal.value = Math.min(value, maxVal.value)
    }
  }

  defineOptions({ name: 'MdSlider' })

  onMounted(() => {
    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragUp)

    document.addEventListener('touchmove', dragMove)
    document.addEventListener('touchend', dragUp)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', dragMove)
    document.removeEventListener('mouseup', dragUp)

    document.removeEventListener('touchmove', dragMove)
    document.removeEventListener('touchend', dragUp)
  })
</script>

<template>
  <div
    tabindex="0"
    class="md-slider"
    :class="{ md3: useMD3 }"
    @keydown="handleKeydown"
    @mousedown="dragDown"
    @dblclick="dragMove"
  >
    <div class="md-slider-value" v-if="props.showValue">
      {{ sliderVal }}
    </div>
    <div
      ref="wrapper"
      class="md-slider-wrapper"
      :style="{ '--thumb-offset': thumbPos }"
    >
      <div
        class="md-slider-thumb"
        :data-value="getLabel(model!)"
        :dragging
        @touchstart="dragDown"
      />
      <input type="range" :min="minVal" :max="maxVal" v-model="sliderVal" />
      <div class="md-slider-track" />
      <div class="md-slider-labels" v-if="props.values">
        <template v-if="props.showLabel">
          <div
            :key="value"
            class="md-slider-label"
            v-for="value in values"
            :style="{ '--offset': getPosition(value) }"
          >
            {{ getLabel(value) }}
          </div>
        </template>
      </div>
      <div class="md-slider-indicators" v-if="props.values">
        <div
          class="md-slider-indicator"
          :key="value"
          v-for="value in values"
          :class="{ covered: value <= (model || 0) }"
          :style="{ '--offset': getPosition(value) }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .md-slider {
    --thumb-width: var(--lg);
    --thumb-height: var(--lg);
    --track-height: var(--xs);

    display: grid;
    user-select: none;
    align-items: center;
    height: calc(var(--thumb-height) * 2);
    min-width: calc(var(--thumb-height) * 2);
    width: 100%;

    input {
      display: none;
    }

    &:has(.md-slider-value) {
      grid-template-columns: auto 1fr;
    }

    &-value {
      margin-right: var(--sm);
      border-radius: var(--xs);
      padding: var(--xs) var(--sm);
      min-width: 6ch;
      text-align: center;
      background: var(--secondary-container);
      color: var(--secondary);
    }

    &-wrapper {
      position: relative;
      display: flex;
      height: 100%;
      align-items: center;
    }

    &-track {
      position: absolute;
      align-self: center;
      left: 0;
      overflow: hidden;
      right: 0;
      height: var(--track-height);
      background: var(--primary-container);
      border-radius: 999px;

      &::before {
        left: 0;
        position: absolute;
        content: '';
        height: 100%;
        right: calc((var(--thumb-offset) - 100) * -1%);
        background: var(--primary);
      }
    }

    &-thumb {
      z-index: 1;
      position: absolute;
      left: calc(var(--thumb-offset) * 1%);
      width: var(--thumb-width);
      height: var(--thumb-height);
      border-radius: 999px;
      align-self: center;
      transform: translateX(-50%);
      background: var(--primary);

      &::after {
        content: attr(data-value);
        position: absolute;
        top: 0;
        left: 50%;
        padding: var(--xs) var(--sm);
        transform: translate(-50%, -100%);
        font-size: var(--font-sm);
        color: var(--inverse-on-surface);
        background: var(--inverse-surface);
        border-radius: 99px;
        transition: all 0.2s;
        box-shadow: 0 2px 5px #0005;
        opacity: 0;
      }

      &[dragging='true'] {
        background: var(--primary);

        &::after {
          transform: translate(-50%, -125%);
          opacity: 1;
        }
      }
    }

    &-indicators {
      position: absolute;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      align-items: center;
      height: calc(var(--xs) * 2);
      border-radius: 999px;

      .md-slider-indicator {
        left: calc(var(--offset) * 1%);
        transform: translateX(-50%);
        position: absolute;
        width: var(--xxs);
        height: var(--xxs);
        border-radius: 999px;
        background: var(--primary);

        &.covered {
          background: var(--on-primary);
        }
      }
    }

    &-labels {
      position: absolute;
      align-self: center;
      width: 100%;
      height: var(--xs);
      margin-inline: auto;
      pointer-events: none;

      .md-slider-label {
        position: absolute;
        left: calc(var(--offset) * 1%);
        transform: translateX(-50%);
        font-size: var(--font-xxs);
        color: var(--mono-50);
        padding-top: var(--md);
        width: max-content;
        text-align: center;
      }
    }

    &.md3 {
      --thumb-width: var(--xxs);
      --thumb-height: var(--component-md);
      --track-height: var(--md);

      height: var(--thumb-height);

      .md-slider-indicators {
        > :last-child {
          scale: 1.5;
          transform-origin: left;
        }

        .md-slider-indicator {
          background: var(--primary);

          &.covered {
            background: var(--on-primary);
          }
        }
      }

      .md-slider-track {
        background: none;

        &::before {
          width: calc(
            (var(--thumb-offset) * 1%) - (var(--thumb-width) * 2)
          );
          border-radius: 2px;
        }

        &::after {
          content: '';
          right: 0;
          background: var(--primary-container);
          height: 100%;
          position: absolute;
          left: calc(
            ((var(--thumb-offset) * 1%) + (var(--thumb-width) * 2))
          );
          border-radius: 2px;
        }
      }
    }
  }
</style>
