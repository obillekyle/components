<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'

  import { rippleEffect } from '@/utils/dom'
  import { evaluate } from '@/utils/function/evaluate'
  import { computed } from 'vue'

  import Switch from './switch.vue'

  interface MasterSwitchProps
    extends /* @vue-ignore */ Omit<HTMLAttributes, 'onChange'> {
    name?: string
    value?: boolean
    defaultChecked?: boolean
    onChange?: (value: boolean) => void
  }

  defineOptions({ name: 'MasterSwitch' })
  const props = withDefaults(defineProps<MasterSwitchProps>(), {
    value: undefined,
    defaultChecked: undefined
  })

  const model = defineModel<boolean>()
  const inputValue = computed({
    get: () => props.value ?? model.value ?? props.defaultChecked ?? false,
    set: (value) => {
      model.value = value
      evaluate(props.onChange, value)
    }
  })
</script>

<template>
  <div
    class="md-master-switch"
    @click="inputValue = !inputValue"
    @pointerdown="rippleEffect"
  >
    <div class="label">
      <slot>{{ name }}</slot>
    </div>
    <div class="md-master-switch-toggle">
      <Switch :value="inputValue" variant="filled" />
    </div>
  </div>
</template>

<style lang="scss">
  .md-master-switch {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    overflow: hidden;
    background: var(--primary-fixed);
    color: var(--on-primary-fixed);
    padding: var(--xxl) var(--lg);
    margin-bottom: var(--md);
    border-radius: var(--xxl);
    font-size: var(--font-lg);
    z-index: 10;
    box-shadow: var(--shadow-3);

    --ripple-color: var(--on-primary-fixed-variant);

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
</style>
