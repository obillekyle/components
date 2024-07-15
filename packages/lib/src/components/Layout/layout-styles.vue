<script setup lang="ts">
  import type { SizesObject } from './util'

  import { DefaultLayoutOptions as DLO, getShades, getSizes } from './util'
  import { inject, onBeforeMount, onMounted, ref, watch } from 'vue'
  import { getCSSColor, getCSSValue } from '@/utils/css'
  import { dummyRef } from '@/utils/ref'

  interface LayoutStylesProps {
    globalStyle?: boolean
    name?: string
  }

  defineProps<LayoutStylesProps>()
  defineOptions({ name: 'MdLayoutStyles' })

  const contentColor = ref('')
  const contentSizes = ref('')
  const isClient = ref(false)
  const layoutId = inject('layout-id', dummyRef(''))!
  const options = inject('options', dummyRef(DLO))!

  function setColors() {
    setTimeout(() => {
      const values: Record<string, string> = {}
      const theme = options.value.theme
      const colors = options.value.colors as Record<string, string>

      for (const color in colors) {
        Object.assign(values, getShades(colors[color], color, theme))
      }

      let value = ''
      for (const key in values) {
        value += `--${key}: ${values[key]};`
      }

      contentColor.value = value
    })
  }

  function setSizes() {
    setTimeout(() => {
      const values: Record<string, string> = {}
      const sizes = options.value.sizes as Record<string, SizesObject>
      const components = options.value.component as Record<string, string>

      for (const size in sizes) {
        Object.assign(values, getSizes(sizes[size], size))
      }

      for (const component in components) {
        values[component + '-size'] = getCSSValue(
          components[component],
          'px',
          'size'
        )
      }

      let value = ''
      for (const key in values) {
        value += `--${key}: ${values[key]};`
      }

      contentSizes.value = value
    })
  }

  function setStyle() {
    setColors()
    setSizes()
  }

  onBeforeMount(setStyle)
  onMounted(() => (isClient.value = true))
  watch(() => JSON.stringify(options.value.sizes), setSizes)
  watch(() => JSON.stringify(options.value.colors), setColors)
  watch(() => JSON.stringify(options.value.component), setSizes)
  watch(() => options.value.theme, setColors)
</script>

<template>
  <component :is="'style'" v-if="isClient">{{
    `${globalStyle ? 'html, body' : '#' + (name ?? layoutId)} {
      ${contentSizes} ${contentColor}
      color: ${getCSSColor(options.color)};
      color-scheme: ${options.theme};
      font-family: ${options.fontFamily}
    }`
  }}</component>
  <template v-else />

  <template v-if="contentSizes && contentColor">
    <div :id="name" v-if="name">
      <slot />
    </div>
    <slot v-else />
  </template>
</template>
