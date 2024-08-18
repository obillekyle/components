<script setup lang="ts">
  import type { SizesString } from '@vue-material/core'
  import Box from '@vue-material/core/Box'

  defineProps<{
    height?: SizesString
  }>()
</script>

<template>
  <Box class="preview-frame" :height="height || 300">
    <slot />
  </Box>
</template>
