<script setup lang="ts">
  import {
    Layout,
    useLocalStorage,
    ImagePalette,
    clamp,
    SheetProvider
  } from '@vue-material/core'

  import MdWidgetWrapper from './components/widget-wrapper.vue'
  import { onMounted, ref, computed, watch, provide } from 'vue'
  import { DEFAULT_WIDGETS } from './defaults'
  import dayjs from 'dayjs'

  defineOptions({ name: 'MdWallpaper' })

  const ready = ref(false)
  const colorFromWallpaper = ref('#ffffff')
  const active = useLocalStorage('wallpaper', 0)
  const themeColor = useLocalStorage('theme-color', '')
  const startTime = dayjs()

  let wallpapers = ref(['https://picsum.photos/1920/1080?random=1'])

  async function getWallpaperColor() {
    if (!ready.value) return
    const id = clamp(active.value, 0, wallpapers.value.length - 1)
    const url = wallpapers.value[id]

    const palette = await ImagePalette.from(url)
    colorFromWallpaper.value = palette.dominant
  }

  const widgets = useLocalStorage('widgets', DEFAULT_WIDGETS)

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

  provide('active', active)
  provide('widgets', widgets)
  provide('wallpapers', wallpapers)
  provide('theme-color', themeColor)
  provide('start-time', startTime)
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
    <SheetProvider>
      <MdWidgetWrapper />
    </SheetProvider>
  </Layout>
</template>

<style>
  :root {
    --taskbar-height: var(--component-lg);
  }
</style>
