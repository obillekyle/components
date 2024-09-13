<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'

  import { useDrag } from '@/ref/use-drag'
  import { useValue } from '@/ref/use-form-value'
  import { useRect } from '@/ref/use-rect'
  import { getCSSValue } from '@/utils/css/sizes'
  import { toDecimalFixed } from '@/utils/number/format'
  import {
    clamp,
    findNearestNumber,
    offsetRange
  } from '@/utils/number/range'
  import { is } from '@/utils/object/is'
  import { computed, ref } from 'vue'

  interface SliderProperties {
    value?: number
    name?: string
    size?: SizesString
    defaultValue?: number
    values?: number[] | { label: string; value: number }[]
    min?: number
    max?: number
    step?: number
    decimal?: number
    showValue?: boolean
    showLabel?: boolean
  }

  type SliderEmits = {
    (e: 'change', value: number): void
  }

  const emit = defineEmits<SliderEmits>()
  const props = withDefaults(defineProps<SliderProperties>(), {
    min: 0,
    max: 100
  })

  const wrapper = ref<HTMLElement>()
  const model = defineModel<number>()
  const rect = useRect(wrapper)

  const values = computed(() => {
    if (!props.values) return { raw: [], formatted: [] }

    const formatted = [...props.values]
      .map((v) => (is(v, 'object') ? v : { label: String(v), value: v }))
      .sort((a, b) => a.value - b.value)

    return {
      formatted,
      raw: formatted.map((v) => v.value)
    }
  })

  const limit = computed(() => {
    const { raw } = values.value
    const { min, max, step, decimal } = props
    const hasValues = raw.length > 0

    return {
      min: hasValues ? Math.min(...raw) : min,
      max: hasValues ? Math.max(...raw) : max,
      step: step ?? 1 / 10 ** (decimal || 0),
      decimal: decimal ?? String(step ?? 1).split('.')[1]?.length
    }
  })

  const sliderVal = useValue(limit.value.min, props, model, (value) => {
    const { min, max, decimal } = limit.value
    value = toDecimalFixed(clamp(value, min, max), decimal)
    emit('change', value)
    return value
  })

  function getLabel(value: number) {
    return props.values
      ? values.value.formatted.find((v) => v.value === value)?.label
      : toDecimalFixed(value, limit.value.decimal)
  }

  const [dragging, dragEvent] = useDrag(({ x }) => {
    if (!rect.ready) return

    const { min, max, step } = limit.value

    const offset = rect.height / 2
    const length = rect.width
    const clientX = x - rect.left
    const pos = offsetRange(length, clientX, -offset)

    const maxOffset = max - min
    const percent = pos / length
    const value = clamp(percent * maxOffset + min, min, max)

    if (props.values) {
      sliderVal.value = findNearestNumber(value, values.value.raw)
      return
    }

    sliderVal.value = Math.round(value / step) * step
  })

  function getPosition(value: number) {
    if (!rect.ready) return 0

    const { min, max } = limit.value
    const { width, height } = rect

    const percent = (value - min) / (max - min)
    return offsetRange(width, percent * width, height / 2)
  }

  const thumbPos = computed(() => getPosition(sliderVal.value))

  function handleKeydown(e: KeyboardEvent) {
    const { step } = limit.value

    const vals = values.value.raw
    const value = sliderVal.value

    if (e.key === 'ArrowLeft') {
      if (props.values) {
        const index = vals.indexOf(value)
        const prevIndex = Math.max(index - 1, 0)
        sliderVal.value = vals[prevIndex]
        return
      }

      sliderVal.value -= step
      return
    }

    if (e.key === 'ArrowRight') {
      if (props.values) {
        const index = vals.indexOf(value)
        const nextIndex = Math.min(index + 1, vals.length - 1)
        sliderVal.value = vals[nextIndex]
        return
      }

      sliderVal.value += step
    }
  }

  defineOptions({ name: 'MdSlider' })
</script>

