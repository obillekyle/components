<script setup lang="ts">
  import { getCSSValue, type SizesString } from '@/utils/css'

  interface DividerProperties {
    label?: string
    direction?: 'x' | 'y'
    size?: SizesString
    margin?: SizesString
  }

  defineProps<DividerProperties>()
  defineOptions({ name: 'MdDivider' })
</script>

<template>
  <div v-if="label && direction != 'x'" class="md-divider-label">
    {{ label }}
  </div>

  <div
    v-else
    class="md-divider"
    :class="direction ?? 'x'"
    :style="{
      '--size': getCSSValue(size ?? '100%'),
      '--margin': getCSSValue(margin)
    }"
  />
</template>

<style lang="scss" scoped>
  .md-divider {
    place-self: center;
    display: block;
    background: var(--outline);
    opacity: 0.5;

    &.x {
      height: 1px;
      width: var(--size);
      margin-block: var(--margin);
    }

    &.y {
      width: 1px;
      height: var(--size);
      margin-inline: var(--margin);
    }
  }

  .md-divider-label {
    align-items: center;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: 'name line';
    gap: var(--sm);
    text-transform: uppercase;
    font-size: var(--font-sm);
    font-weight: 600;
    padding-block: var(--sm);

    &.sticky {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    &::after {
      content: '';
      display: block;
      height: 1px;
      grid-area: line;
      background: var(--outline);
      opacity: 0.5;
    }
  }
</style>
