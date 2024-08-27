<script setup lang="ts">
  import '@/assets/layout.scss'

  import type { BoxProps } from '../Box'
  import type { ThemeObject, ThemeProps } from './util'

  import { ColorEngine } from '@/utils/color-engine'
  import { parseColors } from '@/utils/colors/parse-colors'
  import { getCSSColor } from '@/utils/css/color'
  import { createStyle } from '@/utils/css/create-style'
  import { getCSSValue } from '@/utils/css/sizes'
  import { mergeObject } from '@/utils/object/merge'
  import { toKebabCase } from '@/utils/string/cases'
  import { inject, provide, shallowRef, watch } from 'vue'
  import { DefaultThemeObject as DTO, getSizes } from './util'

  import Box from '../Box/box.vue'

  interface ThemeProviderProps
    extends /* @vue-ignore */ BoxProps,
      ThemeProps {}

  defineOptions({ name: 'MdLayoutStyles' })
  const props = defineProps<ThemeProviderProps>()

  const parentOptions = inject('options', shallowRef(DTO))
  const themeOptions = shallowRef<ThemeObject>(getThemeObject())

  function getThemeObject() {
    const defs = props.inherit ? parentOptions.value : DTO
    const opts = Object.assign({}, defs, props.options)
    const opts_: Record<string, any> = {}

    opts_.theme = opts.theme
    opts_.color = getCSSColor(opts.color)
    opts_.colors = parseColors(opts.colors)
    opts_.sizes = opts.sizes
    opts_.component = opts.component
    opts_.fontFamily = opts.fontFamily
    opts_.other = opts.other

    if (props.inherit) {
      opts_.sizes = mergeObject(defs.sizes, opts_.sizes)
      opts_.colors = Object.assign({}, defs.colors, opts_.colors)
      opts_.component = Object.assign({}, defs.component, opts_.component)
      opts_.other = Object.assign({}, defs.other, opts_.other)
    }

    const engine = new ColorEngine(opts_.colors)
    opts_.colors = Object.assign({}, engine.colors, {
      $vars: engine.getColorVariables()
    })

    return opts_ as ThemeObject
  }

  const className = createStyle(
    () => {
      let values: Record<string, string> = {}
      const theme = themeOptions.value.theme
      const colors = themeOptions.value.colors
      const colorEngine = new ColorEngine(colors)
      const sizes: any = themeOptions.value.sizes
      const components: any = themeOptions.value.component

      Object.assign(values, colorEngine.getShades(theme))
      Object.assign(values, colorEngine.getColorVariables(theme))

      for (const size in sizes) {
        Object.assign(values, getSizes(sizes[size], size))
      }

      for (const id in components) {
        values[`${id}-size`] = getCSSValue(components[id], 'px', 'size')
      }

      values = Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
          return ['$' + toKebabCase(key), value]
        })
      )

      const { color, fontFamily } = themeOptions.value

      return Object.assign(values, {
        colorScheme: theme,
        color: getCSSColor(color),
        fontFamily: fontFamily
      })
    },
    { prefix: 'md-theme-', resolveVars: false }
  )

  function updateThemeObject() {
    themeOptions.value = getThemeObject()
  }

  watch(props, updateThemeObject)
  watch(parentOptions, () => props.inherit && updateThemeObject())
  provide('options', themeOptions)
</script>

<template>
  <Box class="md-theme-provider" :class="className">
    <slot />
  </Box>
</template>
