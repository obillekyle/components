<script setup lang="ts">
  import { inject, ref } from 'vue'

  const scrollHeight = inject('content-scroll-top', ref(0))
  const headerTitle = inject('header-title', ref(''))

  defineOptions({
    name: 'MdTopAppBar'
  })
</script>

<template>
  <header
    class="md-header"
    :class="{ 'on-top': scrollHeight < 6, 'has-title': headerTitle }"
  >
    <slot />
    <div class="md-header-title" v-if="headerTitle">
      {{ headerTitle }}
    </div>
    <div class="md-header-actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style lang="scss">
  .md-header {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
    height: var(--header-size);
    background: var(--surface-container);

    &-title {
      transition: color 0.2s;
      font-size: var(--font-xl);

      &:first-child {
        padding-left: var(--md);
      }
    }

    &.on-top {
      background: transparent;

      .md-header-title {
        color: transparent;
      }
    }

    &-actions {
      position: absolute;
      background-color: inherit;
      display: flex;
      right: 0;
    }
  }
</style>
