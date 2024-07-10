<script setup lang="ts">
  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { AppSizes } from '@/utils/css'
  import '@/assets/button.scss'

  import { getCSSValue } from '@/utils/css'
  import { rippleEffect } from '@/utils/dom'
  import IconOrComponent from '../Misc/icon-or-component.vue'

  interface ButtonProps extends /* @vue-ignore */ ButtonHTMLAttributes {
    leftIcon?: string | Component
    rightIcon?: string | Component
    radius?: AppSizes | 'rounded' | String | number
    variant?: 'filled' | 'outline' | 'transparent' | 'subtle'
    label?: string
  }

  withDefaults(defineProps<ButtonProps>(), {
    radius: 'rounded'
  })

  defineOptions({
    name: 'MdButton'
  })
</script>

<template>
  <button
    type="button"
    class="md-button"
    :class="variant"
    @pointerdown="rippleEffect"
    :style="{ '--radius': getCSSValue(radius) }"
  >
    <IconOrComponent class="md-button-icon left" :icon="leftIcon" />
    <div class="md-button-label">
      <slot>{{ label }}</slot>
    </div>
    <IconOrComponent class="md-button-icon right" :icon="rightIcon" />
  </button>
</template>

<style lang="scss">
  .md-button {
    height: var(--component-md);
    min-width: var(--component-md);
  }
</style>
