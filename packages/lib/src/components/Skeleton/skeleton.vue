<script setup lang="ts">
  import type { BoxProps } from '../Box/util'

  import Box from '@/components/Box/box.vue'

  defineOptions({ name: 'MdSkeleton' })
  defineProps</* @vue-ignore */ BoxProps>()
</script>

<template>
  <Box class="md-skeleton"> <slot /> </Box>
</template>

<style lang="scss">
  .md-skeleton {
    overflow: hidden;
    position: relative;
    color: transparent;
    user-select: none;
    pointer-events: none;
    border-radius: var(--xs);
    background: var(--surface-container-highest);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0.3;
      background: linear-gradient(90deg, #0000, var(--on-surface), #0000);
      animation: slide 1.5s infinite ease-in-out;
      translate: -100% 0;
    }

    @keyframes slide {
      from {
        translate: -100% 0;
      }

      to {
        translate: 100% 0;
      }
    }

    > * {
      opacity: 0;
    }
  }
</style>
