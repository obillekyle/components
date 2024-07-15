<script setup lang="ts">
  import type { HTMLAttributes } from 'vue'

  import Switch from './switch.vue'
  import { evaluate } from '@/utils/object'
  import { watch, onBeforeMount } from 'vue'
  import { keyboardClick, rippleEffect } from '@/utils/dom'

  interface MasterSwitchProps extends /* @vue-ignore */ HTMLAttributes {
    name?: string
    defaultChecked?: boolean
    change?: (value: boolean) => void
  }

  const props = defineProps<MasterSwitchProps>()
  const value = defineModel<boolean>({
    default: undefined
  })

  defineOptions({ name: 'MasterSwitch' })

  onBeforeMount(() => {
    value.value ??= props.defaultChecked ?? false
  })

  watch(value, () => {
    evaluate(props.change, value.value)
  })
</script>

<template>
  <div
    class="md-master-switch"
    tabindex="0"
    @click="() => (value = !value)"
    @pointerdown="rippleEffect"
    @keydown="keyboardClick"
  >
    <div class="label">
      <slot>{{ name }}</slot>
    </div>
    <div class="md-master-switch-toggle">
      <Switch
        :modelValue="value"
        :defaultChecked="defaultChecked"
        variant="filled"
      />
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
    background: var(--primary-container);
    color: var(--on-primary-container);
    padding: var(--xxl) var(--lg);
    margin-bottom: var(--md);
    border-radius: var(--xxl);
    text-transform: capitalize;
    font-size: var(--font-lg);
    z-index: 10;
    box-shadow: var(--shadow-3);

    &-toggle {
      pointer-events: none;
      position: absolute;
      display: grid;
      align-items: center;
      right: var(--lg);
      top: 0;
      bottom: 0;
    }
  }
</style>
