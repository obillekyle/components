<script setup lang="ts">
  import '@/assets/button.scss'
  import type { ButtonHTMLAttributes, Component } from 'vue'

  import IconOrComponent from '@/components/Misc/icon-or-component.vue'
  import { rippleEffect } from '@/utils/dom'
  import Box from '../Box/box.vue'
  import { getBoxProps, type BoxProps } from '../Box/util'

  interface ChipProps
    extends BoxProps,
      /* @vue-ignore */ ButtonHTMLAttributes {
    leftIcon?: Component | string
    rightIcon?: Component | string
    label?: string
    variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
  }

  defineOptions({ name: 'MdChip' })
  const props = defineProps<ChipProps>()
  const boxProps = getBoxProps(props)
</script>

<template>
  <Box
    as="button"
    type="button"
    class="md-chip"
    v-bind="boxProps"
    :class="variant ?? 'filled'"
    @pointerdown="rippleEffect"
  >
    <IconOrComponent class="md-chip-icon left" :icon="leftIcon" />
    <div class="md-chip-label">
      <slot>{{ label }}</slot>
    </div>
    <IconOrComponent class="md-chip-icon right" :icon="rightIcon" />
  </Box>
</template>
