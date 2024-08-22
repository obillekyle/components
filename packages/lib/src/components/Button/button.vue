<script setup lang="ts">
  import '@/assets/button.scss'
  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { BoxProps } from '../Box/util'

  import { rippleEffect } from '@/utils/dom/ripple'
  import { getBoxProps } from '../Box/util'

  import { keyClick } from '@/utils/dom/events'
  import { useAttrs } from 'vue'
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

  const attrs: Record<string, any> = useAttrs()

  function rippleHandler(event: MouseEvent, propKey: string) {
    rippleEffect(event)
    typeof attrs[propKey] === 'function' && attrs[propKey](event)
  }

  function keyHandler(event: KeyboardEvent, propKey: string) {
    keyClick(event, ['Enter', ' '])
    typeof attrs[propKey] === 'function' && attrs[propKey](event)
  }

  defineOptions({ name: 'MdButton', inheritAttrs: false })
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
    v-bind="{ ...boxProps, ...$attrs }"
    @keydown="keyHandler($event, 'onKeydown')"
    @click="rippleHandler($event, 'onClick')"
    @pointerdown="rippleHandler($event, 'onPointerdown')"
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
