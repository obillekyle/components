<script setup lang="ts">
  import { useLocalStorage } from '@vue-material/core'
  import { defineAsyncComponent } from 'vue'

  const widgets = useLocalStorage<string[]>('widgets', [
    'clock',
    'network',
    'gh-graph'
  ])

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
</script>

<template>
  <div class="md-widgets">
    <div class="md-widgets-wrapper">
      <div class="md-widget" v-for="widget in widgets" :key="widget">
        <component :is="loadWidget(widget)" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .md-widgets {
    &-wrapper {
      width: min(100%, 300px);
      margin-left: auto;
    }
  }

  .md-widget {
    background: var(--surface);
    border-radius: var(--md);
    padding: var(--md);
    margin-bottom: var(--sm);
  }
</style>
