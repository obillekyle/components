<script setup lang="ts">
  import { addUnit, getCSSValue } from '@/utils/css'
  import { clamp } from '@/utils/number/range'
  import { fnRef } from '@/utils/ref'
  import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
  import ViewObserver from '../Misc/view-observer.vue'

  // TODO: use svg instead of html elements for animation

  let observer: ResizeObserver | undefined
  const speed = ref(2)
  const root = ref<HTMLElement>()
  const properties = withDefaults(
    defineProps<{
      value?: number
      size?: number | string
    }>(),
    {
      value: Infinity,
      size: 4
    }
  )
  const md3 = inject('md3', false)
  const noSpace = computed(() => properties.value <= 0)

  function setSpeed() {
    const rect = root.value!.getBoundingClientRect()
    const value = rect.width / 400
    speed.value = clamp(value, 2, 10)
  }

  onMounted(() => {
    setSpeed()
    observer = new ResizeObserver(setSpeed)
    observer.observe(root.value!)
  })

  onBeforeUnmount(() => {
    observer?.disconnect?.()
    observer = undefined
  })

  const setRef = fnRef(root)
  defineOptions({ name: 'MdLinearProgress' })
</script>

<template>
  <ViewObserver
    :ref="setRef"
    apply="animate"
    class="md-progress"
    :class="{ md3, noSpace }"
    :style="{
      height: getCSSValue(size),
      '--speed': addUnit(speed, 's')
    }"
  >
    <div class="md-progress-infinite" v-if="value === Infinity">
      <div class="md-progress-infinite-bar" v-if="md3" />
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
    background: var(--surface-container);
    overflow: hidden;
    width: 100%;

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

      &::before {
        transition: left 0.25s var(--timing-standard);
        will-change: left;
      }
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
          top: 0;
          bottom: 0;
          height: inherit;
          background: var(--secondary-container);
          will-change: left, right;
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
        position: absolute;
        content: '';
        top: 0;
        bottom: 0;
        height: inherit;
        background: var(--primary);
        will-change: left, right;
      }

      &::before {
        animation: infinite-load infinite var(--speed) linear;
      }

      &::after {
        animation: infinite-load-2 infinite var(--speed) linear;
      }
    }

    &.md3 {
      background-color: transparent;
      border-radius: var(--md);

      .md-progress-bar {
        border-radius: inherit;

        &::before,
        &::after {
          position: absolute;
          border-radius: inherit;
          content: '';
          top: 0;
          right: 0;
          height: inherit;
        }

        &::before {
          background: var(--secondary-container);
          left: calc(var(--value) * 1% + var(--xxs));
        }

        &::after {
          aspect-ratio: 1;
          max-height: var(--xxs);
          background: var(--primary);
        }
      }

      &.no-space .md-progress-bar::before {
        left: 0;
      }

      .md-progress-infinite {
        border-radius: inherit;

        &::before,
        &::after {
          border-radius: inherit;
        }
      }
    }
  }
</style>
