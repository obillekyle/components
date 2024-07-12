<script setup lang="ts">
  defineProps<{
    center?: boolean
  }>()

  defineOptions({
    name: 'MdNavigationContainer'
  })
</script>

<template>
  <div class="md-navbar-container" v-if="center">
    <slot />
  </div>
  <slot v-else />
</template>
