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
    contain: layout;
    width: 100%;

    &-item {
      width: 100%;
      display: flex;
      position: absolute;
      user-select: none;
      transition: top 0.2s;
    }

    &-item-wrapper {
      position: absolute;
      width: 100%;
      display: flex;
      height: inherit;
      background: var(--surface);
      align-items: center;
      left: 0;
      z-index: 2;
      transition:
        left 0.2s,
        background-color 0.1s;

      &:hover {
        background: var(--surface-container-low);
      }

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

    &-item.sorting {
      transition: none;
      z-index: 10;
    }

    &-item.swiping &-item-wrapper {
      transition: none;
      background: var(--surface-container);
    }

    &-item.sorting &-item-wrapper {
      box-shadow: var(--shadow-3);
      background: var(--surface-container);
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
        inset: 0;
        display: grid;
        height: inherit;
        max-width: 100%;
        transition: width 2s;
        position: absolute;
        align-items: center;
        padding: var(--md);
      }

      .right {
        justify-content: end;
        margin-left: auto;
      }
    }

    &-item.swiping .left,
    &-item.swiping .right {
      transition: none;
    }
  }
</style>
