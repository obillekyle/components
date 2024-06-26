<script setup lang="ts">
  import type {
    AppColorVariants,
    AppSizesPrefixes,
    AppSizes
  } from '@/utils/css'
  import type { ComputedRef } from 'vue'
  import type { LayoutOptions, ElementSizes } from './util'

  import ColorsObj, { Colors } from '@/utils/colors'
  import { AppShades } from './util'
  import { inject, onBeforeMount, ref, watch } from 'vue'
  import { addPX, getCSSColor, getCSSValue } from '@/utils/css'

  const props = defineProps<{
    globalStyle?: boolean
  }>()

  const options = inject<ComputedRef<LayoutOptions>>('options')!
  const tag = inject<string>('layout-id')!
  const styleElem = ref('')

  function getShades(color: string | String | Colors, prefix: string) {
    const colors =
      color instanceof Colors ? color : new ColorsObj(color.toString())
    const theme = options.value.theme
    const values: Record<string, string> = {}

    if (theme == 'dark') {
      for (let shade of AppShades) {
        values[prefix + '-' + shade] = colors.shade(shade).hex()

        for (let j = 0; j < 9; j++) {
          const color = colors.shade(shade, (j + 1) * 0.1).hexa()
          values[prefix + '-' + shade + '-' + (j + 1) * 10] = color
        }

        if (shade == 50) {
          const color = colors.shade(55)
          values[prefix] = color.hex()
          values['on-' + prefix] = colors.shade(color.isDark() ? 90 : 10).hex()
        }

        if (shade == 60) {
          const color = colors.shade(60)
          values[prefix + '-container'] = color.hex()
          values['on-' + prefix + '-container'] = colors
            .shade(color.isDark() ? 90 : 10)
            .hex()
        }
      }
    } else {
      for (let shade of AppShades) {
        const shadeValue = Math.abs(100 - shade)

        values[prefix + '-' + shade] = colors.shade(shadeValue, 1, theme).hex()

        for (let j = 0; j < 9; j++) {
          const color = colors.shade(shadeValue, (j + 1) * 0.1, 'light').hexa()
          values[prefix + '-' + shade + '-' + (j + 1) * 10] = color
        }

        if (shade == 50) {
          const color = colors.shade(50, 1, 'light')
          values[prefix] = color.hex()
          values['on-' + prefix] = colors.shade(color.isDark() ? 90 : 10).hex()
        }

        if (shade == 40) {
          const color = colors.shade(60, 1, 'light')
          values[prefix + '-container'] = color.hex()
          values['on-' + prefix + '-container'] = colors
            .shade(color.darken(5).isDark() ? 95 : 10)
            .hex()
        }
      }
    }
    return values
  }

  function getSizes(size: AppSizesPrefixes) {
    const obj: { [key: string]: string } = {}

    Object.keys(options.value.sizes[size]).forEach((key) => {
      obj[size + '-' + key] = addPX(options.value.sizes[size][key as AppSizes])
    })

    return obj
  }

  function setStyle() {
    setTimeout(() => {
      const values: Record<string, string> = {}
      let value = ''

      const colors = Object.keys(options.value.colors) as AppColorVariants[]
      const sizes = Object.keys(options.value.sizes) as AppSizesPrefixes[]
      const components = Object.keys(
        options.value.component
      ) as (keyof ElementSizes)[]

      if (options.value.colors.primary) {
        Object.assign(
          values,
          getShades(options.value.colors.primary, 'primary')
        )
      }

      for (const color of colors) {
        Object.assign(values, getShades(options.value.colors[color], color))
      }

      for (const size of sizes) {
        Object.assign(values, getSizes(size))
      }

      for (const component of components) {
        values[component + '-size'] = getCSSValue(
          options.value.component[component],
          'px',
          'size'
        )
      }

      for (const key in values) {
        value += `--${key}: ${values[key]};`
      }

      styleElem.value = `#${props.globalStyle ? 'body' : tag} { ${value} color:${getCSSColor(options.value.color)};  color-scheme:${options.value.theme}; font-family: ${options.value.fontFamily},Roboto,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif; ${value} }`
    })
  }

  onBeforeMount(setStyle)
  watch(options, setStyle)
</script>

<template>
  <component v-bind:is="'style'" :data-for="tag">
    {{ styleElem }}
  </component>
  <slot v-if="styleElem" />
</template>
