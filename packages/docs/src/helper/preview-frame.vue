<script setup lang="ts">
  import type { SizesString } from '@vue-material/core'
  import Box from '@vue-material/core/Box'

  withDefaults(
    defineProps<{
      height?: SizesString
    }>(),
    {
      height: 300
    }
  )
</script>

<template>
  <Box class="preview-frame" :height>
    <slot />
  </Box>
</template>
