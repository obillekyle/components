<script setup lang="ts">
  import '@/assets/button.scss'

  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { BoxProps } from '../Box/util'

  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'
  import { getBoxProps } from '../Box/util'

  import Box from '../Box/box.vue'
  import HybridComponent from '../Misc/hybrid-component.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'

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
    :class="variant ?? 'filled'"
    @click="rippleEffect"
    v-bind="boxProps"
    @pointerdown="rippleEffect"
    @keydown="keyClick($event, ['Enter', ' '])"
  >
    <HybridIcon class="md-button-icon left" :icon="leftIcon" />
    <div class="md-button-label">
      <slot>
        <HybridComponent :as="label" />
      </slot>
    </div>
    <HybridIcon class="md-button-icon right" :icon="rightIcon" />
  </Box>
</template>
