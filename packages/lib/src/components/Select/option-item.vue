<script setup lang="ts">
  import type { SelectItem } from './util'

  defineProps<SelectItem>()

  defineOptions({
    name: 'MdSelectOptionItem'
  })
</script>

<template>
  <div :value class="md-select-option-item">{{ label }}</div>
</template>

<style lang="scss" scoped>
  .md-select-option-item {
    padding-inline: 1rem;
    cursor: pointer;
    user-select: none;
  }
</style>
