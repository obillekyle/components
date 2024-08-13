<script setup lang="ts">
  import '@/assets/input.scss'
  import type { Component, InputHTMLAttributes } from 'vue'
  import { computed, ref, useAttrs } from 'vue'

  import { evaluate } from '@/utils/function/evaluate'
  import { clamp } from '@/utils/number/range'
  import IconOrComponent from '../Misc/icon-or-component.vue'
  import NumberArrows from './number-arrows.vue'

  interface InputText
    extends /** @vue-ignore */ Omit<InputHTMLAttributes, 'onChange'> {
    span?: boolean
    value?: number
    defaultValue?: number
    placeholder?: string
    variant?: 'filled' | 'outlined'
    leftIcon?: string | Component
    onChange?: (value: number) => any
  }

  const input = ref<HTMLInputElement>()
  const props = defineProps<InputText>()
  const model = defineModel<number>()

  const attributes = useAttrs()
  const inputValue = computed({
    get: () => props.value ?? model.value ?? props.defaultValue ?? 0,
    set: (value) => {
      const min = Number(attributes.min)
      const max = Number(attributes.max)

      value = clamp(value, min, max)

      model.value = value
      evaluate(props.onChange, value)
    }
  })
</script>

<template>
  <div
    class="md-input number"
    @click="input?.focus()"
    :class="{ span, [variant ?? 'filled']: true }"
  >
    <IconOrComponent class="md-input-icon left" :icon="leftIcon" />
    <div class="md-input-content" :data-placeholder="placeholder">
      <input
        ref="input"
        type="number"
        placeholder=""
        v-bind="$attrs"
        v-model="model"
      />
      <NumberArrows v-model="inputValue" />
    </div>
  </div>
</template>
