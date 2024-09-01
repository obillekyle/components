<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'

  import { customRef } from '@/ref/custom-ref'
  import { useRect } from '@/ref/use-rect'
  import { addUnit, getCSSValue } from '@/utils/css/sizes'
  import { clamp } from '@/utils/number/range'
  import { computed } from 'vue'

  import ViewObserver from '../Misc/view-observer.vue'

  interface LinearProgressProps {
    value?: number
    size?: SizesString
  }

  const [root, setRef] = customRef<HTMLElement>()
  const rect = useRect(root)

  const props = withDefaults(defineProps<LinearProgressProps>(), {
    value: Infinity,
    size: 4
  })

  const width = computed(() => rect.value?.width || 0)
  const speed = computed(() => clamp(width.value / 300, 2.5, 6))
  const noSpace = computed(() => props.value <= 0)

  defineOptions({ name: 'MdLinearProgress' })
</script>

<template>
  <ViewObserver
    :ref="setRef"
    apply="animate"
    class="md-progress"
    :class="{ noSpace }"
    :style="{
      height: getCSSValue(size),
      '--speed': addUnit(speed, 's')
    }"
  >
    <div class="md-progress-infinite" v-if="value === Infinity">
      <div class="md-progress-infinite-bar" />
    </div>
    <div class="md-progress-bar" v-else :style="`--value: ${value}`" />
  </ViewObserver>
</template>

<style lang="scss">
  @keyframes infinite-load {
    0% {
      left: 0%;
      right: 100%;
    }

    20% {
      left: 0%;
    }

    40% {
      left: 30%;
      right: 0%;
    }

    70% {
      left: 100%;
      right: 0%;
    }
  }

  @keyframes infinite-load-2 {
    50% {
      right: 100%;
    }

    75% {
      right: 30%;
      left: 0%;
    }

    90% {
      right: 0%;
    }

    100% {
      left: 100%;
      right: 0%;
    }
  }

  @keyframes infinite-load-bg-1 {
    0% {
      left: var(--xxs);
      right: 0%;
    }

    40% {
      left: calc(100% + var(--xxs));
      right: 0%;
    }

    40.001% {
      left: 0%;
      right: 100%;
    }

    50% {
      left: 0%;
      right: 100%;
    }

    75% {
      right: calc(100% + var(--xxs));
      left: 0%;
    }

    100% {
      right: calc(0% + var(--xxs));
      left: 0%;
    }
  }

  @keyframes infinite-load-bg-2 {
    20% {
      right: calc(100% + var(--xxs));
      left: 0%;
    }

    40% {
      left: 0%;
      right: calc(70% + var(--xxs));
    }

    49.999% {
      left: 0%;
    }

    50% {
      left: var(--xxs);
    }

    69.999% {
      right: var(--xxs);
    }

    70% {
      right: 0%;
    }

    75% {
      left: calc(70% + var(--xxs));
    }

    90% {
      left: calc(100% + var(--xxs));
    }

    100% {
      left: calc(100% + var(--xxs));
      right: 0%;
    }
  }

  .md-progress {
    position: relative;
    overflow: hidden;
    width: 100%;
    background: transparent;
    border-radius: var(--md);

    &:not(.animate) {
      *,
      *::before,
      *::after {
        animation-play-state: paused !important;
      }
    }

    &-bar {
      height: inherit;
      overflow: hidden;
      background: var(--primary);
      width: calc(var(--value) * 1%);
      transition: width 0.25s var(--timing-standard);
      will-change: width;
      border-radius: inherit;

      &::before,
      &::after {
        top: 0;
        content: '';
        position: absolute;
        border-radius: inherit;
        height: inherit;
      }

      &::before {
        right: 0;
        transition: left 0.25s var(--timing-standard);
        background: var(--secondary-container);
        left: calc(var(--value) * 1% + var(--xxs));
      }

      &::after {
        aspect-ratio: 1;
        max-height: var(--xxs);
        background: var(--primary);
      }
    }

    &.no-space &-bar::before {
      left: 0;
    }

    &-infinite {
      height: inherit;
      overflow: hidden;
      position: relative;
      border-radius: inherit;

      &-bar {
        height: inherit;
        position: relative;
        border-radius: inherit;

        &::before,
        &::after {
          position: absolute;
          content: '';
          height: inherit;
          background: var(--secondary-container);
          border-radius: inherit;
        }

        &::after {
          animation: infinite-load-bg-1 infinite var(--speed) linear;
        }

        &::before {
          animation: infinite-load-bg-2 infinite var(--speed) linear;
        }
      }

      &::before,
      &::after {
        top: 0;
        position: absolute;
        content: '';
        height: inherit;
        border-radius: inherit;
        background: var(--primary);
      }

      &::before {
        animation: infinite-load infinite var(--speed) linear;
      }

      &::after {
        animation: infinite-load-2 infinite var(--speed) linear;
      }
    }
  }
</style>
