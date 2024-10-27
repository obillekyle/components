<script setup lang="ts">
  import type { ColorString } from '@/utils/css/type'
  import type { BoxProps } from '../Box/util'

  import { getCSSColor } from '@/utils/css/color'
  import { computed } from 'vue'
  import { useTheme } from '../ThemeProvider/hook'

  import Colors from '@/utils/colors'
  import Box from '../Box/box.vue'

  interface ColorBlockProps extends /* @vue-ignore */ BoxProps {
    color: ColorString
    text?: ColorString
  }

  const theme = useTheme()

  defineOptions({ name: 'MdColorBlock' })
  const props = defineProps<ColorBlockProps>()

  const color = computed(() => {
    theme.theme // for the computed color to be re-evaluated

    const background = getCSSColor.call(theme, props.color, true)
    const textColor = Colors.isLight(background) ? 'black' : 'white'

    return {
      background,
      color: props.text ? getCSSColor(props.text) : textColor
    }
  })
</script>

<template>
  <Box class="md-color-block" :title="color.background" :style="color">
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-color-block {
    min-width: min-content;
    min-height: fit-content;
    flex-shrink: 0;
    text-wrap: wrap;
    place-items: center;
    display: inline-grid;
    width: var(--size-xs);
    height: var(--size-xs);
    padding: var(--sm);
  }
</style>
