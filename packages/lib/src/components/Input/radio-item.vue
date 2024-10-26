<script setup lang="ts">
  import type { Component } from 'vue'

  import { ref, inject, computed } from 'vue'
  import HybridComponent from '../Misc/hybrid-component.vue'
  import Action from '../Misc/action.vue'

  interface RadioProps {
    label?: string | Component
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
  <Action
    class="md-radio"
    :active="active || undefined"
    @click="value && (radio = value)"
  >
    <div class="md-radio-indicator" />
    <template #label>
      <slot>
        <HybridComponent :as="label" />
      </slot>
    </template>
  </Action>
</template>

<style lang="scss">
  .md-radio {
    &-indicator {
      --size: var(--font-xl);
      --color: var(--outline);

      display: grid;
      place-items: center;
      position: absolute;
      inset: 0;

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
        width: var(--size);
        box-shadow: 0 0 0 2px inset var(--color);
      }

      &::after {
        width: 0;
        background: var(--color);
      }
    }

    &[active] &-indicator {
      --color: var(--primary);

      &::after {
        width: calc(var(--size) * 0.5);
      }
    }

    &[disabled] {
      filter: grayscale(1);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
    }
  }
</style>
