<script setup lang="ts">
  import '@/assets/input.scss'
  import type { Component, InputHTMLAttributes } from 'vue'
  import { computed, ref, useAttrs } from 'vue'

  import { clamp } from '@/utils/number/range'
  import HybridIcon from '../Misc/hybrid-icon.vue'
  import NumberArrows from './number-arrows.vue'

  interface InputNumber
    extends /** @vue-ignore */ Omit<InputHTMLAttributes, 'onChange'> {
    span?: boolean
    value?: number
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
  const emit = defineEmits<InputNumberEmits>()
  const model = defineModel<number>()

  const attributes = useAttrs()
  const inputValue = computed({
    get: () => props.value ?? model.value ?? props.defaultValue ?? 0,
    set: (value) => {
      const min = Number(attributes.min)
      const max = Number(attributes.max)

      value = clamp(value, min, max)

      model.value = value
      emit('change', value)
    }
  })
</script>

<template>
  <div
    class="md-input number"
    @click="input?.focus()"
    :class="{ span, [variant ?? 'filled']: true }"
  >
    <HybridIcon class="md-input-icon left" :icon="leftIcon" />
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
