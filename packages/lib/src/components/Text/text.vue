<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { TextProps as SharedTextProps } from './util'

  import Box from '@/components/Box/box.vue'
  import { getBoxProps } from '@/components/Box/util'

  interface TextProps extends BoxProps, SharedTextProps {
    lines?: number | (string & {}) | 'auto'
  }

  defineOptions({ name: 'MdText' })
  const props = defineProps<TextProps>()
  const boxProps = getBoxProps(props, { as: 'p' })
</script>

<template>
  <Box
    class="md-text"
    v-bind="boxProps"
    :styled="{
      $lines: 'raw:' + lines,

      color,
      textAlign,
      lineHeight,
      fontWeight: weight,
      textWrap: wrap,
      fontSize: size,
      fontStyle: italic ? 'italic' : undefined,
      letterSpacing: spacing,
      ...styled
    }"
  >
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-text {
    display: -webkit-box;
    line-clamp: var(--lines);
    -webkit-line-clamp: var(--lines);
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
