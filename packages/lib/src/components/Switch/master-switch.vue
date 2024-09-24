<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'

  import { rippleEffect } from '@/utils/dom/ripple'
  import { useBoolValue } from '@/ref/use-form-value'

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
        <Switch
          :name
          :checked="inputValue"
          variant="filled"
          :length="1.6"
        />
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
      background: var(--primary-fixed);
      color: var(--on-primary-fixed);
      height: var(--component-xl);
      padding-inline: var(--lg);
      margin-bottom: var(--md);
      border-radius: var(--xxl);
      font-size: var(--font-lg);
      box-shadow: var(--shadow-3);

      --ripple-color: var(--on-primary-fixed-variant);
    }

    &-toggle {
      pointer-events: none;
      position: absolute;
      display: grid;
      align-items: center;
      right: var(--lg);
      top: 0;
      bottom: 0;

      .md-switch:has(input:checked) {
        box-shadow: 0 0 0 2px inset var(--on-primary-fixed-variant);
        background: var(--on-primary-fixed-variant) !important;

        &::after,
        &::before {
          background: var(--primary-fixed-dim) !important;
        }
      }
    }
  }

  .md-scroll:has(.md-header) .md-master-switch {
    top: var(--header-size);
    margin-top: -1px;
  }
</style>
