<script setup lang="ts">
  import type { ImgHTMLAttributes } from 'vue'
  import Box from '../Box/box.vue'
  import { getBoxProps, type BoxProps } from '../Box/util'

  interface CardImageProps
    extends BoxProps,
      /* @vue-ignore */ Omit<ImgHTMLAttributes, 'width' | 'height'> {}

  defineOptions({ name: 'MdCardImage' })
  const props = defineProps<CardImageProps>()
  const boxProps = getBoxProps(props, { as: 'img' })
</script>

<template>
  <Box v-bind="boxProps" class="md-card-image" />
</template>
