<script setup lang="ts">
  import { addPX } from '@/utils/css'
  import { computed, inject, onMounted, ref, watch } from 'vue'
  import ViewObserver from '../Misc/view-observer.vue'

  const svg = ref<SVGSVGElement>()
  const circle = ref<SVGCircleElement>()
  const circle2 = ref<SVGCircleElement>()

  const properties = withDefaults(
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

  const isInfinite = computed(() => !Number.isFinite(properties.value))
  const circleRadius = computed(
    () => (properties.diameter - properties.stroke) / 2
  )
  const circleStrokeWidth = computed(() => addPX(properties.stroke))

  const circleCircumference = computed(
    () => 2 * Math.PI * circleRadius.value
  )

  const circleStrokeDashArray = computed(() =>
    addPX(circleCircumference.value)
  )

  const circleStrokeDashOffset = computed(() =>
    isInfinite.value
      ? addPX(circleCircumference.value * 0.2)
      : addPX((circleCircumference.value * (100 - properties.value)) / 100)
  )

  const space = computed(() => properties.stroke * 3)
  const hasSpace = computed(
    () =>
      properties.value > properties.stroke &&
      properties.value < 100 - space.value
  )

  const circle2StrokeDashOffset = computed(() => {
    const offset = hasSpace.value ? space.value : 0
    const value = circleCircumference.value * properties.value
    const total = circleCircumference.value * offset
    return addPX((value + total) / 100)
  })

  const circle2StrokeRotate = computed(() => {
    const offset = hasSpace.value ? space.value / 2 : 0
    return (360 * (properties.value + offset)) / 100 + 'deg'
  })

  function attachStyles() {
    const svgRoot = svg.value!
    const circleElement = circle.value!
    const circle2Element = circle2.value

    const size = addPX(properties.diameter)
    svgRoot.style.width = size
    svgRoot.style.height = size

    circleElement.style.strokeDashoffset = circleStrokeDashOffset.value
    circleElement.style.strokeDasharray = circleStrokeDashArray.value
    circleElement.style.strokeWidth = circleStrokeWidth.value

    if (circle2Element) {
      circle2Element.style.strokeWidth = circleStrokeWidth.value
      circle2Element.style.strokeDasharray = circleStrokeDashArray.value
      circle2Element.style.strokeDashoffset = circle2StrokeDashOffset.value
      circle2Element.style.rotate = circle2StrokeRotate.value
    }

    if (
      !circleElement.classList.contains('animate') ||
      !circle2Element?.classList.contains('animate')
    ) {
      setTimeout(() => {
        circleElement.classList.toggle('animate', true)
        circle2Element?.classList.toggle('animate', true)
      })
    }

    circleElement.style.setProperty(
      '--md-progress-spinner-start-value',
      String(0.99 * circleCircumference.value)
    )
    circleElement.style.setProperty(
      '--md-progress-spinner-end-value',
      String(0.2 * circleCircumference.value)
    )
  }

  defineOptions({
    name: 'MDCircularProgress'
  })

  watch(properties, () => attachStyles())
  onMounted(() => attachStyles())
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
      ref="svg"
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
    }

    .md-progress-spinner-bg {
      stroke: var(--secondary-container);
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
