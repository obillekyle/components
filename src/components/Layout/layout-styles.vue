<script setup lang="ts">
  import type {
    AppColorVariants,
    AppSizesPrefixes,
    AppSizes
  } from '@/utils/css'
  import type { ComputedRef } from 'vue'
  import type { LayoutOptions, ElementSizes } from './util'

  import { Colors, isLight } from '@/utils/colors'
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
      color instanceof Colors ? color : new Colors(color.toString())
    const theme = options.value.theme
    const values: Record<string, string> = {}

    if (theme == 'dark') {
      for (let shade of AppShades) {
        const key = prefix + '-' + shade
        values[key] = colors.shade(shade).hex()

        for (let i = 0; i < 9; i++) {
          const color = colors.shade(shade, (i + 1) * 0.1).hexa()
          values[key + '-' + (i + 1) * 10] = color
        }
      }
      const _50 = colors.shade(50)
      values[prefix] = _50.hex()
      values['on-' + prefix] = colors.shade(isLight(_50) ? 5 : 95).hex()

      const _95 = colors.shade(80)
      values[prefix + '-container'] = _95.hex()
      values['on-' + prefix + '-container'] = colors
        .shade(isLight(_95) ? 5 : 95)
        .hex()
    } else {
      for (let shade of AppShades) {
        const val = Math.abs(100 - shade)
        const key = prefix + '-' + shade
        values[key] = colors.shade(val, 1).hex()

        for (let i = 0; i < 9; i++) {
          const color = colors.shade(val, (i + 1) * 0.1).hexa()
          values[key + '-' + (i + 1) * 10] = color
        }
      }

      const _50 = colors.shade(50)
      values[prefix] = _50.hex()
      values['on-' + prefix] = colors.shade(isLight(_50) ? 5 : 95).hex()

      const _95 = colors.shade(90)
      values[prefix + '-container'] = _95.hex()
      values['on-' + prefix + '-container'] = colors
        .shade(isLight(_95) ? 5 : 95)
        .hex()
    }

    return values
  }

  function getSizes(size: AppSizesPrefixes) {
    const obj: { [key: string]: string } = {}

    Object.keys(options.value.sizes[size]).forEach((key) => {
      obj[size + '-' + key] = addPX(
        options.value.sizes[size][key as AppSizes]
      )
    })

    return obj
  }

  function setStyle() {
    setTimeout(() => {
      const values: Record<string, string> = {}
      let value = ''

      const colors = Object.keys(
        options.value.colors
      ) as AppColorVariants[]
      const sizes = Object.keys(
        options.value.sizes
      ) as AppSizesPrefixes[]
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
        Object.assign(
          values,
          getShades(options.value.colors[color], color)
        )
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
