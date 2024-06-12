<script setup lang="ts">
  import { getCSSValue, type AppSizesString } from '@/utils'
  import type { HTMLAttributes } from 'vue'

  interface TextProps extends /** @vue-ignore */ HTMLAttributes {
    comp?: string
    color?: string
    size?: AppSizesString
    weight?: number
    italic?: boolean
    padding?: string | number
    margin?: string | number
  }

  withDefaults(defineProps<TextProps>(), {
    comp: 'span',
    size: 'md',
    color: 'currentColor',
    weight: 400,
    padding: 0,
    margin: 0
  })

  defineOptions({
    name: 'MdText'
  })
</script>

<template>
  <component
    :is="comp"
    :style="{
      color: color,
      fontWeight: weight,
      fontSize: getCSSValue(size, 'px', 'component'),
      fontStyle: italic ? 'italic' : 'normal',
      padding: getCSSValue(padding),
      margin: getCSSValue(margin)
    }"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
