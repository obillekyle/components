<script setup lang="ts">
  import { mapNumberToRange } from '@/utils/number/range'
  import { inject, ref } from 'vue'

  defineProps<{
    headline?: string
  }>()

  const scroll = inject('scroll-container', ref({ x: 0, y: 0 }))
  defineOptions({ name: 'MdTopAppBar' })
</script>

<template>
  <header
    class="md-header"
    :style="`--opacity: ${mapNumberToRange(scroll.y, 48, 80, 0, 1)}`"
  >
    <slot />
    <div v-if="headline" class="md-header-title">
      {{ headline }}
    </div>
    <div class="md-header-actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </header>
  <div class="md-header-content">
    <slot name="content" :headline>
      <div
        v-if="headline"
        class="md-header-headline"
        :style="`opacity: ${1 - mapNumberToRange(scroll.y, 0, 40, 0, 1)}`"
      >
        {{ headline }}
      </div>
    </slot>
  </div>
</template>

<style lang="scss">
  .md-header {
    top: 0;
    display: flex;
    align-items: center;
    position: sticky;
    z-index: 100;
    min-height: var(--header-size);

    &-title {
      transition: color 0.2s;
      font-size: var(--font-xl);
      opacity: var(--opacity);

      &:first-child {
        padding-left: var(--md);
      }
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: var(--surface-container);
      opacity: var(--opacity);
    }

    &-content {
      padding: var(--md);
      font-size: var(--component-sm);
    }

    &-actions {
      position: absolute;
      background-color: inherit;
      display: flex;
      align-items: center;
      right: 0;
    }
  }
</style>
