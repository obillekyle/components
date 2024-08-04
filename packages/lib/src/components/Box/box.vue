<script setup lang="ts">
  import type { BoxProps } from './util'
  import { processBoxProps } from './util'

  defineOptions({ name: 'MdBox' })
  const props = defineProps<BoxProps>()
  const className = processBoxProps(props)
</script>

<template>
  <component :class="className" :is="as ?? 'div'" md-box>
    <slot />
  </component>
</template>
