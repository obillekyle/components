<script setup lang="ts">
  import type { BoxProps } from '@/components/Box'
  import Box, { getBoxProps } from '@/components/Box'
  import { computed } from 'vue'

  const props = defineProps<
    BoxProps & {
      color?: string
    }
  >()
  const boxProps = computed(() =>
    getBoxProps(props, {
      my: 'lg',
      p: 'md'
    })
  )
</script>

<template>
  <Box class="wavy-divider" v-bind="boxProps" :style="{ color }">
    <svg
      width="100%"
      height="12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        id="squiggle"
        width="36"
        height="12"
        patternUnits="userSpaceOnUse"
      >
        <g clip-path="url(#clip0_1_8)">
          <path
            d="M0 1.55556C9 1.55556 9 10.4444 18 10.4444C27 10.4444 27 1.55556 36 1.55556"
            stroke="currentColor"
            stroke-width="2"
          />
        </g>
      </pattern>

      <rect width="100%" height="100%" fill="url(#squiggle)"></rect>
    </svg>
  </Box>
</template>

<style lang="scss" scoped>
  .wavy-divider {
    width: 100%;
    color: var(--primary-30-50);
  }
</style>
