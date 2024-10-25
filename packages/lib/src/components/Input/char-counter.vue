<script setup lang="ts">
  defineProps<{
    length: number
    max?: any
  }>()

  defineOptions({
    name: 'MdInputCounter'
  })
</script>

<template>
  <div class="md-input-number-arrows">
    <span>{{ length }}</span>
    <span v-if="max">/{{ max }}</span>
  </div>
</template>
