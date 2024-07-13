<script setup lang="ts">
  import '@/assets/button.scss'

  defineProps<{
    span?: boolean
  }>()
</script>

<template>
  <div class="md-button-group" :class="{ span }">
    <slot />
  </div>
</template>
