<script setup lang="ts">
  import '@/assets/button.scss'
  import type { ButtonHTMLAttributes, Component } from 'vue'

  import HybridIcon from '@/components/Misc/hybrid-icon.vue'
  import { rippleEffect } from '@/utils/dom'
  import Box from '../Box/box.vue'
  import { getBoxProps, type BoxProps } from '../Box/util'
  import HybridComponent from '../Misc/hybrid-component.vue'

  interface ChipProps
    extends BoxProps,
      /* @vue-ignore */ ButtonHTMLAttributes {
    leftIcon?: Component | string
    rightIcon?: Component | string
    label?: Component | string
    variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
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
    @pointerdown="rippleEffect"
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
