<script setup lang="ts">
  import '@/assets/button.scss'
  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { BoxProps } from '../Box/util'

  import { rippleEffect } from '@/utils/dom/ripple'
  import { getBoxProps } from '../Box/util'

  import Box from '../Box/box.vue'
  import IconOrComponent from '../Misc/icon-or-component.vue'

  interface ButtonProps
    extends BoxProps,
      /* @vue-ignore */ ButtonHTMLAttributes {
    leftIcon?: string | Component
    rightIcon?: string | Component
    variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
    label?: string | Component
  }

  defineOptions({ name: 'MdButton' })
  const props = defineProps<ButtonProps>()
  const boxProps = getBoxProps(props, {
    r: '#rounded'
  })
</script>

<template>
  <Box
    as="button"
    type="button"
    class="md-button"
    v-bind="boxProps"
    :class="variant ?? 'filled'"
    @pointerdown="rippleEffect"
  >
    <IconOrComponent class="md-button-icon left" :icon="leftIcon" />
    <div class="md-button-label">
      <slot>
        <template v-if="typeof label == 'string'">{{ label }}</template>
        <component v-else :is="label ?? 'div'" />
      </slot>
    </div>
    <IconOrComponent class="md-button-icon right" :icon="rightIcon" />
  </Box>
</template>
