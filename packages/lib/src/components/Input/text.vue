<script setup lang="ts">
  import '@/assets/input.scss'
  import type { Component, InputHTMLAttributes } from 'vue'

  import { useValue } from '@/ref/use-form-value'

  import { ref } from 'vue'
  import HybridIcon from '../Misc/hybrid-icon.vue'
  import Counter from './char-counter.vue'

  interface InputText
    extends /** @vue-ignore */ Omit<InputHTMLAttributes, 'onChange'> {
    leftIcon?: string | Component
    rightIcon?: string | Component
    placeholder?: string
    value?: string
    defaultValue?: string
    prefix?: string
    suffix?: string
    name?: string
    variant?: 'filled' | 'outlined'
    counter?: boolean
    span?: boolean
  }

  type InputTextEmits = {
    (e: 'change', value: string): void
  }

  const inputRef = ref<HTMLInputElement>()
  const props = defineProps<InputText>()
  const model = defineModel<string>()
  const emit = defineEmits<InputTextEmits>()
  defineOptions({ name: 'MdInputText' })

  const inputValue = useValue('', props, model, (value) => {
    emit('change', value)
    return value
  })
</script>

<template>
  <div
    class="md-input text"
    @click="inputRef?.focus()"
    :class="{ span, [variant ?? 'filled']: true }"
  >
    <HybridIcon class="md-input-icon left" :icon="leftIcon" />
    <div class="md-input-content" :data-placeholder="placeholder">
      <span v-if="prefix">{{ prefix }}</span>
      <input
        :name
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
    <HybridIcon class="md-input-icon right" :icon="rightIcon" />
  </div>
</template>
