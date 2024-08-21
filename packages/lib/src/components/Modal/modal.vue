<script setup lang="ts">
  import Box from '../Box/box.vue'

  defineOptions({ name: 'MdModal' })
</script>

<template>
  <Box class="md-modal">
    <slot />
  </Box>
</template>
