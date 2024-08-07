<script setup lang="ts">
  import { addPX, addUnit } from '@/utils/css'
  import { onMounted, ref, type HTMLAttributes } from 'vue'
  import ViewObserver from '../Misc/view-observer.vue'

  interface ScrollerProperties extends /* @vue-ignore */ HTMLAttributes {
    speed?: number
    spacing?: number
    continuous?: boolean
  }

  const properties = withDefaults(defineProps<ScrollerProperties>(), {
    speed: 24
  })

  const cloned = ref(false)
  const wrapper = ref<HTMLDivElement>()
  const content = ref<HTMLDivElement>()

  function setScroll() {
    cloned.value = false
    setTimeout(() => {
      if (wrapper.value && content.value) {
        const wRect = wrapper.value.getBoundingClientRect()
        const cRect = content.value.getBoundingClientRect()

        const spacing = properties.spacing ?? wRect.width / 2
        cloned.value = wRect.width < content.value.offsetWidth
        const speed = (cRect.width + spacing) / properties.speed
        wrapper.value.style.setProperty('--spacing', addPX(spacing))
        wrapper.value.style.setProperty(
          '--speed',
          addUnit(speed.toFixed(2), 's')
        )
      }
    })
  }

  defineOptions({ name: 'MdScroller' })

  onMounted(() => {
    setScroll()

    const observer = new ResizeObserver(setScroll)
    observer.observe(wrapper.value!)
    observer.observe(content.value!)
  })
</script>

<template>
  <ViewObserver
    apply="scroll"
    class="md-scroller"
    :class="{ cloned, continuous }"
  >
    <div class="md-scroller-wrapper" ref="wrapper">
      <div class="md-scroller-content" ref="content">
        <slot />
      </div>
      <div class="md-scroller-content" v-if="cloned">
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
