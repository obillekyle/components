<script setup lang="ts">
  import type { BoxProps } from '@/components/Box'
  import type { AppSizesString } from '@/utils/css'
  import type { HTMLAttributes } from 'vue'
  import type { TextProps } from './util'

  import { getCSSValue } from '@/utils'
  import { computed } from 'vue'
  import Box, { getBoxProps } from '@/components/Box'

  interface Props
    extends BoxProps,
      TextProps,
      /** @vue-ignore */ HTMLAttributes {
    color?: string
    size?: AppSizesString
    weight?: number
    italic?: boolean
    spacing?: number
    lines?: number
    lineHeight?: number | string
    wrap?: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
    textAlign?: 'left' | 'center' | 'right'
  }

  const props = defineProps<Props>()
  const boxProps = computed(() => getBoxProps(props))

  defineOptions({
    name: 'MdText'
  })
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
