<script setup lang="ts">
  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { AppSizes } from '@/utils/css'

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

<style lang="scss" scoped>
  .md-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--xs);
    height: var(--component-md);
    width: max-content;
    position: relative;
    min-width: var(--component-md);
    border-radius: var(--radius);
    overflow: hidden;
    border: none;
    font: inherit;
    font-weight: 500;
    color: var(--on-primary);
    background: var(--primary);
    padding-inline: var(--sm);
    box-shadow: var(--shadow-2);
    transition:
      color 0.2s,
      background-color 0.2s,
      filter 0.2s,
      box-shadow 0.2s;

    &:not(:disabled) {
      cursor: pointer;
    }

    &:active {
      opacity: 0.8;
    }

    &:disabled {
      background-color: var(--mono-30-50) !important;
      color: var(--mono-50) !important;
    }

    &:not(:has(.md-button-icon.left)) {
      padding-inline-start: var(--md);
    }

    &:not(:has(.md-button-icon.right)) {
      padding-inline-end: var(--md);
    }

    &:not(:disabled):hover {
      filter: brightness(1.2);
    }

    .md-button-icon {
      display: grid;
      width: max-content;
      place-items: center;
    }

    &.outline,
    &.transparent,
    &.subtle {
      color: var(--primary-80);
      box-shadow: none;
    }

    &.outline {
      border: 1px solid var(--primary-60-50);
    }

    &.subtle {
      background: var(--primary-50-20);
    }

    &.transparent,
    &.outline {
      background: none;

      &:hover {
        background: var(--primary-40-20);
      }
    }

    &.inverted {
      color: var(--primary-90);
      background: var(--primary-20);

      &:hover {
        filter: brightness(0.8);
      }

      &:disabled {
        background-color: var(--mono-80-50) !important;
        color: var(--mono-60) !important;
      }

      &.outline {
        border: 1px solid var(--primary-20-30);
      }
    }

    .md-button-label {
      align-self: center;
      text-align: center;
      flex-grow: 1;

      &:empty::before {
        content: '•••';
        color: transparent;
      }
    }
  }
</style>
