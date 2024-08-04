<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import Box from '../Box/box.vue'
  import { getBoxProps, type BoxProps } from '../Box/util'

  interface CardHeadProps
    extends BoxProps,
      /* @vue-ignore */ HTMLAttributes {
    header?: string
    subheader?: string
  }

  defineOptions({ name: 'MdCardHead' })
  const props = defineProps<CardHeadProps>()
  const boxProps = getBoxProps(props)
</script>

<template>
  <Box v-bind="boxProps" class="md-card-head">
    <h2 class="md-card-title" v-text="header" />
    <p class="md-card-subhead" v-text="subheader" />
    <div class="md-card-head-content">
      <slot />
    </div>
  </Box>
</template>