<template>
  <div
    tabindex="0"
    class="md-slider"
    @keydown="handleKeydown"
    @mousedown="dragEvent"
    @dblclick="dragEvent"
    :style="{
      '--thumb-offset': thumbPos,
      '--thumb-height': getCSSValue(size || '#component-md')
    }"
  >
    <div class="md-slider-value" v-if="showValue">
      {{ sliderVal }}
    </div>
    <div class="md-slider-wrapper">
      <div
        class="md-slider-thumb"
        :dragging
        :data-value="getLabel(sliderVal)"
        @touchstart="dragEvent"
      />
      <input
        type="range"
        :min="limit.min"
        :max="limit.max"
        v-model="sliderVal"
      />
      <div class="md-slider-track" ref="wrapper" />
      <div class="md-slider-labels" v-if="values">
        <template v-if="showLabel">
          <div
            :key="label"
            class="md-slider-label"
            v-for="{ value, label } in values.formatted"
            :class="{ covered: value === sliderVal }"
            :style="{ '--offset': getPosition(value) }"
          >
            {{ label }}
          </div>
        </template>
      </div>
      <div class="md-slider-indicators" v-if="values">
        <div
          :key="value"
          v-for="value in values.raw"
          class="md-slider-indicator"
          :class="{ covered: value <= sliderVal }"
          :style="{ '--offset': getPosition(value) }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .md-slider {
    --thumb-width: var(--xxs);
    --track-height: var(--md);

    display: grid;
    user-select: none;
    align-items: center;
    height: max(var(--thumb-height), var(--track-height));
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
      display: flex;
      height: 100%;
      position: relative;
      align-items: center;
      contain: layout;
    }

    &-track {
      position: absolute;
      align-self: center;
      overflow: hidden;
      width: 100%;
      height: var(--track-height);
      border-radius: 999px;

      &::before,
      &::after {
        border-radius: 2px;
        height: 100%;
        position: absolute;
        content: '';
      }

      &::before {
        left: 0;
        width: calc((var(--thumb-offset) * 1px) - (var(--thumb-width) * 2));
        background: var(--primary);
      }

      &::after {
        right: 0;
        background: var(--primary-container);
        left: calc(
          ((var(--thumb-offset) * 1px) + (var(--thumb-width) * 2))
        );
      }
    }

    &-thumb {
      z-index: 1;
      position: absolute;
      left: calc(var(--thumb-offset) * 1px);
      width: var(--thumb-width);
      height: max(var(--thumb-height), var(--track-height));
      border-radius: 999px;
      translate: -50% 0;
      background: var(--primary);

      &::before {
        height: 100%;
        aspect-ratio: 1;
        content: '';
        position: absolute;
        translate: -40% 0;
      }

      &::after {
        content: attr(data-value);
        position: absolute;
        top: 0;
        left: 50%;
        opacity: 0;
        pointer-events: none;
        font-size: var(--font-sm);
        padding: var(--xs) var(--sm);
        color: var(--inverse-on-surface);
        background: var(--inverse-surface);
        border-radius: 99px;
        transition: all 0.2s;
        box-shadow: 0 2px 5px #0005;
        translate: -50% -100%;
      }

      &[dragging='true'] {
        opacity: 1;
        width: calc(var(--thumb-width) * 0.75);
        margin-left: calc(var(--thumb-width) * -0.25);

        &::after {
          translate: -50% -125%;
          opacity: 1;
        }
      }
    }

    &-labels,
    &-indicators {
      display: flex;
      position: absolute;
      height: 100%;
      width: 100%;
      align-items: center;
      pointer-events: none;
    }

    &-indicator {
      position: absolute;
      background: var(--primary);
      left: calc(var(--offset) * 1px);
      translate: -50% 0;
      width: var(--xxs);
      height: var(--xxs);
      border-radius: 999px;

      &:last-child {
        scale: 1.5;
        transform-origin: right;
      }

      &.covered {
        background: var(--on-primary);
      }
    }

    &-label {
      position: absolute;
      left: calc(var(--offset) * 1px);
      translate: -50% 100%;
      font-size: var(--font-xs);
      color: var(--mono-50);
      width: max-content;
      text-align: center;

      &.covered {
        opacity: 0;
      }
    }
  }
</style>
