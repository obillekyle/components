<script setup lang="ts">
  import type { BoxProps } from '../Box/util'

  import Box from '../Box/box.vue'

  interface CardHeadProps extends /* @vue-ignore */ BoxProps {
    header?: string
    subheader?: string
  }

  defineOptions({ name: 'MdCardHead' })
  defineProps<CardHeadProps>()
</script>

<template>
  <Box class="md-card-head">
    <h2 class="md-card-title" v-text="header" />
    <p class="md-card-subhead" v-text="subheader" />
    <div class="md-card-head-content">
      <slot />
    </div>
  </Box>
</template>
