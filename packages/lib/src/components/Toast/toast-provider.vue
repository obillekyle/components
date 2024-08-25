<script setup lang="ts">
  import type { ToastProps } from './util'

  import { ComponentManager } from '@/utils/component-manager'
  import { onMounted, provide, shallowRef } from 'vue'
  import { ToastManager } from './toast-manager'

  import Toast from './toast.vue'

  const props = defineProps<{
    manager?: ComponentManager<ToastProps>
  }>()

  const manager = props.manager || ToastManager
  const data = shallowRef(manager.data)

  provide('toast-manager', manager)
  defineOptions({ name: 'MdToastProvider', inheritAttrs: false })
  onMounted(() => manager.on('change', () => (data.value = manager.data)))
</script>

<template>
  <slot />
  <div class="md-toast-provider">
    <transition-group name="md-toast">
      <Toast
        :key="key"
        :id="'md-toast-' + key"
        :utils="manager.utility(key)"
        v-for="(toast, key) in data"
        v-bind="toast"
      />
    </transition-group>
  </div>
</template>
