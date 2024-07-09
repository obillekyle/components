<script setup lang="ts">
  import type { Component, Ref } from 'vue'

  import { keyboardClick, rippleEffect } from '@/utils/dom'
  import { inject, type ButtonHTMLAttributes } from 'vue'
  import IconOrComponent from '../Misc/icon-or-component.vue'

  interface FabProps extends /* @vue-ignore */ ButtonHTMLAttributes {
    icon?: string | Component
  }
  const scrollTop = inject<Ref<number>>('content-scroll-top')!
  defineProps<FabProps>()

  defineOptions({
    name: 'MdFloatingActionButton'
  })
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

<style lang="scss" scoped>
  .md-fab {
    position: absolute;
    bottom: var(--padding-md);
    right: var(--padding-md);
    padding-inline: var(--padding-md);
    height: var(--fab-size);
    border-radius: var(--padding-md);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--primary-container);
    color: var(--on-primary-container);
    box-shadow: var(--shadow-3);
    outline: none;
    border: none;
    z-index: 10;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;

    .md-fab-label {
      max-width: 0;
      opacity: 0;
      font-size: var(--font-md);
      transition: all 0.2s var(--timing-standard);
    }

    &.on-top .md-fab-label {
      opacity: 1;
      padding-left: var(--padding-sm);
      max-width: 300px;
    }
  }
</style>
