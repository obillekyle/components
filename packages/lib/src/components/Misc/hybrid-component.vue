<script setup lang="ts">
  import type { Component } from 'vue'

  import { is } from '@/utils/object/is'

  interface HybridComponentProps {
    as?: string | Component
  }

  defineProps<HybridComponentProps>()
  defineOptions({ name: 'MdHybridComponent', inheritAttrs: false })
</script>

<template>
  <component v-if="is(as, 'object')" :is="as" v-bind="$attrs">
    <slot />
  </component>
  <template v-else>{{ as }}</template>
</template>
