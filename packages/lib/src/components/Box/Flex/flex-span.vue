<script setup lang="ts">
  import type { BoxProps as BoxProperties } from '../util'

  import Box from '../box.vue'

  interface FlexSpanProperties extends /* @vue-ignore */ BoxProperties {}
  defineProps<FlexSpanProperties>()
  defineOptions({ name: 'MdFlexSpan' })
</script>

<template>
  <Box class="md-flex-span">
    <MdFlexSpan />
    <slot />
  </Box>
</template>
