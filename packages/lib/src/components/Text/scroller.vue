<script setup lang="ts">
  import { useRect } from '@/ref'
  import { addPX, addUnit } from '@/utils/css'
  import { computed, ref, type HTMLAttributes } from 'vue'
  import ViewObserver from '../Misc/view-observer.vue'

  interface ScrollerProperties extends /* @vue-ignore */ HTMLAttributes {
    speed?: number
    spacing?: number
    continuous?: boolean
  }

  const props = withDefaults(defineProps<ScrollerProperties>(), {
    speed: 24
  })

  const wrapper = ref<HTMLDivElement>()
  const content = ref<HTMLDivElement>()

  const wRect = useRect(wrapper)
  const cRect = useRect(content, false)

  const options = computed(() => {
    if (!wRect.ready || !cRect.ready) {
      return { cloned: false, spacing: 0, speed: 0 }
    }

    const cloned = wRect.width < cRect.width
    const spacing = props.spacing ?? wRect.width / 2
    const speed = (cRect.width + spacing) / props.speed

    return {
      cloned,
      spacing: addPX(spacing),
      speed: addUnit(speed.toFixed(2), 's')
    }
  })

  defineOptions({ name: 'MdScroller' })
</script>

<template>
  <ViewObserver
    apply="scroll"
    class="md-scroller"
    :class="{ cloned: options.cloned, continuous }"
    :style="{
      '--spacing': options.spacing,
      '--speed': options.speed
    }"
  >
    <div class="md-scroller-wrapper" ref="wrapper">
      <div class="md-scroller-content" ref="content">
        <slot />
      </div>
      <div class="md-scroller-content" v-if="options.cloned">
        <slot />
      </div>
    </div>
  </ViewObserver>
</template>

<style lang="scss">
  .md-scroller {
    display: grid;
    overflow: hidden;
    margin-left: calc(-1 * var(--md));

    &-wrapper {
      height: 100%;
      position: relative;
      display: flex;
      padding-left: var(--md);
      overflow: hidden;
    }

    &-content {
      height: 100%;
      position: relative;
      width: max-content;
      text-wrap: nowrap;
    }

    &:not(.scroll) * {
      animation-play-state: paused !important;
    }

    &.cloned {
      .md-scroller-content {
        padding-right: var(--spacing);
        animation: scroll var(--speed) linear infinite;
      }

      &.continuous {
        .md-scroller-content {
          animation: scroll-continuous var(--speed) linear infinite;
        }
      }

      &:hover {
        .md-scroller-content {
          animation-play-state: paused;
        }
      }

      .md-scroller-wrapper {
        mask-image: linear-gradient(
          to left,
          #0000 0%,
          #000 var(--md),
          #000 calc(100% - var(--md)),
          #0000 100%
        );
      }
    }

    @keyframes scroll {
      0% {
        transform: translateX(0);
      }

      25% {
        transform: translateX(0);
      }

      100% {
        transform: translateX(-100%);
      }
    }

    @keyframes scroll-continuous {
      0% {
        transform: translateX(0);
      }

      100% {
        transform: translateX(-100%);
      }
    }
  }
</style>
