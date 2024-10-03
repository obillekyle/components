<script setup lang="ts">
  import { inject, ref } from 'vue'
  import { WIDGETS } from '../defaults'
  import { DEFAULT_WIDGETS } from '../defaults'

  import { Switch, Button, useSheet } from '@vue-material/core'
  import { Icon } from '@iconify/vue'

  const widgets = inject('widgets', ref(DEFAULT_WIDGETS))
  const sheet = useSheet()
</script>

<template>
  <div class="md-widget-configuration">
    <div
      class="md-widget-configuration-item"
      v-for="(widgetInfo, widget) in WIDGETS"
      :key="widget"
    >
      <div class="md-widget-configuration-item--icon">
        <Icon :icon="widgetInfo.icon" :width="24" />
      </div>
      <div class="md-widget-configuration-item--info">
        <div class="md-widget-configuration-item--name">
          {{ widgetInfo.name }}
        </div>
        <div class="md-widget-configuration-item--description">
          {{ widgetInfo.description }}
        </div>
      </div>
      <Switch
        :checked="widgets.includes(widget)"
        @change="
          (value) =>
            value
              ? widgets.push(widget)
              : widgets.splice(widgets.indexOf(widget), 1)
        "
      />
    </div>
  </div>
  <Button
    @click="sheet.close('widget-config')"
    class="md-widget-configuration-confirm"
  >
    Confirm
  </Button>
</template>

<style lang="scss">
  .md-widget-configuration {
    &-item {
      display: flex;
      align-items: center;
      padding: var(--md);
      border-radius: var(--xs);
      background: var(--surface-container);
      margin-bottom: var(--xxs);
      gap: var(--sm);

      &:last-child {
        border-bottom-left-radius: var(--md);
        border-bottom-right-radius: var(--md);
      }

      &:first-child {
        border-top-left-radius: var(--md);
        border-top-right-radius: var(--md);
      }
    }

    &-item--icon {
      display: grid;
      place-items: center;
    }

    &-item--info {
      flex: 1;
    }

    &-item--name {
      font-weight: 600;
    }

    &-item--description {
      color: var(--on-surface-variant);
    }

    &-confirm {
      position: absolute;
      bottom: calc(var(--taskbar-height) + var(--md));
      right: var(--md);
    }
  }
</style>
