<script setup lang="ts">
  import '@/assets/input.scss'
  import type { Component, InputHTMLAttributes } from 'vue'

  import { evaluate } from '@/utils/object'
  import { computed, ref } from 'vue'
  import IconOrComponent from '../Misc/icon-or-component.vue'
  import Counter from './counter.vue'

  interface InputText
    extends /** @vue-ignore */ Omit<InputHTMLAttributes, 'onChange'> {
    leftIcon?: string | Component
    rightIcon?: string | Component
    placeholder?: string
    value?: string
    defaultValue?: string
    onChange?: (v: string) => any
    prefix?: string
    suffix?: string
    variant?: 'filled' | 'outlined'
    counter?: boolean
    span?: boolean
  }

  const inputRef = ref<HTMLInputElement>()
  const props = defineProps<InputText>()
  const model = defineModel<string>()

  const inputValue = computed({
    get: () => props.value ?? model.value ?? props.defaultValue ?? '',
    set: (value) => {
      model.value = value
      evaluate(props.onChange, value)
    }
  })
</script>

<template>
  <div
    class="md-input text"
    @click="inputRef?.focus()"
    :class="{ span, [variant ?? 'filled']: true }"
  >
    <IconOrComponent class="md-input-icon left" :icon="leftIcon" />
    <div class="md-input-content" :data-placeholder="placeholder">
      <span v-if="prefix">{{ prefix }}</span>
      <input
        type="text"
        placeholder=""
        v-bind="$attrs"
        v-model="inputValue"
        ref="inputRef"
      />
      <Counter
        v-if="counter"
        :length="inputValue.length"
        :max="$attrs.maxlength"
      />
      <span v-if="suffix">{{ suffix }}</span>
    </div>
    <IconOrComponent class="md-input-icon right" :icon="rightIcon" />
  </div>
</template>
