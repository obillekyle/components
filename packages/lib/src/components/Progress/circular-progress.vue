<script setup lang="ts">
  import { addPX, addUnit } from '@/utils/css'
  import { computed, inject, ref } from 'vue'
  import ViewObserver from '../Misc/view-observer.vue'

  const svg = ref<SVGSVGElement>()
  const circle = ref<SVGCircleElement>()
  const circle2 = ref<SVGCircleElement>()

  const props = withDefaults(
    defineProps<{
      value?: number
      diameter?: number
      stroke?: number
      rotate?: boolean
    }>(),
    {
      value: Infinity,
      diameter: 48,
      stroke: 5
    }
  )

  const md3 = inject('md3', false)
  const isInfinite = computed(() => !Number.isFinite(props.value))
  const circleRadius = computed(() => (props.diameter - props.stroke) / 2)

  const circleCircumference = computed(
    () => 2 * Math.PI * circleRadius.value
  )

  const circleStrokeDashOffset = computed(() =>
    isInfinite.value
      ? addPX(circleCircumference.value * 0.2)
      : addPX((circleCircumference.value * (100 - props.value)) / 100)
  )

  const space = computed(() => props.stroke * 3)
  const hasSpace = computed(
    () => props.value > props.stroke && props.value < 100 - space.value
  )

  const circle2StrokeDashOffset = computed(() => {
    const offset = hasSpace.value ? space.value : 0
    const value = circleCircumference.value * props.value
    const total = circleCircumference.value * offset
    return addPX((value + total) / 100)
  })

  const circle2StrokeRotate = computed(() => {
    const offset = hasSpace.value ? space.value / 2 : 0
    return (360 * (props.value + offset)) / 100
  })

  defineOptions({
    name: 'MDCircularProgress'
  })
</script>

<template>
  <ViewObserver
    apply="animate"
    class="md-circular-progress"
    :class="{
      md3,
      rotate,
      'md-infinite': isInfinite
    }"
  >
    <svg
      focusable="false"
      class="md-progress-spinner-draw"
      preserveAspectRatio="xMidYMid meet"
      :viewBox="`0 0 ${diameter} ${diameter}`"
      :height="diameter"
      :width="diameter"
      ref="svg"
      :style="{
        '--stroke-width': addPX(stroke),
        '--stroke-dash-array': addPX(circleCircumference),
        '--stroke-dash-offset': addPX(circleStrokeDashOffset),
        '--stroke-dash-offset-2': addPX(circle2StrokeDashOffset),
        '--circle-2-rotate': addUnit(circle2StrokeRotate, 'deg'),
        '--md-progress-spinner-start-value': 0.99 * circleCircumference,
        '--md-progress-spinner-end-value': 0.2 * circleCircumference
      }"
    >
      <circle
        class="md-progress-spinner-bg"
        cx="50%"
        cy="50%"
        :r="circleRadius"
        ref="circle2"
        v-if="md3 && !isInfinite"
      />

      <circle
        class="md-progress-spinner-circle"
        cx="50%"
        cy="50%"
        :r="circleRadius"
        ref="circle"
      />
    </svg>

    <div
      class="md-circular-progress-content"
      :style="{
        width: addPX(diameter - stroke * 2),
        height: addPX(diameter - stroke * 2)
      }"
    >
      <slot />
    </div>
  </ViewObserver>
</template>

<style lang="scss">
  @keyframes md-progress-spinner-rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @keyframes md-progress-spinner-stroke-rotate {
    0% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotate(0);
    }

    10% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotate(0);
    }

    10.001% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotateX(180deg) rotate(70deg);
    }

    20% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotateX(180deg) rotate(70deg);
    }

    20.001% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotate(290deg);
    }

    30% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotate(290deg);
    }

    30.001% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotateX(180deg) rotate(142deg);
    }

    40% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotateX(180deg) rotate(142deg);
    }

    40.001% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotate(216deg);
    }

    50% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotate(214deg);
    }

    50.001% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotateX(180deg) rotate(216deg);
    }

    60% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotateX(180deg) rotate(216deg);
    }

    60.001% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotate(144deg);
    }

    70% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotate(144deg);
    }

    70.001% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotateX(180deg) rotate(286deg);
    }

    80% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotateX(180deg) rotate(284deg);
    }

    80.001% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotate(73deg);
    }

    90% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotate(73deg);
    }

    90.001% {
      stroke-dashoffset: var(--md-progress-spinner-end-value);
      transform: rotateX(180deg) rotate(0deg);
    }

    100% {
      stroke-dashoffset: var(--md-progress-spinner-start-value);
      transform: rotateX(180deg) rotate(0deg);
    }
  }

  .md-circular-progress {
    position: relative;
    width: max-content;
    height: max-content;
    align-self: center;

    &:not(.animate) * {
      animation-play-state: paused !important;
    }

    &-content {
      position: absolute;
      display: grid;
      place-items: center;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      &:empty {
        display: none;
      }
    }

    .md-progress-spinner-draw {
      overflow: visible;
      transform: scale(1) rotate(-90deg);
      transform-origin: center;
      will-change: opacity, transform;
      transition: none;
    }

    .md-progress-spinner-circle,
    .md-progress-spinner-bg {
      fill: none;
      transform-origin: center;
      stroke-linecap: butt;
      stroke-width: var(--stroke-width);
      stroke-dasharray: var(--stroke-dash-array);
      will-change: stroke-dashoffset, stroke-dasharray, stroke-width,
        animation-name, r;

      &.animate {
        transition:
          stroke-dashoffset 0.25s var(--timing-standard),
          rotate 0.25s var(--timing-standard);
      }
    }

    .md-progress-spinner-circle {
      stroke: var(--primary);
      stroke-dashoffset: var(--stroke-dash-offset);
    }

    .md-progress-spinner-bg {
      rotate: var(--circle-2-rotate);
      stroke: var(--secondary-container);
      stroke-dashoffset: var(--stroke-dash-offset-2);
    }

    &.md3 {
      .md-progress-spinner-circle,
      .md-progress-spinner-bg {
        stroke-linecap: round !important;
      }
    }

    &.rotate,
    &.md-infinite {
      .md-progress-spinner-draw {
        animation: md-progress-spinner-rotate 2.5s linear infinite;
      }
    }

    &.md-infinite {
      .md-progress-spinner-circle {
        stroke-linecap: square;
        animation: 7s infinite var(--timing-standard);
        animation-name: md-progress-spinner-stroke-rotate;
      }
    }
  }
</style>
