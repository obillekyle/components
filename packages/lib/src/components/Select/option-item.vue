<script setup lang="ts">
  import type { ObjectValue } from '@/utils/other/to-object-value'

  defineProps<ObjectValue>()
  defineOptions({ name: 'MdSelectOptionItem' })
</script>

<template>
  <div :value class="md-select-option-item">{{ label }}</div>
</template>

<style lang="scss" scoped>
  .md-select-option-item {
    user-select: none;
  }
</style>
