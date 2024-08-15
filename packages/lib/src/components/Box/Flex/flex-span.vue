<script setup lang="ts">
  import type { BoxProps } from '../util'

  import Box from '../box.vue'

  interface FlexSpanProps extends /* @vue-ignore */ BoxProps {}
  defineProps<FlexSpanProps>()
  defineOptions({ name: 'MdFlexSpan' })
</script>

<template>
  <Box class="md-flex-span">
    <MdFlexSpan />
    <slot />
  </Box>
</template>
