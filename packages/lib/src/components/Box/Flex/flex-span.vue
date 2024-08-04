<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import type { BoxProps as BoxProperties } from '../util'

  interface FlexSpanProperties
    extends BoxProperties,
      /** @vue-ignore */ HTMLAttributes {}

  defineProps<FlexSpanProperties>()
  defineOptions({ name: 'MdFlexSpan' })
</script>

<template>
  <Box class="md-flex-span" v-bind="$props">
    <slot />
  </Box>
</template>
