<script setup lang="ts">
  import type { SizesString } from '@/utils/css'
  import type { ButtonHTMLAttributes } from 'vue'

  import { getCSSValue } from '@/utils/css'
  import { rippleEffect } from '@/utils/dom'
  import { Icon } from '@iconify/vue'

  interface IconButtonProperties
    extends /* @vue-ignore */ ButtonHTMLAttributes {
    icon: string
    size?: SizesString
    selected?: boolean
    variant?: 'filled' | 'tonal' | 'outlined' | 'standard'
  }

  defineProps<IconButtonProperties>()
  defineOptions({ name: 'MdIconButton' })
</script>

<template>
  <button
    type="button"
    class="md-icon-button"
    @pointerdown="rippleEffect($event, '.md-icon-button-wrapper')"
  >
    <div
      class="md-icon-button-wrapper"
      :class="{ selected, [variant ?? 'standard']: true }"
    >
      <Icon
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
    display: inline-block;
    width: var(--component-md);
    height: var(--component-md);
    -webkit-tap-highlight-color: transparent;

    &-wrapper {
      display: grid;
      place-items: center;
      place-content: center;
      position: relative;
      overflow: hidden;
      margin: var(--xxs);
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
