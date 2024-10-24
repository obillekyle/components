<script setup lang="ts">
  import { toProxy } from '@/ref/tools'
  import { provide } from 'vue'

  defineOptions({ name: 'MdForm' })
  const model = defineModel<any>({ default: {} })
  provide('md-form-value', toProxy(model))
</script>

<template>
  <form class="md-form">
    <slot />
  </form>
</template>
