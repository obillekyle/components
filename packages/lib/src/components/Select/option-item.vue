<script setup lang="ts">
  defineProps<{
    name: string
    id: string | number
  }>()

  defineOptions({
    name: 'MdSelectOptionItem'
  })
</script>

<template>
  <div :data-id="id" class="md-select-option-item">{{ name }}</div>
</template>

<style lang="scss" scoped>
  .md-select-option-item {
    padding-inline: 1rem;
    cursor: pointer;
    user-select: none;
  }
</style>
