<script setup lang="ts">
  import { Box, customRef } from '@vue-material/core'

  const [root, setRef] = customRef<HTMLElement>()
  const [text, setText] = customRef('Click me!')

  function changeText() {
    if (!root.value) return

    root.value.style.color = 'green'
    setText('Hello World!')
  }
</script>

<template>
  <Box :ref="setRef" @click="changeText"> {{ text }} </Box>
</template>
