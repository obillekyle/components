<script setup lang="ts">
  import { Box, fnRef } from '@vue-material/core'
  import { ref } from 'vue'

  const root = ref<HTMLElement>()
  const setRef = fnRef(root)

  function changeText() {
    if (!root.value) return
    root.value.innerHTML = 'Hello World!'
  }
</script>

<template>
  <Box :ref="setRef" @click="changeText"> Click me </Box>
</template>
