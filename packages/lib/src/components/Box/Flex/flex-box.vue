<script setup lang="ts">
  import type { BoxProps } from '@/components/Box/util'
  import type { SizesString } from '@/utils/css/type'

  import { getBoxProps } from '../util'

  import Box from '../box.vue'

  interface FlexBoxProps extends BoxProps {
    direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
    align?: 'start' | 'center' | 'end' | (string & {})
    justify?: 'start' | 'center' | 'end' | (string & {})
    wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
    gap?: SizesString
  }

  defineOptions({ name: 'MdFlexBox' })
  const props = defineProps<FlexBoxProps>()
  const boxProps = getBoxProps(props)
</script>

<template>
  <Box
    class="md-flex"
    v-bind="boxProps"
    :styled="{
      flexDirection: props.direction,
      justifyContent: props.justify,
      alignItems: props.align,
      flexWrap: props.wrap,
      gap: props.gap,
      ...styled
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
