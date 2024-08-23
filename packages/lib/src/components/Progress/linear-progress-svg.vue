<script setup lang="ts">
  import { addUnit, getCSSValue } from '@/utils/css/sizes'
  import { clamp } from '@/utils/number/range'
  import { fnRef } from '@/utils/ref/fn-ref'
  import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

  import ViewObserver from '../Misc/view-observer.vue'

  let observer: ResizeObserver | undefined
  const width = ref(0)
  const speed = computed(() => clamp(width.value / 300, 2.5, 6))

  const root = ref<HTMLElement>()
  const props = withDefaults(
    defineProps<{
      value?: number
      size?: number
    }>(),
    {
      value: Infinity,
      size: 5
    }
  )

  const md3 = inject('md3', false)
  const noSpace = computed(() => props.value <= 0)

  onMounted(() => {
    observer = new ResizeObserver(() => {
      width.value = root.value!.offsetWidth
    })
    observer.observe(root.value!)
  })

  onBeforeUnmount(() => {
    observer?.disconnect?.()
    observer = undefined
  })

  const setRef = fnRef(root)
  defineOptions({ name: 'MdLinearProgress' })

  const length = computed(() => (props.value / 100) * width.value)

  const dashArray = computed(() => `${length.value} ${width.value}`)
  const dash2Array = computed(() => `${width.value}`)
  const dash2Offset = computed(() => `-${length.value + props.size * 2}`)
</script>

<template>
  <ViewObserver
    :ref="setRef"
    apply="animate"
    class="md-progress-2"
    :class="{ md3, noSpace }"
    :style="{
      '--width': getCSSValue(width),
      '--height': getCSSValue(size),
      '--speed': addUnit(speed, 's')
    }"
  >
    <svg
      class="md-progress-2-infinite"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`0 0 ${width} ${size}`"
    >
      <path
        v-if="md3"
        class="md-progress-2-infinite-2"
        :d="`M 0 ${size / 2} L ${width} ${size / 2}`"
        :stroke-width="size"
      />
      <path
        class="md-progress-2-infinite-1"
        :d="`M 0 ${size / 2} L ${width} ${size / 2}`"
        stroke="var(--primary)"
      />
    </svg>

    <svg
      class="md-progress-2-bar"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`0 0 ${width} ${size}`"
      :style="{
        '--value': clamp(value, 0, 100)
      }"
    >
      <path
        v-if="md3"
        class="md-progress-2-bar-bg"
        :d="`M 0 ${size / 2} L ${width} ${size / 2}`"
        :stroke-width="size"
        :stroke-dasharray="dash2Array"
        :stroke-dashoffset="dash2Offset"
      />
      <path
        class="md-progress-2-bar-draw"
        :d="`M 0 ${size / 2} L ${width} ${size / 2}`"
        :stroke-width="size"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="0"
      />
    </svg>
  </ViewObserver>
</template>

<style lang="scss">
  .md-progress-2 {
    position: relative;
    background: var(--surface-container);
    overflow: hidden;
    line-height: 0;
    width: 100%;
    height: var(--height);

    &-bar {
      width: 100%;
      vertical-align: top;

      &-draw,
      &-bg {
        stroke-linecap: butt;
        stroke-width: var(--height);
        fill: none;
      }

      &-draw {
        stroke: var(--primary);
      }

      &-bg {
        stroke: var(--secondary-container);
      }
    }

    &-infinite {
      width: 100%;

      &-1,
      &-2 {
        stroke-linecap: butt;
        stroke-width: var(--height);
        fill: none;
      }

      &-1 {
        stroke: var(--primary);
        animation: md-progress-linear-1 var(--speed) linear infinite;
      }

      &-2 {
        stroke: var(--secondary-container);
        animation: md-progress-linear-2 var(--speed) linear infinite;
      }
    }

    @keyframes md-progress-linear-1 {
      0% {
        stroke-dasharray: 0 var(--width);
        stroke-dashoffset: 0;
      }

      25% {
        stroke-dasharray: calc(var(--width) * 0.7) var(--width);
        stroke-dashoffset: 0;
      }

      50% {
        stroke-dasharray: calc(var(--width) * 0.3) var(--width);
        stroke-dashoffset: calc(var(--width) * -1);
      }

      75% {
        stroke-dasharray: calc(var(--width) * 0.7) calc(var(--width));
        stroke-dashoffset: calc(var(--width) * -2);
      }

      100% {
        stroke-dashoffset: calc(var(--width) * -3);
        stroke-dasharray: calc(var(--width)) calc(var(--width));
      }
    }

    @keyframes md-progress-linear-2 {
      0% {
        stroke-dasharray: var(--width) var(--width);
        stroke-dashoffset: calc(var(--height) * -2);
      }

      25% {
        stroke-dasharray: var(--width)
          calc((var(--width) * 0.7) + var(--height) * 4);
        stroke-dashoffset: calc(
          (var(--width) * -0.7) - (var(--height) * 2)
        );
      }

      50% {
        stroke-dasharray: calc(var(--width) - (var(--height) * 4))
          calc((var(--width) * 0.3) + var(--height) * 4);
        stroke-dashoffset: calc(
          (var(--width) * -1.3) - (var(--height) * 2)
        );
      }

      75% {
        stroke-dasharray: calc(var(--width) - (var(--height) * 4))
          calc((var(--width) * 0.7) + (var(--height) * 4));
        stroke-dashoffset: calc(
          (var(--width) * -2.7) - (var(--height) * 2)
        );
      }

      100% {
        stroke-dasharray: calc(var(--width))
          calc(var(--width) + (var(--height) * 2));
        stroke-dashoffset: calc((var(--width) * -4) - (var(--height) * 2));
      }
    }

    &.md3 {
      background-color: transparent;
      border-radius: var(--md);

      svg path {
        stroke-linecap: round !important;
      }
    }
  }
</style>
