<script setup lang="ts">
  import { customRef } from '@/ref/custom-ref'
  import { useRect } from '@/ref/use-rect'
  import { addUnit, getCSSValue } from '@/utils/css/sizes'
  import { clamp } from '@/utils/number/range'
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

  const width = computed(() => (rect.ready ? rect.width : 0))
  const speed = computed(() => clamp(width.value / 300, 2, 6))
  const noSpace = computed(() => props.value <= 0 || undefined)

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
    :no-space="noSpace || undefined"
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

    width: 100%;
    line-height: 0;
    position: relative;
    overflow: hidden;
    height: var(--height);
    border-radius: var(--md);

    &:has(&-bar)::after {
      height: 100%;
      content: '';
      position: absolute;
      border-radius: 50%;
      aspect-ratio: 1;
      background: var(--primary);
      right: 0;
    }

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

    &[no-space] &-bar-bg {
      stroke-dashoffset: 0;
    }

    &[no-space] &-bar-draw {
      stroke-dashoffset: 1;
    }

    &-infinite {
      width: 100%;

      &-1,
      &-2 {
        fill: none;
        stroke-linecap: round;
        stroke-width: var(--height);
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
        stroke-dasharray: calc(var(--width) * 0.7) var(--width);
        stroke-dashoffset: calc(var(--width) * -2);
      }

      100% {
        stroke-dashoffset: calc(var(--width) * -3);
        stroke-dasharray: var(--width) var(--width);
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
