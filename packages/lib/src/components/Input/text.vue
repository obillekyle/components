<script setup lang="ts">
  import '@/assets/input.scss'
  import type { Component, InputHTMLAttributes } from 'vue'

  import { useValue } from '@/ref/use-form-value'
  import { ref, computed } from 'vue'

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
    textbox?: boolean
  }

  type InputTextEmits = {
    (e: 'change', value: string): void
  }

  const inputRef = ref<HTMLInputElement>()
  const props = defineProps<InputText>()
  const model = defineModel<string>()
  const emits = defineEmits<InputTextEmits>()

  const inputValue = useValue('', props, model, (v) => emits('change', v))

  const area = computed(() => {
    const value = inputValue.value

    return {
      rows: value ? 3 : 1,
      empty: value.length === 0
    }
  })

  defineOptions({ name: 'MdInputText' })
</script>

<template>
  <div
    class="md-input text"
    @click="inputRef?.focus()"
    :class="variant ?? 'filled'"
    :empty="area.empty || undefined"
  >
    <div class="md-input-wrapper">
      <HybridIcon class="md-input-icon left" :icon="leftIcon" />
      <HybridIcon class="md-input-icon right" :icon="rightIcon" />
      <span class="md-input-placeholder">{{ placeholder }}</span>
      <span class="md-input-prefix" v-if="prefix">{{ prefix }}</span>
      <span class="md-input-suffix" v-if="suffix">{{ suffix }}</span>

      <textarea
        :name
        ref="inputRef"
        class="md-input-field"
        v-if="textbox"
        v-bind="$attrs"
        :rows="area.rows"
        v-model="inputValue"
      />
      <input
        :name
        v-else
        type="text"
        placeholder=""
        v-bind="$attrs"
        v-model="inputValue"
        class="md-input-field"
        ref="inputRef"
      />
      <Counter
        v-if="counter"
        :length="inputValue.length"
        :max="$attrs.maxlength"
      />
    </div>
  </div>
</template>
