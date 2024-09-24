<script setup lang="ts">
  import type { BoxProps } from '../Box/util'

  import Box from '../Box/box.vue'

  defineOptions({ name: 'MdCardBody' })
  defineProps</* @vue-ignore */ BoxProps>()
</script>

<template>
  <Box class="md-card-body">
    <slot />
  </Box>
</template>
