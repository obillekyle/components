<script setup lang="ts">
  import { getCSSValue, type AppSizesString } from '@/utils/css'

  interface DividerProps {
    label?: string
    direction?: 'x' | 'y'
    size?: AppSizesString
    margin?: AppSizesString
  }

  defineProps<DividerProps>()
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
    background-color: var(--mono-50-50);

    .x {
      height: 1px;
      width: var(--size);
      margin-block: var(--margin);
    }

    .y {
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
      background-color: var(--primary-60-20);
    }
  }
</style>
