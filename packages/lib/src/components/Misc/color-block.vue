<script setup lang="ts">
  import type { AppColorString } from '@/utils/css'
  import type { BoxProps } from '../Box'
  import { getCSSColor } from '@/utils/css'
  import { ref, computed } from 'vue'
  import { getBoxProps } from '../Box/util'
  import Box from '../Box/box.vue'

  interface ColorBlockProps extends BoxProps {
    color: AppColorString
  }

  const element = ref<HTMLElement>()
  const props = defineProps<ColorBlockProps>()
  const boxProps = computed(() =>
    getBoxProps(props, {
      width: 'size-xs',
      height: 'size-xs'
    })
  )

  const color = computed(() => ({ background: getCSSColor(props.color) }))
  defineOptions({ name: 'MdColorBlock' })
</script>

<template>
  <Box
    class="md-color-block"
    ref="element"
    :title="color.background"
    v-bind="boxProps"
    :style="color"
  />
</template>

<style lang="scss">
  .md-color-block {
    display: inline-block;
  }
</style>
