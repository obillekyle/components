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

  interface ChipProps
    extends BoxProps,
      /* @vue-ignore */ ButtonHTMLAttributes {
    leftIcon?: Component | string
    rightIcon?: Component | string
    label?: Component | string
    variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
    scale?: number
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
    :class="variant ?? 'filled'"
    @click="rippleEffect"
    @pointerdown="rippleEffect"
    @keydown="keyClick($event, ['Enter', ' '])"
    :styled="{ $scale: 'raw:' + (scale ?? 1), ...styled }"
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
