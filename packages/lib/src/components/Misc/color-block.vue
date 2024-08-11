<script setup lang="ts">
  import { getCSSColor, type ColorString } from '@/utils/css'
  import type { BoxProps } from '../Box'
  import { getBoxProps } from '../Box/util'

  import Box from '../Box/box.vue'

  interface ColorBlockProps extends BoxProps {
    color: ColorString
    text?: ColorString
  }

  defineOptions({ name: 'MdColorBlock' })
  const props = defineProps<ColorBlockProps>()

  const boxProps = getBoxProps(props, {
    width: '#size-xs',
    height: '#size-xs',
    p: '#sm'
  })
</script>

<template>
  <Box
    class="md-color-block"
    v-bind="boxProps"
    :title="color"
    :style="{
      background: getCSSColor(color),
      color: getCSSColor(text ?? 'currentColor')
    }"
  >
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-color-block {
    min-width: min-content;
    min-height: fit-content;
    flex-shrink: 0;
    text-wrap: wrap;
    display: inline-block;
  }
</style>
