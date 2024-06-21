<script setup lang="ts">
  import { getCSSColor, getCSSValue, type AppSizesString } from '@/utils/css'
  import type { Component } from 'vue'

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

  interface FloaterProps {
    text?: Component | string
    color?: string
    offset?: AppSizesString
    size?: AppSizesString
    pos?: Positions
  }

  defineOptions({
    name: 'MdFloatingIndicator'
  })

  withDefaults(defineProps<FloaterProps>(), {
    color: 'primary-200',
    offset: 0,
    size: 'xxs',
    pos: 'top-right'
  })
</script>

<template>
  <div class="md-floater">
    <div
      class="md-floater-text"
      :class="pos"
      :style="{
        '--offset': getCSSValue(offset),
        background: getCSSColor(color),
        fontSize: getCSSValue(size, 'px', 'font')
      }"
    >
      <span v-if="typeof text == 'string'">{{ text }}</span>
      <component v-else :is="text" />
    </div>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .md-floater {
    position: relative;
    width: max-content;
    height: max-content;

    .md-floater-text {
      display: flex;
      position: absolute;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      padding: 1px 3px;
      border-radius: 999px;
      z-index: 1;
      box-shadow: 0 0 2px var(--mono-60);
      font-size: var(--sm);

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
