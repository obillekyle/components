<script setup lang="ts">
  import type { MixedValues } from '@/utils/other/to-object-value'
  import type { VModelProps } from '@/ref/use-form-value'

  import { toObjectValue } from '@/utils/other/to-object-value'
  import { useValue } from '@/ref/use-form-value'
  import { computed, ref, watch, onMounted } from 'vue'
  import { rippleEffect } from '@/utils/dom/ripple'
  import { useWindowSize } from '@/ref/use-window-rect'

  interface TabSwitcherProps extends VModelProps<string | number> {
    items?: MixedValues
  }

  interface TabSwitcherEmits {
    (e: 'change', value: string | number): void
  }

  defineOptions({ name: 'MdTabSwitcher' })
  const model = defineModel<string | number>()
  const props = defineProps<TabSwitcherProps>()
  const items = computed(() => toObjectValue(props.items ?? []))
  const emits = defineEmits<TabSwitcherEmits>()
  const wSize = useWindowSize()

  const root = ref<HTMLElement>()
  const indicator = ref<HTMLElement>()

  const value = useValue(items.value[0].value, props, model, (value) => {
    emits('change', value)
    return value
  })

  function changeActive() {
    if (root.value && indicator.value) {
      const active = root.value.querySelector(
        '.md-tab-switcher-item[active]'
      ) as HTMLElement
      if (active) {
        root.value.scrollTo({
          left:
            active.offsetLeft +
            active.offsetWidth / 2 -
            root.value.offsetWidth / 2,
          behavior: 'smooth'
        })
        indicator.value.style.width = active.offsetWidth + 'px'
        indicator.value.style.left = active.offsetLeft + 'px'
      }
    }
  }

  watch([items, value, wSize], changeActive, { flush: 'post' })
  onMounted(changeActive)
</script>

<template>
  <div class="md-tab-switcher" ref="root">
    <div
      v-for="item in items"
      class="md-tab-switcher-item"
      :key="item.value"
      :active="item.value === value || undefined"
      @click="value = item.value"
      @pointerdown="rippleEffect"
    >
      {{ item.label }}
    </div>
    <div ref="indicator" class="md-tab-switcher-indicator" />
  </div>
</template>

<style lang="scss">
  .md-tab-switcher {
    height: var(--component-md);
    display: flex;
    position: sticky;
    top: 0;
    z-index: 4;
    align-items: center;
    overflow: auto;
    background: var(--surface);
    border-bottom: 1px solid var(--surface-container);
    scrollbar-width: none;

    &-item {
      flex-grow: 1;
      flex-shrink: 0;
      height: 100%;
      display: grid;
      overflow: hidden;
      position: relative;
      place-items: center;
      padding-inline: var(--sm);
      font-size: var(--font-sm);
      color: var(--on-surface);
      cursor: pointer;
      user-select: none;
      white-space: nowrap;

      &[active] {
        color: var(--primary);
      }
    }

    &-indicator {
      position: absolute;
      bottom: 0;
      display: grid;
      height: var(--xxs);
      place-items: center;
      transition:
        left 0.25s var(--timing-standard),
        width 0.25s var(--timing-standard);

      &::before {
        content: '';
        position: absolute;
        width: 60%;
        height: 100%;
        background: var(--primary);
        border-top-left-radius: var(--xxs);
        border-top-right-radius: var(--xxs);
      }
    }
  }

  .md-header-content + .md-tab-switcher {
    z-index: 5;
    top: var(--header-size);
  }
</style>
