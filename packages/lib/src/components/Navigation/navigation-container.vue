<script setup lang="ts">
  interface NavigationContainerProps {
    center?: boolean
  }

  defineProps<NavigationContainerProps>()
  defineOptions({ name: 'MdNavigationContainer' })
</script>

<template>
  <div class="md-navbar-container" v-if="center">
    <slot />
  </div>
  <slot v-else />
</template>
