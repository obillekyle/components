<script setup lang="ts">
  import {
    Layout,
    useLocalStorage,
    ImagePalette,
    clamp,
    ModalProvider
  } from '@vue-material/core'

  import MdWidgetWrapper from './components/widget-wrapper.vue'
  import { onMounted, ref, computed, watch } from 'vue'

  defineOptions({ name: 'MdWallpaper' })

  const ready = ref(false)
  const active = useLocalStorage('wallpaper', 0)
  const colorFromWallpaper = ref('#ffffff')
  const themeColor = useLocalStorage('theme-color', '')

  let wallpapers = ref(['https://picsum.photos/1920/1080?random=1'])

  async function getWallpaperColor() {
    if (!ready.value) return
    const id = clamp(active.value, 0, wallpapers.value.length - 1)
    const url = wallpapers.value[id]

    const palette = await ImagePalette.from(url)
    colorFromWallpaper.value = palette.dominant
  }

  onMounted(async () => {
    const req = await fetch('/wallpapers.json')

    if (req.ok) wallpapers.value = await req.json()

    ready.value = true

    getWallpaperColor()
  })

  const wallpaper = computed(() => {
    const id = clamp(active.value, 0, wallpapers.value.length - 1)
    const url = wallpapers.value[id]

    return {
      url: url,
      color: themeColor.value || colorFromWallpaper.value || '#ffffff'
    }
  })

  watch(active, getWallpaperColor)
</script>

<template>
  <Layout
    :options="{
      colors: wallpaper.color
    }"
    :styled="{
      background: `url(${wallpaper.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }"
  >
    <ModalProvider>
      <MdWidgetWrapper />
    </ModalProvider>
  </Layout>
</template>
