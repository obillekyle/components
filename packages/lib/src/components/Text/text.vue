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

  .md-text[href] {
    color: var(--primary);
    font-weight: 500;
  }

  .md-text[href^='http']::after {
    --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5 17.59L15.59 7H9V5h10v10h-2V8.41L6.41 19z'/%3E%3C/svg%3E");

    content: '';
    display: inline-block;
    width: 1.1em;
    height: 1.1em;
    vertical-align: text-bottom;
    background: currentcolor;
    mask-image: var(--svg);
    mask-repeat: no-repeat;
  }
</style>
