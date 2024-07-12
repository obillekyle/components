<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import type { BoxProps } from '../util'

  interface FlexSpanProps
    extends BoxProps,
      /** @vue-ignore */ HTMLAttributes {}

  defineProps<FlexSpanProps>()
</script>

<template>
  <Box class="md-flex-span" v-bind="$props">
    <slot />
  </Box>
</template>
