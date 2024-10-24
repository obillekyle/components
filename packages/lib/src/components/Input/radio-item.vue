<script setup lang="ts">
  import type { Component } from 'vue'

  import { keyClick } from '@/utils/dom/events'
  import { rippleEffect } from '@/utils/dom/ripple'

  import { ref, inject, computed } from 'vue'
  import HybridComponent from '../Misc/hybrid-component.vue'

  interface RadioProps {
    label?: string | Component
    disabled?: boolean
    selected?: boolean
    value?: string
  }

  const props = defineProps<RadioProps>()
  const radio = inject('md-radio-active', ref<string>())
  const active = computed(() =>
    props.value ? props.value === radio.value : props.selected
  )

  defineOptions({ name: 'MdRadioItem' })
</script>

<template>
  <div
    tabindex="0"
    class="md-radio"
    :active="active || undefined"
    :disabled="disabled || undefined"
    @click="value && !disabled && (radio = value)"
    @pointerdown="rippleEffect($event, '.md-radio-indicator')"
    @keydown="keyClick"
  >
    <div class="md-radio-indicator" />
    <div class="md-radio-label">
      <slot>
        <HybridComponent :as="label" />
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
  .md-radio {
    display: flex;
    align-items: center;
    width: var(--component-md);
    cursor: pointer;
    aspect-ratio: 1;

    &-indicator {
      --size: var(--component-sm);
      --color: var(--outline);

      overflow: hidden;
      position: relative;
      display: grid;
      flex-grow: 0;
      flex-shrink: 0;
      aspect-ratio: 1;
      width: var(--size);
      margin: var(--xxs);
      place-items: center;
      border-radius: 50%;
      transition: background-color 0.15s;

      &::before,
      &::after {
        position: absolute;
        content: '';
        display: block;
        border-radius: 50%;
        aspect-ratio: 1;
        transition: all 0.15s;
      }

      &::before {
        width: calc(var(--size) / 2);
        box-shadow: 0 0 0 2px inset var(--color);
      }

      &::after {
        width: 0;
        background: var(--color);
      }
    }

    &-label {
      margin-inline-start: var(--sm);

      &:empty {
        display: none;
      }
    }

    &[active] &-indicator {
      --color: var(--primary);

      &::after {
        width: calc(var(--size) / 4);
      }
    }

    &[disabled] {
      filter: grayscale(1);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }

    &:hover &-indicator {
      background: var(--surface-container);
    }
  }
</style>
