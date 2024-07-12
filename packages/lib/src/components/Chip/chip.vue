<script setup lang="ts">
  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { AppSizes } from '@/utils/css'
  import '@/assets/button.scss'

  import IconOrComponent from '../Misc/icon-or-component.vue'
  import { rippleEffect } from '@/utils/dom'
  import { getCSSValue } from '@/utils/css'

  interface ChipProps extends /* @vue-ignore */ ButtonHTMLAttributes {
    leftIcon?: Component | string
    rightIcon?: Component | string
    label?: string
    variant?: 'filled' | 'outline' | 'subtle' | 'transparent'
    radius?: AppSizes | number | 'rounded' | String
  }

  withDefaults(defineProps<ChipProps>(), {
    radius: 'xs'
  })

  defineOptions({
    name: 'MdChip'
  })
</script>

<template>
  <button
    :class="['md-chip', variant]"
    :style="{ '--radius': getCSSValue(radius) }"
    @pointerdown="rippleEffect"
  >
    <IconOrComponent class="md-chip-icon left" :icon="leftIcon" />
    <div class="md-chip-label">
      <slot>{{ label }}</slot>
    </div>
    <IconOrComponent class="md-chip-icon right" :icon="rightIcon" />
  </button>
</template>

<style lang="scss">
  .md-chip {
    height: var(--size-xs);
    padding-inline: var(--xs);
  }
</style>
