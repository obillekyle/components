<script setup lang="ts">
  import { useToggle } from '@vue-material/core'

  const [value, toggle] = useToggle()
  const [onOff, toggleOnOff] = useToggle('on')
  const [value2, toggle2] = useToggle(0)
</script>

<template>
  <div class="use-toggle">
    <div @click="toggle">Boolean: {{ value }}</div>
    <div @click="toggleOnOff">String: {{ onOff }}</div>
    <div @click="toggle2">Number: {{ value2 }}</div>
  </div>
</template>

<style scoped>
  .use-toggle {
    cursor: pointer;
    user-select: none;
  }
</style>
