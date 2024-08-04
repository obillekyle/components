<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { SizesString } from '@/utils/css'
  import type { HTMLAttributes } from 'vue'

  import { getCSSValue } from '@/utils/css'
  import Box from '../box.vue'
  import { getBoxProps as getBoxProperties } from '../util'

  interface FlexBoxProperties
    extends BoxProps,
      /** @vue-ignore */ HTMLAttributes {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    align?: 'start' | 'center' | 'end'
    justify?: 'start' | 'center' | 'end'
    wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'

    gap?: SizesString
  }

  defineOptions({ name: 'MdFlexBox' })
  const props = defineProps<FlexBoxProperties>()
  const boxProps = getBoxProperties(props)
</script>

<template>
  <Box
    class="md-flex"
    v-bind="boxProps"
    :style="{
      flexDirection: props.direction,
      justifyContent: props.justify,
      alignItems: props.align,
      flexWrap: props.wrap,
      gap: getCSSValue(props.gap)
    }"
  >
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-flex {
    display: flex;

    > .md-flex-span,
    > [span] {
      flex: 1 1 auto;
    }
  }
</style>
