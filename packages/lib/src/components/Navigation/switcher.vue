<script setup lang="ts">
  import { evaluate } from '@/utils/object'
  import { Icon } from '@iconify/vue'
  import type { HTMLAttributes } from 'vue'
  import { computed } from 'vue'

  interface SwitcherProperties extends /* @vue-ignore */ HTMLAttributes {
    change?: (value: number, oldValue: number) => void
    defaultValue?: number
    width?: number
    items: {
      icon: string
      name: string
    }[]
  }

  const properties = defineProps<SwitcherProperties>()
  const value = defineModel<number>()
  defineOptions({ name: 'MdSwitcher' })

  function handleClick(index: number) {
    evaluate(properties.change, index, value.value)
    value.value = index
  }

  const maxChars = computed(() => {
    let max = 0
    for (const item of properties.items) {
      if (item.name.length > max) {
        max = item.name.length
      }
    }

    return max + 2
  })
</script>

<template>
  <div class="md-switcher" :style="{ '--chars': maxChars }">
    <div
      :class="['md-switcher-item', index == value && 'active']"
      v-for="(item, index) in items"
      @click="() => handleClick(index)"
      :key="index"
    >
      <div class="md-switcher-item-icon">
        <Icon :icon="item.icon" :width="24" />
      </div>
      <div class="md-switcher-item-name">{{ item.name }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .md-switcher {
    display: flex;
    align-items: center;
    padding: calc(var(--sm) / 2);
    background: var(--primary-80-20);
    border-radius: var(--sm);
    margin-block: auto;

    &-item {
      overflow: hidden;
      height: 36px;
      display: grid;
      padding-inline: var(--sm);
      border-radius: 4px;
      place-items: center center;
      transition: background-color 0.2s;
      grid-template-columns: 36px auto;
      color: var(--primary-90);

      &-icon {
        display: grid;
        place-items: center;
        width: 36px;
      }

      &-name {
        font-size: var(--font-md);
        text-transform: uppercase;
        transition: width 0.2s;
        font-weight: 600;
        opacity: 0;
        width: 0;
        text-align: center;
        justify-self: center;
      }

      * {
        pointer-events: none;
      }

      &.active {
        .md-switcher-item-name {
          opacity: 1;
          width: calc(var(--chars) * 1ch);
        }

        background: var(--primary-40);
      }
    }
  }
</style>
