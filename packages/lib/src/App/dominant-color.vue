<script setup lang="ts">
  import Button from '@/components/Button/button.vue'
  import ColorBlock from '@/components/Misc/color-block.vue'
  import { useLocalStorage } from '@/ref/use-local-storage'
  import { openFilePickerAsync } from '@/utils/dom/file-picker'
  import { fastAvgColor, ImagePalette } from '@/utils/other'

  const color = useLocalStorage('dominant-color', '#ffffff')
  const colors = useLocalStorage<string[]>('dominant-colors', [])
  const avg = useLocalStorage('average-color', '#ffffff')

  async function uploadImage() {
    const file = await openFilePickerAsync({ accept: 'image/*' })

    if (!file) return
    const palette = await ImagePalette.from(file)

    color.value = palette.dominant
    colors.value = palette.top(20)

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

  <div class="flex">
    <ColorBlock v-for="color in colors" :key="color" :color="color">
      {{ color }}
    </ColorBlock>
  </div>
</template>
