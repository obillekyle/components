<script setup lang="ts">
  import type { SnackbarProps } from './util'

  import { ComponentManager } from '@/utils/component-manager'
  import { provide, shallowRef } from 'vue'

  import { onMounted } from 'vue'
  import { SnackbarManager } from './snackbar-manager'

  import Snackbar from './snackbar.vue'

  const props = defineProps<{
    manager?: ComponentManager<SnackbarProps>
  }>()

  const manager = props.manager || SnackbarManager
  const data = shallowRef(manager.data)

  provide('snackbar-manager', manager)
  defineOptions({ name: 'MdSnackbarProvider', inheritAttrs: false })
  onMounted(() => manager.on('change', () => (data.value = manager.data)))
</script>

<template>
  <slot />
  <div class="md-snackbar-provider">
    <transition-group name="md-snackbar">
      <Snackbar
        :key="key"
        :id="'md-snackbar-' + key"
        :utils="manager.utility(key)"
        v-for="(snackbar, key) in data"
        v-bind="snackbar"
      />
    </transition-group>
  </div>
</template>
