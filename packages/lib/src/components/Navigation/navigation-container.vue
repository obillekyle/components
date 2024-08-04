<script setup lang="ts">
  import { computed, inject, provide, ref } from 'vue'

  interface NavigationContainerProperties {
    center?: boolean
  }

  defineProps<NavigationContainerProperties>()
  defineOptions({ name: 'MdNavigationContainer' })
  const root = ref<HTMLDivElement>()
  const parent = inject('parent', ref<HTMLDivElement>())
  const element = computed(() => root.value ?? parent.value)

  provide('parent', element)
</script>

<template>
  <div class="md-navbar-container" v-if="center" ref="root">
    <slot />
  </div>
  <slot v-else />
</template>
