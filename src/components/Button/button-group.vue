<script setup lang="ts">
  defineProps<{
    span?: boolean
  }>()
</script>

<template>
  <div class="md-button-group" :class="{ span }">
    <slot />
  </div>
</template>

<style lang="scss">
  .md-button-group {
    display: flex;
    flex-wrap: nowrap;

    > *:not(.md-button) {
      display: none;
    }

    .md-button {
      margin: 0;
      border-radius: 0;
      margin-inline: 0 !important;

      &:not(:last-child) {
        border-right: none;
      }

      &:first-child {
        border-top-left-radius: var(--radius);
        border-bottom-left-radius: var(--radius);
      }

      &:last-child {
        border-top-right-radius: var(--radius);
        border-bottom-right-radius: var(--radius);
      }
    }

    &.span {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));

      .md-button {
        width: 100%;
      }
    }
  }
</style>
