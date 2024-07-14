<script setup lang="ts">
  import type { Ref } from 'vue'
  import type { LayoutOptions, SizesObject } from './util'

  import { getShades, getSizes } from './util'
  import { inject, onBeforeMount, onMounted, ref, watch } from 'vue'
  import { getCSSColor, getCSSValue } from '@/utils/css'

  interface LayoutStylesProps {
    globalStyle?: boolean
  }

  defineProps<LayoutStylesProps>()
  defineOptions({ name: 'MdLayoutStyles' })

  const contentColor = ref('')
  const contentSizes = ref('')
  const isClient = ref(false)
  const layoutId = inject<Ref<string>>('layout-id')!
  const options = inject<Ref<LayoutOptions>>('options')!

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
    console.log(options.value.sizes)
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
    `${globalStyle ? 'html, body' : '#' + layoutId} {
      ${contentSizes} ${contentColor}
      color: ${getCSSColor(options.color)};
      color-scheme: ${options.theme};
      font-family: ${options.fontFamily}
    }`
  }}</component>
  <template v-else />
  <slot v-if="contentSizes && contentColor" />
</template>
