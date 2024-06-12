<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import type { Component } from 'vue'

  defineProps<{
    icon?: string | Component
  }>()

  defineOptions({
    name: 'IconOrComponent',
    inheritAttrs: false
  })
</script>

<template>
  <div v-if="icon" v-bind="$attrs">
    <Icon v-if="typeof icon == 'string'" :icon="icon" :width="24" />
    <component v-else :is="icon" />
  </div>
  <template v-else />
</template>
