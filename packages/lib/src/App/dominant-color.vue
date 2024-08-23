<script setup lang="ts">
  import Button from '@/components/Button/button.vue'
  import ColorBlock from '@/components/Misc/color-block.vue'
  import { openFilePickerAsync } from '@/utils/dom/file-picker'
  import { fastAvgColor, getDominantColor } from '@/utils/other'
  import { useLocalStorage } from '@/utils/ref/use-local-storage'

  const color = useLocalStorage('dominant-color', '#ffffff')
  const avg = useLocalStorage('average-color', '#ffffff')

  async function uploadImage() {
    const file = await openFilePickerAsync({ accept: 'image/*' })

    if (!file) return

    color.value = await getDominantColor(file)
    avg.value = await fastAvgColor(file)
  }
</script>

<template>
  <Button
    left-icon="material-symbols:image-outline-sharp"
    @click="uploadImage"
  >
    Upload Image, {{ color }}
  </Button>
  <ColorBlock :color />
  <ColorBlock :color="avg" />
</template>
