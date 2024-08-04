<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import Box from '../Box/box.vue'
  import { getBoxProps, type BoxProps } from '../Box/util'

  interface CardBodyProps
    extends BoxProps,
      /* @vue-ignore */ HTMLAttributes {}

  defineOptions({ name: 'MdCardBody' })
  const props = defineProps<CardBodyProps>()
  const boxProps = getBoxProps(props)
</script>

<template>
  <Box v-bind="boxProps" class="md-card-body">
    <slot />
  </Box>
</template>
