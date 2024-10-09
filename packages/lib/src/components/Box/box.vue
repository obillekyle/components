<script setup lang="ts">
  import type { BoxProps } from './util'

  import { createStyle } from '@/utils/create-style'

  defineOptions({ name: 'MdBox' })
  const props = defineProps<BoxProps>()
  const className = createStyle(() => ({ ...props }))
</script>

<template>
  <component :class="className" :is="as ?? 'div'" md-box>
    <slot />
  </component>
</template>
