<script setup lang="ts">
  import { inject, type Ref } from 'vue'

  const scrollHeight = inject<Ref<number>>('content-scroll-top')!
  const headerTitle = inject<Ref<string>>('header-title')!

  defineOptions({
    name: 'MdHeader'
  })
</script>

<template>
  <div
    class="md-header"
    :class="{ 'on-top': scrollHeight < 6, 'has-title': headerTitle }"
  >
    <slot />
    <div class="md-header-title" v-if="headerTitle">{{ headerTitle }}</div>
    <div class="md-header-actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .md-header {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    padding-inline: var(--sm);
    height: var(--header-size);
    background: var(--background-secondary);

    .md-header-title {
      transition: color 0.2s;
      font-size: var(--font-xl);
    }

    &.on-top {
      background: transparent;

      .md-header-title {
        color: transparent;
      }
    }

    .md-header-actions {
      position: absolute;
      padding-inline: var(--sm);
      background-color: inherit;
      display: flex;
      right: 0;
    }
  }
</style>
