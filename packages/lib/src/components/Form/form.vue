<script setup lang="ts">
  import { provide } from 'vue'

  defineOptions({ name: 'MdForm' })
  const model = defineModel<any>({ default: {} })
  provide('md-form-value', model)
</script>

<template>
  <form class="md-form">
    <slot />
  </form>
</template>
