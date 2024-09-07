<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'
  import type { ButtonHTMLAttributes, Component } from 'vue'

  import { getCSSValue } from '@/utils/css/sizes'
  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'

  import HybridIcon from '../Misc/hybrid-icon.vue'

  interface IconButtonProperties
    extends /* @vue-ignore */ ButtonHTMLAttributes {
    size?: SizesString
    selected?: boolean
    icon: string | Component
    variant?: 'filled' | 'tonal' | 'outlined' | 'standard'
  }

  defineProps<IconButtonProperties>()
  defineOptions({ name: 'MdIconButton', inheritAttrs: false })
</script>

<template>
  <button
    type="button"
    class="md-icon-button"
    v-bind="$attrs"
    @click="rippleEffect($event, 'div')"
    @pointerdown="rippleEffect($event, 'div')"
    @keydown="keyClick($event, ['Enter', ' '])"
  >
    <div
      class="md-icon-button-wrapper"
      :class="{ selected, [variant ?? 'standard']: true }"
    >
      <HybridIcon
        :icon="icon"
        :style="{ fontSize: getCSSValue(size ?? '#md', 'px', 'icon') }"
      />
    </div>
  </button>
</template>

<style lang="scss">
  .md-icon-button {
    padding: 0;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    vertical-align: top;
    display: inline-grid;
    place-items: center;
    width: var(--component-md);
    height: var(--component-md);
    -webkit-tap-highlight-color: #0000;

    &-wrapper {
      display: grid;
      place-items: center;
      place-content: center;
      position: relative;
      overflow: hidden;
      border-radius: 999px;
      pointer-events: none;
      width: var(--component-sm);
      height: var(--component-sm);
      transition: background-color 0.2s;

      > * {
        pointer-events: none;
      }

      &.filled {
        background: var(--surface-container-highest);
        color: var(--primary);

        &.selected {
          background: var(--primary);
          color: var(--on-primary);
        }
      }

      &.tonal {
        background: var(--surface-container-highest);
        color: var(--on-surface-variant);

        &.selected {
          background: var(--secondary-container);
          color: var(--on-secondary-container);
        }
      }

      &.outlined {
        background: transparent;
        box-shadow: 0 0 0 1px var(--outline);
        color: var(--on-surface-variant);

        &.selected {
          background: var(--inverse-surface);
          color: var(--inverse-on-surface);
          box-shadow: none;
        }
      }

      &.standard {
        background: transparent;
        color: var(--on-surface-variant);

        &.selected {
          color: var(--primary);
        }
      }
    }

    &:focus-visible &-wrapper {
      outline: 2px dashed var(--primary);
    }

    &-wrapper::after {
      content: '';
      inset: 0;
      opacity: 0;
      position: absolute;
      transition: opacity 0.2s;
      background: var(--on-surface);
    }

    &:hover &-wrapper::after {
      opacity: 0.08;
    }

    &:disabled &-wrapper {
      opacity: 0.5;
      background: var(--surface-container);
      filter: grayscale(1);
      cursor: not-allowed;
    }
  }
</style>
