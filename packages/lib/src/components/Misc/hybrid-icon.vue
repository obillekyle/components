<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'
  import type { Component } from 'vue'

  import { getCSSValue } from '@/utils/css/sizes'
  import { Icon } from '@iconify/vue'

  defineProps<{
    icon?: string | Component
    size?: SizesString
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
      :style="{ fontSize: getCSSValue(size ?? '#md', 'px', 'icon') }"
      :icon="icon"
    />
    <component v-else :is="icon" />
  </div>
  <template v-else />
</template>

<style lang="scss">
  .md-icon {
    line-height: 0;
  }
</style>
