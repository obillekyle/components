<script setup lang="ts">
  import { exclude, getCSSValue, type AppSizesString } from '@/utils'
  import type { BoxProps } from '@/utils/types'
  import { computed, type HTMLAttributes } from 'vue'
  import Box from '../Box/box.vue'

  interface TextProps extends BoxProps, /** @vue-ignore */ HTMLAttributes {
    comp?: string
    color?: string
    size?: AppSizesString
    weight?: number
    italic?: boolean
    spacing?: number
  }

  const props = withDefaults(defineProps<TextProps>(), {
    comp: 'span',
    size: 'md',
    color: 'currentColor',
    weight: 400
  })

  const boxProps = computed(() =>
    exclude(props, ['size', 'weight', 'italic', 'spacing'])
  )

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
      fontWeight: weight,
      fontStyle: italic ? 'italic' : null,
      fontSize: getCSSValue(size, 'px', 'font'),
      letterSpacing: getCSSValue(spacing, 'px', 'padding')
    }"
  >
    <slot />
  </Box>
</template>
