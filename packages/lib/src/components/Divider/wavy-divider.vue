<script setup lang="ts">
  import Box from '@/components/Box/box.vue'
  import type { BoxProps } from '@/components/Box/util'
  import { getBoxProps } from '@/components/Box/util'
  import { getCSSColor, type ColorString } from '@/utils/css'

  interface WavyDividerProperties extends BoxProps {
    color?: ColorString
  }

  defineOptions({ name: 'MdWavyDivider' })
  const props = defineProps<WavyDividerProperties>()
  // @ts-ignore
  const boxProps = getBoxProps(props, {
    my: '#lg',
    p: '#md'
  })
</script>

<template>
  <Box
    class="md-wavy-divider"
    v-bind="boxProps"
    :style="{ color: getCSSColor(color ?? '') }"
  >
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

      <rect width="100%" height="100%" fill="url(#squiggle)" />
    </svg>
  </Box>
</template>

<style lang="scss" scoped>
  .md-wavy-divider {
    width: 100%;
    color: var(--surface-container-highest);
  }
</style>
