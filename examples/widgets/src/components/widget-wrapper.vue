<script setup lang="ts">
  import { IconButton, useSheet } from '@vue-material/core'
  import { defineAsyncComponent, ref, inject } from 'vue'
  import { DEFAULT_WIDGETS } from '../defaults'

  const widgets = inject('widgets', ref(DEFAULT_WIDGETS))

  function loadWidget(widget: string) {
    return defineAsyncComponent(async () => {
      try {
        return await import(`../widgets/${widget}/index.vue`)
      } catch {
        return await import(`../widgets/${widget}.vue`)
      }
    })
  }

  defineOptions({ name: 'MdWidgetWrapper' })

  const sheet = useSheet()

  function openConfigureModal() {
    sheet.open('widget-config', {
      title: 'Widget Configuration',
      closeable: false,
      content: defineAsyncComponent(() => import('./configure-modal.vue'))
    })
  }
</script>

<template>
  <div class="md-widgets">
    <div class="md-widgets-wrapper">
      <IconButton
        icon="material-symbols:settings-outline"
        variant="filled"
        class="md-widgets-configure"
        @click="openConfigureModal"
      />
      <div class="md-widget" v-for="widget in widgets" :key="widget">
        <component :is="loadWidget(widget)" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .md-widgets {
    &-wrapper {
      display: flex;
      flex-direction: column;
      width: min(100%, 300px);
      margin-left: auto;
    }

    &-configure {
      position: absolute;
      bottom: var(--component-xl);
      right: 0;
    }
  }

  .md-widget {
    background: var(--surface);
    border-radius: var(--md);
    padding: var(--md);
    margin-bottom: var(--sm);
  }
</style>
