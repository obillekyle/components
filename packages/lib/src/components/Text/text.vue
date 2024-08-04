<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { SizeType } from '@/utils/css'
  import type { HTMLAttributes } from 'vue'
  import type { TextProps as TextProperties } from './util'

  import Box from '@/components/Box/box.vue'
  import { getBoxProps } from '@/components/Box/util'
  import { getCSSValue } from '@/utils/css'

  interface Properties
    extends BoxProps,
      TextProperties,
      /** @vue-ignore */ HTMLAttributes {
    color?: string
    size?: SizeType
    weight?: number
    italic?: boolean
    spacing?: number
    lines?: number
    lineHeight?: number | string
    wrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
    textAlign?: 'left' | 'center' | 'right'
  }

  defineOptions({ name: 'MdText' })
  const props = defineProps<Properties>()
  const boxProps = getBoxProps(props)
</script>

<template>
  <Box
    exclude
    class="md-text"
    v-bind="boxProps"
    :as="props.as || 'p'"
    :style="{
      color,
      textAlign,
      lineHeight,
      fontWeight: weight,
      textWrap: wrap ?? null,
      fontStyle: italic ? 'italic' : null,
      fontSize: getCSSValue(size, 'px', 'font'),
      letterSpacing: getCSSValue(spacing, 'px', 'padding'),
      '--lines': lines || 'none'
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
