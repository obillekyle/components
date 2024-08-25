<script setup lang="ts">
  import type { SizesString } from '@/utils/css/type'
  import type { InputHTMLAttributes } from 'vue'

  import { getCSSValue } from '@/utils/css/sizes'
  import { keyClick } from '@/utils/dom/events'
  import { computed, ref } from 'vue'

  interface SwitchProps
    extends /* @vue-ignore */ Omit<
      InputHTMLAttributes,
      'size' | 'onChange'
    > {
    size?: SizesString
    value?: boolean
    defaultChecked?: boolean
    variant?: 'outline' | 'filled'
    length?: number
  }

  type SwitchEmits = {
    (event: 'change', value: boolean): void
  }

  const inputRef = ref<HTMLInputElement>()
  const model = defineModel<boolean>()
  const emit = defineEmits<SwitchEmits>()
  const props = withDefaults(defineProps<SwitchProps>(), {
    size: '#xs',
    value: undefined,
    defaultChecked: undefined,
    variant: 'outline',
    length: 1.9
  })

  const inputValue = computed({
    get: () => props.value ?? model.value ?? props.defaultChecked ?? false,
    set: (value) => {
      model.value = value
      emit('change', value)
    }
  })

  defineOptions({
    inheritAttrs: false,
    name: 'MdSwitch'
  })
</script>

<template>
  <div
    tabindex="0"
    class="md-switch"
    :class="variant"
    @keydown="keyClick"
    @click="inputRef?.click()"
    :style="{
      '--size': getCSSValue(size, 'px', 'component'),
      '--length': length
    }"
  >
    <input
      type="checkbox"
      v-bind="$attrs"
      v-model="inputValue"
      ref="inputRef"
    />
  </div>
</template>

<style lang="scss">
  .md-switch {
    --size: var(--component-xs);
    --length: 1.9;

    position: relative;
    display: inline-block;
    width: calc(var(--size) * var(--length));
    height: var(--size);
    flex-shrink: 0;
    border-radius: var(--size);
    box-shadow: 0 0 0 2px inset var(--outline);
    background: var(--surface-container);
    transition: all 0.15s var(--timing-standard);

    input {
      display: none;
    }

    &.filled {
      background: var(--outline);
      box-shadow: 0 0 0 2px inset var(--outline);

      &::after,
      &::before {
        background: #fafafa;
        scale: 0.75;
      }
    }

    &::after,
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      scale: 0.5;
      width: var(--size);
      height: var(--size);
      border-radius: var(--size);
      transition:
        inset 0.2s var(--timing-standard),
        scale 0.25s var(--timing-standard);
    }

    &::after {
      background: var(--outline);
    }

    &:focus-visible::before {
      outline: calc(var(--size) / 2) solid var(--outline);
      opacity: 0.5;
    }
  }

  .md-switch:has(input:checked) {
    background: var(--primary);
    box-shadow: 0 0 0 2px inset var(--primary);

    &::after,
    &::before {
      scale: 0.75;
      left: calc(var(--size) * (var(--length) - 1));
      background: var(--on-primary);
    }
  }

  .md-switch:has(input:disabled) {
    opacity: 0.5;
  }
</style>
