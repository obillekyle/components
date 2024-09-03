<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'
  import type { Component } from 'vue'

  import Box from '../Box/box.vue'
  import HybridComponent from '../Misc/hybrid-component.vue'

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
  withDefaults(defineProps<FloaterProperties>(), {
    color: '$error',
    offset: 0,
    size: '#font-xs',
    pos: 'top-right'
  })
</script>

<template>
  <div class="md-floater">
    <Box
      v-if="text"
      class="md-floater-text"
      :class="pos"
      :styled="{
        $offset: offset,
        background: color,
        fontSize: size
      }"
    >
      <HybridComponent :as="text" />
    </Box>
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
      border-radius: 999px;
      line-height: 0;
      z-index: 1;
      box-shadow: 0 0 2px var(--shadow-1);
      color: var(--surface);

      &:empty {
        min-height: var(--xxs);
        min-width: var(--xxs);
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
