<script setup lang="ts">
  import type { BoxProps } from '@/components/Box'
  import type { AppSizesString } from '@/utils/css'
  import type { HTMLAttributes } from 'vue'

  import { getCSSValue } from '@/utils'
  import { computed } from 'vue'
  import Box, { getBoxProps } from '@/components/Box'

  interface TextProps extends BoxProps, /** @vue-ignore */ HTMLAttributes {
    comp?: string
    color?: string
    size?: AppSizesString
    weight?: number
    italic?: boolean
    spacing?: number
    textAlign?: 'left' | 'center' | 'right'
  }

  const props = defineProps<TextProps>()
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
    as="span"
    :style="{
      color,
      textAlign,
      fontWeight: weight,
      fontStyle: italic ? 'italic' : null,
      fontSize: getCSSValue(size, 'px', 'font'),
      letterSpacing: getCSSValue(spacing, 'px', 'padding')
    }"
  >
    <slot />
  </Box>
</template>
