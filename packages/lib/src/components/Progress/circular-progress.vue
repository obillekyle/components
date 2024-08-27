<script setup lang="ts">
  import { computed } from 'vue'

  import ViewObserver from '../Misc/view-observer.vue'

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

  const circle = computed(() => {
    const { value, diameter, stroke } = props

    const space = stroke * 3
    const infinite = !Number.isFinite(value)
    const radius = (diameter - stroke) / 2

    const circumference = 2 * Math.PI * radius
    const offsetMultiple = infinite ? 20 : 100 - value

    const bgValue = circumference * value
    const bgTotal = circumference * space

    return {
      radius,
      infinite,
      circumference,
      dashOffset: (circumference * offsetMultiple) / 100,
      dash2Offset: (bgValue + bgTotal) / 100,
      dash2Rotate: (360 * (value + space / 2)) / 100
    }
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
      rotate,
      'md-infinite': circle.infinite
    }"
  >
    <svg
      focusable="false"
      class="md-progress-spinner-draw"
      preserveAspectRatio="xMidYMid meet"
      :viewBox="`0 0 ${diameter} ${diameter}`"
      :height="diameter"
      :width="diameter"
      :style="{
        '--stroke-width': stroke,
        '--stroke-dash-array': circle.circumference,
        '--stroke-dash-offset': circle.dashOffset,
        '--stroke-dash-offset-2': circle.dash2Offset,
        '--circle-2-rotate': circle.dash2Rotate + 'deg',
        '--circle-infinite-start': 0.99 * circle.circumference,
        '--circle-infinite-end': 0.2 * circle.circumference
      }"
    >
      <circle
        class="md-progress-spinner-bg"
        cx="50%"
        cy="50%"
        :r="circle.radius"
        v-if="!circle.infinite"
      />

      <circle
        class="md-progress-spinner-circle"
        cx="50%"
        cy="50%"
        :r="circle.radius"
      />
    </svg>

    <div
      class="md-circular-progress-content"
      :style="{ width: diameter - stroke * 2 + 'px' }"
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
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotate(0);
    }

    10% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotate(0);
    }

    10.001% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotateX(180deg) rotate(70deg);
    }

    20% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotateX(180deg) rotate(70deg);
    }

    20.001% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotate(290deg);
    }

    30% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotate(290deg);
    }

    30.001% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotateX(180deg) rotate(142deg);
    }

    40% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotateX(180deg) rotate(142deg);
    }

    40.001% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotate(216deg);
    }

    50% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotate(214deg);
    }

    50.001% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotateX(180deg) rotate(216deg);
    }

    60% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotateX(180deg) rotate(216deg);
    }

    60.001% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotate(144deg);
    }

    70% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotate(144deg);
    }

    70.001% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotateX(180deg) rotate(286deg);
    }

    80% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotateX(180deg) rotate(284deg);
    }

    80.001% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotate(73deg);
    }

    90% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotate(73deg);
    }

    90.001% {
      stroke-dashoffset: var(--circle-infinite-end);
      transform: rotateX(180deg) rotate(0deg);
    }

    100% {
      stroke-dashoffset: var(--circle-infinite-start);
      transform: rotateX(180deg) rotate(0deg);
    }
  }

  .md-circular-progress {
    position: relative;
    width: max-content;
    height: max-content;
    align-self: center;
    line-height: 0;

    &:not(.animate) * {
      animation-play-state: paused !important;
    }

    &-content {
      position: absolute;
      display: grid;
      place-items: center;
      left: 50%;
      top: 50%;
      aspect-ratio: 1 / 1;
      translate: -50% -50%;

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
      stroke-linecap: round;
      stroke-width: var(--stroke-width);
      stroke-dasharray: var(--stroke-dash-array);
      will-change: stroke-dashoffset, stroke-dasharray, stroke-width,
        animation-name, r;
      transition:
        stroke-dashoffset 0.4s var(--timing-standard),
        rotate 0.4s var(--timing-standard);
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

    &.rotate,
    &.md-infinite {
      .md-progress-spinner-draw {
        animation: md-progress-spinner-rotate 2.5s linear infinite;
      }
    }

    &.md-infinite {
      .md-progress-spinner-circle {
        animation: 7s infinite var(--timing-standard);
        animation-name: md-progress-spinner-stroke-rotate;
      }
    }
  }
</style>
