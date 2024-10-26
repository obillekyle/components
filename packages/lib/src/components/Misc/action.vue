<script setup lang="ts">
  import type { Component } from 'vue'

  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'

  import HybridComponent from './hybrid-component.vue'

  interface ActionProps {
    disabled?: boolean
    label?: string | Component
  }

  defineProps<ActionProps>()
  defineOptions({ name: 'MdAction' })
</script>

<template>
  <button
    type="button"
    class="md-action"
    @keydown="keyClick($event, ['Enter', ' '])"
    @click="rippleEffect($event, '.md-action-indicator')"
    @pointerdown="rippleEffect($event, '.md-action-indicator')"
    :disabled="disabled || undefined"
  >
    <div class="md-action-indicator">
      <slot />
    </div>

    <div class="md-action-label">
      <slot name="label">
        <HybridComponent :as="label" />
      </slot>
    </div>
  </button>
</template>

<style lang="scss">
  .md-action {
    padding: 0;
    font: inherit;
    color: currentcolor;
    border: none;
    outline: none;
    background: none;
    display: flex;
    align-items: center;
    height: var(--component-md);
    cursor: pointer;
    -webkit-tap-highlight-color: #0000;

    &-indicator {
      position: relative;
      overflow: hidden;
      display: grid;
      place-items: center;
      width: var(--component-sm);
      aspect-ratio: 1;
      flex: 0 0 auto;
      margin: var(--xxs);
      border-radius: 50%;
      transition: background-color 0.15s;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: var(--on-surface);
        opacity: 0;
        transition: opacity 0.15s;
      }
    }

    &-label {
      flex: 1 1 auto;
      margin-inline-start: var(--sm);

      &:empty {
        display: none;
      }
    }

    &:has(&-label:empty) {
      display: inline-flex;
      vertical-align: top;
      aspect-ratio: 1;
    }

    &[disabled] {
      filter: grayscale(1);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    &:hover &-indicator::after {
      opacity: 0.08;
    }

    &:focus-visible &-indicator {
      outline: 2px solid var(--primary);
    }

    &:focus-visible &-indicator::after {
      opacity: 0.08;
    }
  }
</style>
