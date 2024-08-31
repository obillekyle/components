<script setup lang="ts">
  import type { ListEmits, ListItemType, ListProps, UseList } from './types'

  import { addPX } from '@/utils/css/sizes'
  import { computed, provide, ref } from 'vue'

  import ListItem from './list-item.vue'

  const props = withDefaults(defineProps<ListProps>(), {
    size: 56,
    swipe: 'off',
    swipeDistance: 200,
    listComp: 'div'
  })

  const listItems = computed(() =>
    props.items?.map((item) => {
      if (typeof item === 'object') return item
      return { value: item, label: item }
    })
  )

  const root = ref<HTMLElement>()
  const model = defineModel<ListItemType[]>({
    default: []
  })

  const emit = defineEmits<ListEmits>()

  const items = computed({
    get: () => listItems.value ?? model.value,
    set: (value) => (model.value = value)
  })

  const listProvide = computed<UseList>(() => ({
    items: items,
    root: root.value,
    swipe: props.swipe,
    sortable: props.sortable,
    swipeOptions: props.swipeOptions ?? {},
    swipeDistance: props.swipeDistance,
    component: props.listComp,
    size: props.size,
    emit
  }))

  provide('list-provide', listProvide)

  defineOptions({ name: 'MdList' })
  const height = addPX((items.value.length + 1) * props.size)
</script>

<template>
  <div class="md-list" :style="{ height }" ref="root">
    <ListItem
      v-for="(item, index) in items"
      :key="item.value"
      :index="index"
      v-bind="item"
    />
  </div>
</template>

<style lang="scss">
  .md-list {
    position: relative;
    display: block;
    contain: strict;
    width: 100%;
    overflow: hidden;

    &-item {
      width: 100%;
      display: flex;
      position: absolute;
      transition: top 0.1s;
      user-select: none;
      height: 56px;

      &.sorting {
        z-index: 10;
        transition: none;
        box-shadow: var(--shadow-3);
      }
    }

    &-item-wrapper {
      position: absolute;
      width: 100%;
      display: flex;
      height: inherit;
      align-items: center;
      background: var(--surface-container-low);
      transition: left 0.2s;
      left: 0;
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

    &-item-content {
      padding-left: var(--md);
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
