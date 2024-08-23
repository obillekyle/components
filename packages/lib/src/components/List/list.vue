<script setup lang="ts">
  import type { ListProps } from './types'

  import { addPX } from '@/utils/css/sizes'
  import { provide } from 'vue'

  import ListItem from './list-item.vue'

  const properties = withDefaults(defineProps<ListProps>(), {
    swipe: 'off',
    listComp: 'div',
    items: () => []
  })

  provide('items', properties.items)
  provide('parentProps', properties)

  defineOptions({ name: 'MdList' })
  const height = addPX((properties.items.length + 1) * 60)
</script>

<template>
  <div class="md-list" :style="{ height }">
    <ListItem
      v-for="(item, index) in items"
      :key="item.id"
      :index="index"
      :props="item.props"
    />
  </div>
</template>

<style lang="scss">
  .md-list {
    position: relative;
    display: block;
    width: 100%;
    overflow: hidden;

    &-item {
      width: 100%;
      display: flex;
      position: absolute;
      transition: top 0.1s;
      user-select: none;
      height: 56px;

      &.dragged {
        z-index: 10;
        transition: none;
        box-shadow: var(--shadow-3);
      }
    }

    &-content {
      position: absolute;
      width: 100%;
      display: flex;
      height: inherit;
      background: var(--surface-container-low);
      transition: left 0.1s;
      z-index: 2;

      .draggable {
        position: absolute;
        right: 0;
        height: 100%;
        aspect-ratio: 1;
        display: grid;
        place-items: center;
        cursor: row-resize;

        > * {
          pointer-events: none;
        }
      }
    }

    &-swipe-indicator {
      position: absolute;
      z-index: 1;
      inset: 0;

      .left,
      .right {
        display: grid;
        height: inherit;
        inset: 0;
        position: absolute;
        align-items: center;
        padding: var(--md);
      }

      .left {
        grid-area: left;
      }

      .right {
        justify-content: end;
        grid-area: right;
      }
    }
  }
</style>
