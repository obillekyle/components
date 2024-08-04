<script setup lang="ts">
  import { TextInput, useLocalStorage } from '@vue-material/core'
  const text = useLocalStorage('text', 'Hello World!')
</script>

<template>
  <TextInput
    span
    v-model="text"
    placeholder="Enter some text and reload"
    variant="outlined"
  />
</template>
