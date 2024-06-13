<script setup lang="ts">
  import type { ButtonHTMLAttributes, Component } from 'vue'
  import type { AppSizes } from '@/utils/css'

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
    radius: 'rounded'
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

<style lang="scss" scoped>
  .md-chip {
    position: relative;
    overflow: hidden;
    user-select: none;
    display: inline-flex;
    align-items: center;
    width: fit-content;
    border-radius: var(--radius);
    height: var(--size-xs);
    gap: var(--xs);
    border: none;
    font: inherit;
    font-weight: 500;
    color: var(--on-primary);
    background: var(--primary);
    padding-inline: var(--sm);
    box-shadow: var(--shadow-1);
    transition:
      filter 0.2s,
      background-color 0.2s;

    &:hover {
      filter: brightness(1.2);
    }

    .md-chip-label {
      align-self: center;
      text-align: center;
      flex-grow: 1;
    }

    .md-chip-icon {
      display: grid;
      place-items: center;
    }

    &:active {
      opacity: 0.8;
    }

    &:not(:disabled) {
      cursor: pointer;
    }

    &.outline,
    &.transparent,
    &.subtle {
      color: var(--primary-80);
      box-shadow: none;
    }

    &:disabled {
      background-color: var(--mono-30-50) !important;
      color: var(--mono-50) !important;
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
  }
</style>
