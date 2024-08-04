<script setup lang="ts">
  import type { ColorString } from '@/utils/css'
  import { getCSSColor } from '@/utils/css'
  import { computed } from 'vue'
  import type { BoxProps as BoxProperties } from '../Box'
  import Box from '../Box/box.vue'
  import { getBoxProps } from '../Box/util'

  interface ColorBlockProps extends BoxProperties {
    color: ColorString
    text?: ColorString
  }

  defineOptions({ name: 'MdColorBlock' })
  const props = defineProps<ColorBlockProps>()

  // @ts-ignore
  const boxProps = getBoxProps(props, {
    width: '#size-xs',
    height: '#size-xs',
    p: '#sm'
  })

  const color = computed(() => ({
    background: getCSSColor(props.color),
    color: getCSSColor(props.text ?? 'currentcolor')
  }))
</script>

<template>
  <Box
    class="md-color-block"
    v-bind="boxProps"
    :title="color.background"
    :style="color"
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
