<script setup lang="ts">
  import '@/assets/layout.scss'

  import type { BoxProps } from '../Box'
  import type { ThemeObject, ThemeProps } from './types'

  import { ColorEngine } from '@/utils/color-engine'
  import { parseColors } from '@/utils/colors/parse-colors'
  import { getCSSColor } from '@/utils/css/color'
  import { createStyle } from '@/utils/create-style'
  import { getCSSValue } from '@/utils/css/sizes'
  import { mergeObject, shallowMerge } from '@/utils/object/merge'
  import { provide, shallowRef, watch } from 'vue'
  import { DefaultThemeObject as DTO } from './defaults'
  import { getSizes } from './util'

  import Box from '../Box/box.vue'
  import { useTheme } from './hook'

  interface ThemeProviderProps
    extends /* @vue-ignore */ BoxProps,
      ThemeProps {}

  defineOptions({ name: 'MdLayoutStyles' })
  const props = defineProps<ThemeProviderProps>()

  const parentOptions = useTheme()
  const themeOptions = shallowRef<ThemeObject>(getThemeObject())

  function getThemeObject() {
    const defs = props.inherit ? parentOptions : DTO
    const opts = Object.assign({}, defs, props.options)

    const opts_: Record<string, any> = {
      theme: opts.theme,
      color: getCSSColor(opts.color),
      colors: parseColors(opts.colors),
      sizes: opts.sizes,
      component: opts.component,
      fontFamily: opts.fontFamily,
      other: opts.other
    }

    if (props.inherit) {
      opts_.sizes = mergeObject(defs.sizes, opts_.sizes)
      opts_.colors = shallowMerge(defs.colors, opts_.colors)
      opts_.component = shallowMerge(defs.component, opts_.component)
      opts_.other = shallowMerge(defs.other, opts_.other)
    }

    const engine = new ColorEngine(opts_.colors)
    opts_.colors = shallowMerge(engine.colors, {
      $vars: engine.getColorVariables(opts_.theme),
      $shades: engine.getShades(opts_.theme)
    })

    return opts_ as ThemeObject
  }

  const className = createStyle(
    () => {
      const { theme, colors, sizes, component, color, fontFamily } =
        themeOptions.value

      let values: Map<string, string> = new Map([
        ...Object.entries(colors.$vars),
        ...(props.extras ? colors.$shades : []),
        ...Object.entries(component).map<[string, string]>(
          ([key, value]) => [key + '-size', getCSSValue(value)]
        ),
        ...Object.entries(sizes).flatMap(([size, value]) =>
          Object.entries(getSizes(value, size))
        )
      ])

      const object = Object.fromEntries(
        [...values.entries()].map(([key, value]) => ['$' + key, value])
      )

      return Object.assign(object, {
        colorScheme: theme,
        fontFamily: fontFamily,
        color: getCSSColor(color)
      })
    },
    { prefix: 'md-theme-', resolveVars: false }
  )

  function updateThemeObject() {
    themeOptions.value = getThemeObject()
  }

  watch(props, updateThemeObject)
  watch(parentOptions, () => props.inherit && updateThemeObject())
  provide('theme-options', themeOptions)
</script>

<template>
  <Box class="md-theme-provider" :class="className">
    <slot />
  </Box>
</template>
