<script setup lang="ts">
  import '@/assets/button.scss'

  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { BoxProps } from '../Box/util'

  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'
  import { useAttrs } from 'vue'
  import { getBoxProps } from '../Box/util'

  import Box from '../Box/box.vue'
  import HybridComponent from '../Misc/hybrid-component.vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface ChipProps
    extends BoxProps,
      /* @vue-ignore */ ButtonHTMLAttributes {
    leftIcon?: Component | string
    rightIcon?: Component | string
    label?: Component | string
    variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
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

  defineOptions({ name: 'MdChip' })
  const props = defineProps<ChipProps>()
  const boxProps = getBoxProps(props, {
    r: '#xs'
  })
</script>

<template>
  <Box
    as="button"
    type="button"
    class="md-chip"
    v-bind="boxProps"
    :v-bind="$attrs"
    :class="variant ?? 'filled'"
    @click="rippleHandler($event, 'onClick')"
    @pointerdown="rippleHandler($event, 'onPointerdown')"
    @keydown="keyHandler($event, 'onKeydown')"
  >
    <HybridIcon class="md-chip-icon left" :icon="leftIcon" />
    <div class="md-chip-label">
      <slot>
        <HybridComponent :as="label" />
      </slot>
    </div>
    <HybridIcon class="md-chip-icon right" :icon="rightIcon" />
  </Box>
</template>
