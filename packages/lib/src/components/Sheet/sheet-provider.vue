<script setup lang="ts">
  import type { SheetProps } from './util'

  import { ComponentManager } from '@/utils/component-manager'
  import { provide, shallowRef } from 'vue'

  import { computed, onMounted } from 'vue'
  import { SheetManager } from './sheet-manager'

  import Sheet from './sheet.vue'

  const props = defineProps<{
    manager?: ComponentManager<SheetProps>
  }>()

  const manager = props.manager || SheetManager
  const data = shallowRef(manager.data)

  function hasStandardSheet(direction: 'left' | 'right' | 'bottom') {
    return Object.values(data.value).some((sheet) => {
      return sheet.direction === direction && sheet.type === 'standard'
    })
  }

  const hasLeftStandard = computed(() => hasStandardSheet('left'))
  const hasRightStandard = computed(() => hasStandardSheet('right'))
  const hasBottomStandard = computed(() => hasStandardSheet('bottom'))

  provide('sheet-manager', manager)
  defineOptions({ name: 'MdSheetProvider', inheritAttrs: false })
  onMounted(() => manager.on('change', () => (data.value = manager.data)))
</script>

<template>
  <div
    class="md-sheet-provider"
    :class="{
      'md-sheet-provider-offset-left': hasLeftStandard,
      'md-sheet-provider-offset-right': hasRightStandard,
      'md-sheet-provider-offset-bottom': hasBottomStandard
    }"
  >
    <div class="md-sheet-provider-slot">
      <slot />
    </div>
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
</template>
