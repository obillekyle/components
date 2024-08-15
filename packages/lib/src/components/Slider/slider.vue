<script setup lang="ts">
  import { getClientPos } from '@/utils/dom/events'
  import { evaluate } from '@/utils/function/evaluate'
  import {
    clamp,
    findNearestNumber,
    offsetRange
  } from '@/utils/number/range'
  import { is } from '@/utils/object/is'
  import { useRect } from '@/utils/ref/use-rect'
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
  const wrapperRect = useRect(wrapper)

  // TODO: Organize this mess

  const values = computed(() => {
    if (props.values) {
      return props.values
        .map((v) => (is(v, 'object') ? v.value : v))
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
    dragging.value = true
    dragMove(e)
  }

  function getLabel(value: number) {
    if (!props.values) return value

    const vals = props.values
    const item = vals.find((v) => is(v, 'object') && v.value === value)
    return is(item, 'number') ? item : item?.label || value
  }

  function dragMove(e: MouseEvent | TouchEvent) {
    const rect = wrapperRect.value!

    if (!rect) return
    if (!dragging.value) return
    const min = minVal.value
    const max = maxVal.value

    e.preventDefault()

    const offset = rect.height / 2
    const length = rect.width
    const clientX = getClientPos(e).x - rect.left
    const pos = offsetRange(length, clientX, offset * -1)

    const maxOffset = max - min
    const percent = pos / length
    const value = clamp(percent * maxOffset + min, min, max)

    if (props.values) {
      sliderVal.value = findNearestNumber(value, values.value)
      return
    }

    if (props.step) {
      const step = props.step
      const rounded = Math.round(value / step) * step
      sliderVal.value = Math.max(rounded, min)
      return
    }

    const decimal = Math.pow(10, props.decimal)
    const rounded = Math.round(value * decimal) / decimal
    sliderVal.value = Math.max(rounded, min)
  }

  function dragUp() {
    dragging.value = false
  }

  function getPosition(value: number) {
    if (!wrapperRect.value) return 0
    const rect = wrapperRect.value!
    const maxOffset = maxVal.value - minVal.value
    const number = (value - minVal.value) / maxOffset
    const offset = useMD3 ? rect.height / 2 : 0

    return offsetRange(rect.width, number * rect.width, offset)
  }

  const thumbPos = computed(() => getPosition(sliderVal.value))

  function handleKeydown(e: KeyboardEvent) {
    const step = props.step ?? 1 / 10 ** props.decimal
    const min = minVal.value
    const max = maxVal.value
    const vals = values.value
    const value = sliderVal.value

    if (e.key === 'ArrowLeft') {
      if (props.values) {
        const index = vals.indexOf(value)
        const prevIndex = Math.max(index - 1, 0)
        sliderVal.value = vals[prevIndex]
        return
      }

      const newValue = value - step
      sliderVal.value = Math.max(newValue, min)
      return
    }

    if (e.key === 'ArrowRight') {
      if (props.values) {
        const index = vals.indexOf(value)
        const nextIndex = Math.min(index + 1, vals.length - 1)
        sliderVal.value = vals[nextIndex]
        return
      }

      const newValue = value + step
      sliderVal.value = Math.min(newValue, max)
    }
  }

  defineOptions({ name: 'MdSlider' })

  onMounted(() => {
    document.addEventListener('mousemove', dragMove)
    document.addEventListener('mouseup', dragUp)

    document.addEventListener('touchmove', dragMove, { passive: false })
    document.addEventListener('touchend', dragUp, { passive: false })
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
    <div class="md-slider-wrapper" :style="{ '--thumb-offset': thumbPos }">
      <div
        class="md-slider-thumb"
        :dragging
        :data-value="getLabel(sliderVal)"
        @touchstart="dragDown"
      />
      <input type="range" :min="minVal" :max="maxVal" v-model="sliderVal" />
      <div class="md-slider-track" ref="wrapper" />
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
          :class="{ covered: value <= sliderVal }"
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
        right: calc((var(--thumb-offset) - 100) * -1px);
        background: var(--primary);
      }
    }

    &-thumb {
      z-index: 1;
      position: absolute;
      left: calc(var(--thumb-offset) * 1px);
      width: var(--thumb-width);
      height: var(--thumb-height);
      border-radius: 999px;
      align-self: center;
      transform: translateX(-50%);
      background: var(--primary);

      &::before {
        content: '';
        position: absolute;
        width: 500%;
        height: 100%;
        transform: translateX(-40%);
      }

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
        width: calc(var(--thumb-width) * 0.8);
        margin-left: calc(var(--thumb-width) * -0.2);

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
        left: calc(var(--offset) * 1px);
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
        left: calc(var(--offset) * 1px);
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
            (var(--thumb-offset) * 1px) - (var(--thumb-width) * 2)
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
            ((var(--thumb-offset) * 1px) + (var(--thumb-width) * 2))
          );
          border-radius: 2px;
        }
      }
    }
  }
</style>
