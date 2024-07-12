<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'

  interface NavigationContentProps
    extends /* @vue-ignore */ HTMLAttributes {}

  defineProps<NavigationContentProps>()

  defineOptions({
    name: 'MdNavigationContent'
  })
</script>

<template>
  <div class="md-navbar-content">
    <slot />
  </div>
</template>

<style lang="scss">
  .md-navbar-content {
    align-self: center;
  }

  .md-navbar-item + .md-navbar-content {
    margin-top: auto;
    padding-block: var(--sm);
  }
</style>
