<script setup lang="ts">
  import { addPX, getCSSValue } from '@/utils/css'

  withDefaults(
    defineProps<{
      label?: string
      direction?: 'x' | 'y'
      size?: number | string
      margin?: 'sm' | 'md' | 'lg' | 'xl' | String
    }>(),
    {
      direction: 'x',
      margin: 'md',
      size: '100%'
    }
  )

  defineOptions({
    name: 'MdDivider'
  })
</script>

<template>
  <div v-if="label && direction == 'x'" class="divider-label">
    {{ label }}
  </div>
  <div
    v-else
    :class="{
      divider: true,
      [direction]: true
    }"
    :style="{
      '--size': addPX(size),
      '--margin': getCSSValue(margin)
    }"
  />
</template>

<style lang="scss">
  .divider {
    place-self: center;
    display: block;
    background-color: var(--mono-50-50);
  }

  .divider.x {
    height: 1px;
    width: var(--size);
    margin-block: var(--margin);
  }

  .divider.y {
    width: 1px;
    height: var(--size);
    margin-inline: var(--margin);
  }

  .divider-label {
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
