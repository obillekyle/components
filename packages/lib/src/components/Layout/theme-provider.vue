<script setup lang="ts">
  import '@/assets/layout.scss'

  import type { BoxProps } from '../Box'
  import type { ThemeObject, ThemeProps } from './util'

  import { ColorEngine } from '@/utils/color-engine'
  import { parseColors } from '@/utils/colors'
  import { getCSSColor, getCSSValue } from '@/utils/css'
  import { $ } from '@/utils/dom'
  import { hashStr, toKebabCase } from '@/utils/string'
  import {
    computed,
    inject,
    onBeforeMount,
    onUnmounted,
    provide,
    ref,
    watch
  } from 'vue'
  import { DefaultThemeObject as DTO, getSizes } from './util'

  import deepmerge from 'deepmerge'
  import Box from '../Box/box.vue'

  interface ThemeProviderProps
    extends /* @vue-ignore */ BoxProps,
      ThemeProps {
    name?: string
  }

  defineOptions({ name: 'MdLayoutStyles' })
  const props = withDefaults(defineProps<ThemeProviderProps>(), {
    md3: true
  })

  const parentOptions = inject('options', ref(DTO))

  const themeOptions = computed(() => {
    const defs: any = props.inherit ? parentOptions.value : DTO
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
      opts_.sizes = deepmerge(defs.sizes, opts_.sizes)
      opts_.colors = Object.assign({}, defs.colors, opts_.colors)
      opts_.component = Object.assign({}, defs.component, opts_.component)
      opts_.other = Object.assign({}, defs.other, opts_.other)
    }

    const engine = new ColorEngine(opts_.colors)
    opts_.colors = Object.assign({}, engine.colors, {
      $vars: engine.getColorVariables()
    })

    return opts_ as ThemeObject
  })

  const styleId = computed(() => {
    return props.name
      ? toKebabCase(props.name)
      : 'md' + hashStr(JSON.stringify(themeOptions.value), 7)
  })

  function setColors() {
    let value = ''
    const values: Record<string, string> = {}
    const theme = themeOptions.value.theme
    const colors = themeOptions.value.colors
    const colorEngine = new ColorEngine(colors)

    Object.assign(values, colorEngine.getShades(theme))
    Object.assign(values, colorEngine.getColorVariables(theme))

    for (const key in values) {
      value += `--${toKebabCase(key)}: ${values[key]};`
    }

    return value
  }

  function setSizes() {
    let value = ''
    const values: Record<string, string> = {}
    const sizes = themeOptions.value.sizes as any
    const components = themeOptions.value.component as any

    for (const size in sizes) {
      Object.assign(values, getSizes(sizes[size], size))
    }

    for (const id in components) {
      values[`${id}-size`] = getCSSValue(components[id], 'px', 'size')
    }

    for (const key in values) {
      value += `--${toKebabCase(key)}: ${values[key]};`
    }

    return value
  }

  function dismount(id: string) {
    const styleOld = $(`style[for=${id}]`)

    if (styleOld) {
      const count = Number(styleOld.dataset.count || 0) - 1

      if (count <= 0) styleOld.remove()
      else styleOld.dataset.count = String(count)
    }
  }

  function mountStyle(id: string) {
    const styleNew = $(`style[for=${id}]`)

    if (styleNew) {
      const count = Number(styleNew.dataset.count || 0) + 1
      styleNew.dataset.count = String(count)
    } else {
      const style = document.createElement('style')
      style.setAttribute('for', id)
      style.dataset.count = '1'

      const colors = setColors()
      const sizes = setSizes()
      const { color, theme, fontFamily } = themeOptions.value

      const value = `
        ${props.global ? 'html, body' : '#' + styleId.value} {
        ${sizes} ${colors}
        color: ${getCSSColor(color)};
        color-scheme: ${theme};
        font-family: ${fontFamily}
      }`

      style.innerHTML = value
      document.head.append(style)
    }
  }

  function setStyle(newId: string, oldId?: string) {
    if (typeof window === 'undefined') return

    if (oldId) dismount(oldId)
    mountStyle(newId)
  }

  watch(styleId, setStyle)
  onBeforeMount(() => setStyle(styleId.value))
  onUnmounted(() => dismount(styleId.value))
  provide('options', themeOptions)
  provide('md3', props.md3)
</script>

<template>
  <Box class="md-theme-provider" :id="styleId">
    <slot />
  </Box>
</template>
