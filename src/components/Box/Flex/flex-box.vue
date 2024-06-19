<script setup lang="ts">
  import { computed, type HTMLAttributes } from 'vue'
  import type { BoxProps } from '@/components/Box'

  import { getBoxProps } from '../util'
  import Box from '../box.vue'

  interface FlexBoxProps extends BoxProps, /** @vue-ignore */ HTMLAttributes {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  }

  const props = defineProps<FlexBoxProps>()
  const boxProps = computed(() => getBoxProps(props))
</script>

<template>
  <Box
    class="md-flexbox"
    v-bind="boxProps"
    :style="{
      flexDirection: props.direction,
      justifyContent: props.justify,
      alignItems: props.align,
      flexWrap: props.wrap
    }"
  >
  </Box>
</template>

<style lang="scss">
  .md-flexbox {
    display: flex;
  }
</style>
