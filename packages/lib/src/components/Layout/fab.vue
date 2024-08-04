<script setup lang="ts">
  import type { ButtonHTMLAttributes, Component } from 'vue'

  import { keyboardClick, rippleEffect } from '@/utils/dom'
  import { inject, ref } from 'vue'
  import IconOrComponent from '../Misc/icon-or-component.vue'

  interface FabProperties extends /* @vue-ignore */ ButtonHTMLAttributes {
    icon?: string | Component
  }

  const scrollTop = inject('content-scroll-top', ref(0))

  defineProps<FabProperties>()
  defineOptions({ name: 'MdFloatingActionButton' })
</script>

<template>
  <button
    class="md-fab"
    tabindex="0"
    :class="{ 'on-top': scrollTop < 6 }"
    @pointerdown="rippleEffect"
    @keydown="keyboardClick"
  >
    <IconOrComponent class="md-fab-icon" :icon="icon" />
    <div class="md-fab-label" v-if="$slots.default">
      <slot />
    </div>
  </button>
</template>

<style lang="scss">
  .md-fab {
    position: absolute;
    bottom: var(--md);
    right: var(--md);
    padding-inline: var(--md);
    height: var(--fab-size);
    border-radius: var(--md);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-container);
    color: var(--on-primary-container);
    box-shadow: var(--shadow-3);
    outline: none;
    border: none;
    z-index: 10;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;

    &-label {
      max-width: 0;
      opacity: 0;
      font-size: var(--font-md);
      transition: all 0.2s var(--timing-standard);
    }

    &.on-top .md-fab-label {
      opacity: 1;
      padding-left: var(--sm);
      max-width: 300px;
    }
  }
</style>
