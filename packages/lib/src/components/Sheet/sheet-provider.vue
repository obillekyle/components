<script setup lang="ts">
  import type { SheetProps } from './util'

  import { ComponentManager } from '@/utils/component-manager'
  import { provide, shallowRef } from 'vue'

  import { onMounted, onUnmounted } from 'vue'
  import { SheetManager } from './sheet-manager'

  import Sheet from './sheet.vue'

  const props = defineProps<{
    manager?: ComponentManager<SheetProps>
  }>()

  const manager = props.manager || SheetManager
  const data = shallowRef(manager.data)

  const setData = () => (data.value = manager.data)

  provide('sheet-manager', manager)
  defineOptions({ name: 'MdSheetProvider', inheritAttrs: false })
  onMounted(() => manager.on('change', setData))
  onUnmounted(() => manager.detach('change', setData))
</script>

<template>
  <div class="md-sheet-provider">
    <transition-group name="md-sheet">
      <Sheet
        :key="key"
        :id="'md-sheet-' + key"
        :utils="manager.utility(key)"
        v-for="(sheet, key) in data"
        v-bind="sheet"
      />
    </transition-group>
  </div>
  <slot />
</template>
