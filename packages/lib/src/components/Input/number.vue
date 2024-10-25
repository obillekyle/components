<script setup lang="ts">
  import '@/assets/input.scss'

  import type { Component, InputHTMLAttributes } from 'vue'

  import { ref, useAttrs } from 'vue'
  import { clamp } from '@/utils/number/range'
  import { useValue } from '@/ref/use-form-value'

  import HybridIcon from '../Misc/hybrid-icon.vue'
  import NumberArrows from './number-arrows.vue'

  interface InputNumber
    extends /** @vue-ignore */ Omit<InputHTMLAttributes, 'onChange'> {
    name?: string
    span?: boolean
    value?: number
    prefix?: string
    suffix?: string
    defaultValue?: number
    placeholder?: string
    variant?: 'filled' | 'outlined'
    leftIcon?: string | Component
  }

  type InputNumberEmits = {
    (e: 'change', value: number): void
  }

  const input = ref<HTMLInputElement>()
  const props = defineProps<InputNumber>()
  const emits = defineEmits<InputNumberEmits>()
  const model = defineModel<number>()
  defineOptions({ name: 'MdInputNumber' })

  const attributes = useAttrs()
  const inputValue = useValue(0, props, model, (value) => {
    const min = Number(attributes.min || Number.NEGATIVE_INFINITY)
    const max = Number(attributes.max || Number.POSITIVE_INFINITY)

    value = clamp(value, min, max)
    emits('change', value)

    return value
  })
</script>

<template>
  <div
    class="md-input number"
    @click="input?.focus()"
    :class="{ span, [variant ?? 'filled']: true }"
    :data-placeholder="placeholder"
  >
    <div class="md-input-wrapper">
      <HybridIcon class="md-input-icon left" :icon="leftIcon" />
      <span class="md-input-placeholder">{{ placeholder }}</span>
      <span class="md-input-prefix" v-if="prefix">{{ prefix }}</span>
      <span class="md-input-suffix" v-if="suffix">{{ suffix }}</span>

      <input
        :name
        ref="input"
        type="number"
        placeholder=""
        v-bind="$attrs"
        class="md-input-field"
        v-model="inputValue"
      />
      <NumberArrows v-model="inputValue" />
    </div>
  </div>
</template>
