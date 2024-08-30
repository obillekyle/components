<script setup lang="ts">
  import { addUnit, getCSSValue } from '@/utils/css/sizes'
  import { clamp } from '@/utils/number/range'
  import { customRef } from '@/utils/ref/custom-ref'
  import { useRect } from '@/utils/ref/use-rect'
  import { computed } from 'vue'

  import ViewObserver from '../Misc/view-observer.vue'

  interface LinearProgressProps {
    value?: number
    size?: number
  }

  const [root, setRef] = customRef<HTMLElement>()
  const rect = useRect(root)

  const props = withDefaults(defineProps<LinearProgressProps>(), {
    value: Infinity,
    size: 5
  })

  defineOptions({ name: 'MdLinearProgress' })

  const noSpace = computed(() => props.value <= 0)
  const width = computed(() => rect.value?.width || 0)
  const speed = computed(() => clamp(width.value / 300, 2.5, 6))

  const length = computed(() => {
    const length = (props.value / 100) * width.value
    return {
      percent: length,
      dash2Array: width.value,
      dash2Offset: -(length + props.size * 2),
      dashArray: `${length} ${width.value}`
    }
  })
</script>

<template>
  <ViewObserver
    :ref="setRef"
    apply="animate"
    class="md-progress-2"
    :class="{ noSpace }"
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
      v-if="!Number.isFinite(value)"
    >
      <path
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
      v-else
      class="md-progress-2-bar"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`0 0 ${width} ${size}`"
      :style="{
        '--value': clamp(value, 0, 100)
      }"
    >
      <path
        class="md-progress-2-bar-bg"
        :d="`M 0 ${size / 2} L ${width} ${size / 2}`"
        :stroke-width="size"
        :stroke-dasharray="length.dash2Array"
        :stroke-dashoffset="length.dash2Offset"
      />
      <path
        class="md-progress-2-bar-draw"
        :d="`M 0 ${size / 2} L ${width} ${size / 2}`"
        :stroke-width="size"
        :stroke-dasharray="length.dashArray"
        :stroke-dashoffset="0"
      />
    </svg>
  </ViewObserver>
</template>

<style lang="scss">
  .md-progress-2 {
    --spacing: var(--xxs);

    position: relative;
    overflow: hidden;
    line-height: 0;
    width: 100%;
    height: var(--height);
    background: transparent;
    border-radius: var(--md);

    &-bar {
      width: 100%;
      vertical-align: top;

      &-draw,
      &-bg {
        stroke-linecap: round;
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
        stroke-dashoffset: calc(var(--spacing) * -2);
      }

      25% {
        stroke-dasharray: var(--width)
          calc((var(--width) * 0.7) + var(--spacing) * 4);
        stroke-dashoffset: calc(
          (var(--width) * -0.7) - (var(--spacing) * 2)
        );
      }

      50% {
        stroke-dasharray: calc(var(--width) - (var(--spacing) * 4))
          calc((var(--width) * 0.3) + var(--spacing) * 4);
        stroke-dashoffset: calc(
          (var(--width) * -1.3) - (var(--spacing) * 2)
        );
      }

      75% {
        stroke-dasharray: calc(var(--width) - (var(--spacing) * 4))
          calc((var(--width) * 0.7) + (var(--spacing) * 4));
        stroke-dashoffset: calc(
          (var(--width) * -2.7) - (var(--spacing) * 2)
        );
      }

      100% {
        stroke-dasharray: var(--width)
          calc(var(--width) + (var(--spacing) * 2));
        stroke-dashoffset: calc((var(--width) * -4) - (var(--spacing) * 2));
      }
    }
  }
</style>
