<script setup lang="ts">
  import { Button, ThemeProvider } from '@vue-material/core'
  import { computed, ref } from 'vue'

  const light = ref(true)
  const theme = computed(() => (light.value ? 'light' : 'dark'))
</script>

<template>
  <ThemeProvider class="theme-provider" :options="{ theme }">
    <Button @click="light = !light">
      Look, it's a {{ theme }} theme button!
    </Button>
  </ThemeProvider>
</template>

<style scoped>
  .theme-provider {
    padding: var(--xl);
    background-color: var(--surface);
    color: var(--on-surface);
  }
</style>
