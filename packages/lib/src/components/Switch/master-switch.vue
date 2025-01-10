<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'

  import { useBoolValue } from '@/ref/use-form-value'
  import { rippleEffect } from '@/utils/dom/ripple'

  import Switch from './switch.vue'

  interface MasterSwitchProps
    extends /* @vue-ignore */ Omit<HTMLAttributes, 'onChange'> {
    name?: string
    checked?: boolean
    defaultChecked?: boolean
  }

  type MasterSwitchEmits = {
    (e: 'change', value: boolean): void
  }

  defineOptions({ name: 'MasterSwitch' })
  const emits = defineEmits<MasterSwitchEmits>()
  const props = withDefaults(defineProps<MasterSwitchProps>(), {
    checked: undefined,
    defaultChecked: undefined
  })

  const model = defineModel<boolean>({ default: undefined })
  const inputValue = useBoolValue(false, props, model, (value) => {
    emits('change', value)
    return value
  })
</script>

<template>
  <div class="md-master-switch">
    <div
      class="md-master-switch-wrapper"
      @click="inputValue = !inputValue"
      @pointerdown="rippleEffect"
    >
      <div class="md-master-switch-label">
        <slot />
      </div>
      <div class="md-master-switch-toggle">
        <Switch :name :checked="inputValue" variant="filled" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .md-master-switch {
    top: 0;
    z-index: 10;
    position: sticky;
    padding-top: var(--md);
    margin-bottom: var(--xxl);
    background: var(--surface);
    border-radius: 0 0 var(--xxl) var(--xxl);

    &-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      overflow: hidden;
      background: var(--secondary-container);
      color: var(--on-secondary-container);
      height: var(--component-xxl);
      padding-inline: var(--lg);
      margin-bottom: var(--md);
      border-radius: var(--xxl);
      font-size: var(--font-lg);

      --ripple-color: var(--primary);
    }

    &-toggle {
      pointer-events: none;
      position: absolute;
      display: grid;
      align-items: center;
      top: 0;
      bottom: 0;
      right: var(--md);
    }
  }

  .md-scroll:has(.md-header) .md-master-switch {
    top: var(--header-size);
    margin-top: -1px;
  }
</style>
