<script setup lang="ts">
  import type { SizesString } from '@/utils'
  import type { BoxProps } from '../Box/util'
  import type { FrameVariants } from './variants'

  import { getBoxProps } from '../Box/util'
  import { toSvgMask } from './util'
  import { frames } from './variants'

  import Box from '../Box/box.vue'

  interface FrameProps extends Omit<BoxProps, 'width' | 'height'> {
    size?: SizesString
    frame?: FrameVariants | 'none'
    theme?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'none'
  }

  defineOptions({ name: 'MdFrame' })
  const props = withDefaults(defineProps<FrameProps>(), {
    size: 96,
    frame: 'none',
    theme: 'none'
  })

  const boxProps = getBoxProps(props)
</script>

<template>
  <Box
    class="md-frame"
    v-bind="boxProps"
    :theme
    :styled="{
      width: props.size,
      maskImage:
        props.frame in frames
          ? toSvgMask(48, frames[props.frame as FrameVariants])
          : 'none',
      ...styled
    }"
  >
    <slot />
  </Box>
</template>

<style lang="scss">
  .md-frame {
    display: grid;
    place-items: center;
    aspect-ratio: 1;

    &[theme='none'] {
      border-radius: var(--xs);
      background: var(--surface-container-highest);
      color: var(--on-surface);
    }

    &[theme='primary'] {
      background: var(--primary);
      color: var(--on-primary);
    }

    &[theme='secondary'] {
      background: var(--secondary);
      color: var(--on-secondary);
    }

    &[theme='tertiary'] {
      background: var(--tertiary);
      color: var(--on-tertiary);
    }

    &[theme='error'] {
      background: var(--error);
      color: var(--on-error);
    }
  }
</style>
