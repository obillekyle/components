<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { TextProps as SharedTextProps } from './util'

  import Box from '@/components/Box/box.vue'
  import { getBoxProps } from '@/components/Box/util'

  interface TextProps extends BoxProps, SharedTextProps {}

  defineOptions({ name: 'MdText' })
  const props = defineProps<TextProps>()
  const boxProps = getBoxProps(props, { as: 'p' })
</script>

<template>
  <Box
    class="md-text"
    v-bind="boxProps"
    :styled="{
      color: props.color,
      textAlign: props.textAlign,
      lineHeight: props.lineHeight,
      fontWeight: props.weight,
      textWrap: props.wrap,
      fontSize: props.size,
      fontStyle: props.italic ? 'italic' : undefined,
      letterSpacing: props.spacing,
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
