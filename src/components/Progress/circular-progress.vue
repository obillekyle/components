<script setup lang="ts">
  import { addPX } from '@/utils/css'
  import { computed, inject, onMounted, ref, watch } from 'vue'

  const svg = ref<SVGSVGElement | null>(null)
  const circle = ref<SVGCircleElement | null>(null)
  const circle2 = ref<SVGCircleElement | null>(null)

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

  const isInfinite = computed(() => {
    return !isFinite(props.value)
  })

  const circleRadius = computed(() => {
    return (props.diameter - props.stroke) / 2
  })

  const circleStrokeWidth = computed(() => {
    return addPX(props.stroke)
  })

  const circleCircumference = computed(() => {
    return 2 * Math.PI * circleRadius.value
  })

  const circleStrokeDashArray = computed(() => {
    return addPX(circleCircumference.value)
  })

  const circleStrokeDashOffset = computed(() => {
    if (!isInfinite.value) {
      return addPX(
        (circleCircumference.value * (100 - props.value)) / 100
      )
    }

    if (isInfinite.value) {
      return addPX(circleCircumference.value * 0.2)
    }

    return ''
  })

  const space = computed(() => props.stroke * 3)
  const hasSpace = computed(() => {
    return props.value > props.stroke && props.value < 100 - space.value
  })

  const circle2StrokeDashOffset = computed(() => {
    const offset = hasSpace.value ? space.value : 0

    const value = addPX(
      (circleCircumference.value * props.value +
        circleCircumference.value * offset) /
        100
    )
    return value
  })

  const circle2StrokeRotate = computed(() => {
    const offset = hasSpace.value ? space.value / 2 : 0
    return (360 * (props.value + offset)) / 100 + 'deg'
  })

  function attachStyles() {
    const svgRoot = svg.value!
    const circleElem = circle.value!
    const circle2Elem = circle2.value

    const size = addPX(props.diameter)
    svgRoot.style.width = size
    svgRoot.style.height = size

    circleElem.style.strokeDashoffset = circleStrokeDashOffset.value
    circleElem.style.strokeDasharray = circleStrokeDashArray.value
    circleElem.style.strokeWidth = circleStrokeWidth.value

    if (circle2Elem) {
      circle2Elem.style.strokeWidth = circleStrokeWidth.value
      circle2Elem.style.strokeDasharray = circleStrokeDashArray.value
      circle2Elem.style.strokeDashoffset = circle2StrokeDashOffset.value
      circle2Elem.style.rotate = circle2StrokeRotate.value
    }

    if (
      !circleElem.classList.contains('animate') ||
      !circle2Elem?.classList.contains('animate')
    ) {
      setTimeout(() => {
        circleElem.classList.toggle('animate', true)
        circle2Elem?.classList.toggle('animate', true)
      })
    }

    circleElem.style.setProperty(
      '--md-progress-spinner-start-value',
      String(0.99 * circleCircumference.value)
    )
    circleElem.style.setProperty(
      '--md-progress-spinner-end-value',
      String(0.2 * circleCircumference.value)
    )
  }

  defineOptions({
    name: 'MDCircularProgress'
  })

  watch(props, () => attachStyles())
  onMounted(() => attachStyles())
</script>

<template>
  <div
    class="md-circular-progress"
    :class="{
      md3,
      rotate,
      'md-infinite': isInfinite
    }"
  >
    <svg
      class="md-progress-spinner-draw"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
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
  </div>
</template>

<style lang="scss" scoped>
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

    .md-circular-progress-content {
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
      stroke: var(--mono-20);
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
        animation: 7s infinite var(--timing-standard) !important;
        animation-name: md-progress-spinner-stroke-rotate !important;
      }
    }
  }
</style>
