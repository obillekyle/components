<script setup lang="ts">
  import type { InputHTMLAttributes } from 'vue'
  import type { AppSizes } from '@/utils/css'

  import { ref, onMounted } from 'vue'
  import { getCSSValue } from '@/utils/css'
  import { keyboardClick } from '@/utils/dom'
  import { evaluate } from '@/utils/object'

  interface SwitchProps
    extends /* @vue-ignore */ Omit<InputHTMLAttributes, 'size'> {
    size?: AppSizes | number | String
    change?: (v: boolean) => any
    defaultChecked?: boolean
    variant?: 'outline' | 'filled'
  }

  const inputRef = ref<HTMLInputElement | null>(null)
  const model = defineModel<boolean | undefined>({
    default: undefined
  })

  const props = withDefaults(defineProps<SwitchProps>(), {
    // eslint-disable-next-line vue/require-valid-default-prop
    size: 'xs',
    variant: 'outline'
  })

  function handleClick() {
    const element = inputRef.value!
    if (element.disabled) return
    model.value = !model.value
    evaluate(props.change, model.value)
  }

  onMounted(() => {
    model.value ??= props.defaultChecked ?? false
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
    @keydown="keyboardClick"
    @click="() => inputRef?.click()"
    :style="`--size: ${getCSSValue(size, 'px', 'component')}`"
  >
    <input
      type="checkbox"
      v-bind="$attrs"
      v-model="model"
      ref="inputRef"
      @click="handleClick"
    />
  </div>
</template>

<style lang="scss" scoped>
  .md-switch {
    position: relative;
    display: inline-block;
    width: calc(var(--size) * 2);
    height: var(--size);
    flex-shrink: 0;
    border-radius: var(--size);
    background-color: var(--mono-10);
    box-shadow: 0 0 0 2px var(--mono-50);
    transition: all 0.15s var(--timing-standard);

    input {
      display: none;
    }

    &.filled {
      box-shadow: 0 0 0 2px var(--mono-20);
      background-color: var(--mono-20);

      &::after {
        background-color: #fafafa;
        scale: 0.8;
      }
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      scale: 0.6;
      width: var(--size);
      height: var(--size);
      background-color: var(--mono-60);
      border-radius: var(--size);
      transition:
        inset 0.2s var(--timing-standard),
        scale 0.25s var(--timing-standard);
    }

    &:focus-visible::after {
      outline: calc(var(--size) / 2) solid var(--mono-80-30);
    }
  }

  .md-switch:has(input:checked) {
    background-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary);

    &::after {
      scale: 0.8;
      left: var(--size);
      background-color: var(--on-primary);
    }
  }

  .md-switch:has(input:disabled) {
    opacity: 0.5;
  }
</style>
