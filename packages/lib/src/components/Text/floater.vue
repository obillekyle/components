<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'
  import type { Component } from 'vue'

  import HybridComponent from '../Misc/hybrid-component.vue'
  import { createStyle } from '@/utils/create-style'

  type Positions =
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'left'
    | 'right'
    | 'center'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'

  interface FloaterProperties {
    text?: Component | string
    color?: string
    offset?: SizesString
    size?: SizesString
    pos?: Positions
  }

  defineOptions({ name: 'MdFloatingIndicator' })
  const props = defineProps<FloaterProperties>()

  const classes = createStyle(() => ({
    $offset: props.offset || 0,
    background: props.color,
    fontSize: props.size
  }))
</script>

<template>
  <div class="md-floater">
    <div class="md-floater-text" :class="[pos || 'top-right', classes]">
      <HybridComponent :as="text" />
    </div>
    <slot />
  </div>
</template>

<style lang="scss">
  .md-floater {
    position: relative;
    width: max-content;
    height: max-content;

    &-text {
      display: grid;
      position: absolute;
      place-items: center;
      pointer-events: none;
      min-height: var(--md);
      min-width: var(--md);
      padding-inline: var(--xxs);
      border-radius: 999px;
      font-size: var(--font-sm);
      background: var(--primary);
      line-height: 0;
      z-index: 1;
      box-shadow: 0 0 2px var(--shadow-1);
      color: var(--surface);

      &:empty {
        min-height: var(--xs);
        min-width: var(--xs);
        padding-inline: 0;
      }

      &.top {
        top: var(--offset);
        left: 50%;
        transform: translateX(-50%);
      }

      &.left {
        left: var(--offset);
        top: 50%;
        transform: translateY(-50%);
      }

      &.right {
        right: var(--offset);
        top: 50%;
        transform: translateY(-50%);
      }

      &.center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      &.bottom {
        left: 50%;
        bottom: var(--offset);
        transform: translateX(-50%);
      }

      &.top-left {
        top: var(--offset);
        left: var(--offset);
      }

      &.top-right {
        top: var(--offset);
        right: var(--offset);
      }

      &.bottom-left {
        bottom: var(--offset);
        left: var(--offset);
      }

      &.bottom-right {
        bottom: var(--offset);
        right: var(--offset);
      }
    }
  }
</style>
