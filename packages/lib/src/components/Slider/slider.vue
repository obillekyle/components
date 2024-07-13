<script setup lang="ts">
  import { evaluate } from '@/utils/object'
  import {
    clamp,
    findNearestNumber,
    mapNumberToRange
  } from '@/utils/number'
  import {
    computed,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    ref,
    watch
  } from 'vue'
  import { inject } from 'vue'

  interface SliderProps {
    defaultValue?: number
    values?: number[] | { label: string; value: number }[]
    min?: number
    max?: number
    step?: number
    decimal?: number
    change?: (value: number) => void
    showValue?: boolean
    showLabel?: boolean
  }

  const props = withDefaults(defineProps<SliderProps>(), {
    min: 0,
    max: 100,
    decimal: 0
  })

  const dragging = ref(false)
  const model = defineModel<number>()
  const wrapper = ref<HTMLElement | null>(null)
  const useMD3 = inject<boolean>('md3', false)

  const minVal = computed(() => {
    if (props.values) {
      const array = props.values.map((value) =>
        typeof value === 'object' ? value.value : value
      )
      return Math.min(...array)
    }
    return props.min
  })

  const values = computed(() => {
    if (props.values) {
      return props.values
        .map((value) => (typeof value === 'object' ? value.value : value))
        .sort((a, b) => a - b)
    }

    return []
  })

  const maxVal = computed(() => {
    if (props.values) {
      const array = props.values.map((value) =>
        typeof value === 'object' ? value.value : value
      )
      return Math.max(...array)
    }
    return props.max
  })

  function dragDown(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    dragging.value = true
    dragMove(e)
  }

  function getLabel(value: number) {
    if (props.values) {
      const index = props.values.find(
        (v) => typeof v === 'object' && v.value === value
      )
      return typeof index === 'number' ? index : index?.label || value
    }

    return value
  }

  function dragMove(e: MouseEvent | TouchEvent) {
    const element = wrapper.value!

    if (!element) return
    if (!dragging.value) return
    const rect = element.getBoundingClientRect()

    e.preventDefault()

    const clientX =
      e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
    const offset = clamp(clientX - rect.left, 0, rect.width)

    const maxOffset = maxVal.value - minVal.value

    if (props.values) {
      const min = minVal.value
      const max = maxVal.value
      const value = Math.round((offset / rect.width) * (max - min) + min)
      model.value = findNearestNumber(value, values.value)!
      return
    }

    if (props.step) {
      const value = (offset / rect.width) * maxOffset
      const rounded = Math.round(value / props.step) * props.step
      model.value = Math.max(rounded, minVal.value)
      return
    }

    const value = (offset / rect.width) * maxOffset
    const rounded =
      Math.round(value * 10 ** props.decimal) / 10 ** props.decimal
    model.value = Math.max(rounded + minVal.value, minVal.value)
  }

  function dragUp() {
    dragging.value = false
  }

  onBeforeMount(() => {
    model.value ??= Math.max(
      Math.min(props.defaultValue ?? 0, maxVal.value),
      minVal.value
    )
  })

  function getPosition(value: number) {
    const num =
      ((value - minVal.value) / (maxVal.value - minVal.value)) * 100

    return useMD3
      ? mapNumberToRange(num, 0, 100, 2.4, 97.6)
      : mapNumberToRange(num, 0, 100, 0.8, 99.2)
  }

  const thumbPos = computed(() => {
    return getPosition(model.value ?? 0)
  })

  watch(model, () => {
    evaluate(props.change, model.value)
  })

  function handleKeydown(e: KeyboardEvent) {
    const step = props.step ?? 1 / 10 ** props.decimal
    if (e.key === 'ArrowLeft') {
      if (props.values) {
        const index = values.value.findIndex((v) => v === model.value)
        const nextIndex = Math.max(index - 1, 0)
        model.value = values.value[nextIndex]
        return
      }

      const value = (model.value ?? minVal.value) - step
      model.value = Math.max(value, minVal.value)
    } else if (e.key === 'ArrowRight') {
      if (props.values) {
        const index = values.value.findIndex((v) => v === model.value)
        const nextIndex = Math.min(index + 1, values.value.length - 1)
        model.value = values.value[nextIndex]
        return
      }

      const value = (model.value ?? minVal.value) + step
      model.value = Math.min(value, maxVal.value)
    }
  }

  defineOptions({
    name: 'MdSlider'
  })

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
      {{ model }}
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
      <input type="range" :min="minVal" :max="maxVal" v-model="model" />
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

    height: calc(var(--thumb-height) * 2);
    width: 100%;
    user-select: none;
    display: grid;
    align-items: center;

    input {
      display: none;
    }

    &:has(.slider-value) {
      grid-template-columns: auto 1fr;
    }

    &-value {
      font-size: var(--font-sm);
      padding: var(--xs) var(--md);
      margin-right: var(--sm);
      background-color: var(--mono-20);
      color: var(--mono-80);
      border-radius: var(--xs);
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
      background: var(--mono-20);
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
      box-shadow: var(--shadow-1);

      &::after {
        content: attr(data-value);
        position: absolute;
        top: 0;
        left: 50%;
        padding: var(--xs) var(--sm);
        background: var(--mono-10);
        transform: translate(-50%, -100%);
        font-size: var(--font-sm);
        color: var(--mono-100);
        border-radius: var(--xs);
        transition: all 0.2s;
        box-shadow: 0 2px 5px #0005;
        opacity: 0;
      }

      &[dragging='true'] {
        background: var(--primary-40);

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
        background: var(--primary-50);

        &.covered {
          background: var(--primary-20);
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
      --thumb-width: calc(var(--padding-xxs) * 1.5);
      --thumb-height: var(--component-md);
      --track-height: var(--sm);

      height: var(--thumb-height);

      .md-slider-indicators {
        > :last-child {
          scale: 1.5;
          transform-origin: left;
        }

        .md-slider-indicator {
          background-color: var(--primary-60);

          &.covered {
            background-color: var(--primary-10);
          }
        }
      }

      .md-slider-track {
        background: none;

        &::before {
          width: calc(
            (var(--thumb-offset) * 1%) - (var(--thumb-width) * 1.5)
          );
          border-radius: 2px;
        }

        &::after {
          content: '';
          right: 0;
          background: var(--primary-20);
          height: 100%;
          position: absolute;
          left: calc(
            ((var(--thumb-offset) * 1%) + (var(--thumb-width) * 1.5))
          );
          border-radius: 2px;
        }
      }
    }
  }
</style>