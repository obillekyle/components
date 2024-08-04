<script setup lang="ts">
  import { Icon } from '@iconify/vue'

  const model = defineModel<number>({
    required: true,
    default: 0
  })
</script>

<template>
  <div class="md-input-number-arrows">
    <div class="arrow-increase" @click="model++">
      <Icon icon="mdi:chevron-up" :width="20" />
    </div>
    <div class="arrow-decrease" @click="model--">
      <Icon icon="mdi:chevron-down" :width="20" />
    </div>
  </div>
</template>
