<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import type { Component } from 'vue'

  defineProps<{
    icon?: string | Component
    size?: number
  }>()

  defineOptions({
    name: 'HybridIcon',
    inheritAttrs: false
  })
</script>

<template>
  <div v-if="icon" v-bind="$attrs" class="md-icon">
    <Icon
      v-if="typeof icon == 'string'"
      :icon="icon"
      :width="size ?? 24"
      :inline="false"
    />
    <component v-else :is="icon" />
  </div>
  <template v-else />
</template>

<style lang="scss">
  .md-icon {
    line-height: 1;
  }
</style>
