<script setup lang="ts">
  import type { InputHTMLAttributes } from 'vue'

  import { useValue } from '@/ref/use-form-value'
  import { provide } from 'vue'

  interface RadioProps {
    inputAttrs?: InputHTMLAttributes
    defaultValue?: string
    value?: string
    name?: string
  }

  interface RadioEmits {
    (e: 'change', value: string | undefined): void
  }

  const props = defineProps<RadioProps>()
  const emits = defineEmits<RadioEmits>()
  const model = defineModel<string | undefined>({ default: undefined })
  const value = useValue(undefined, props, model, (v) => emits('change', v))

  defineOptions({ name: 'MdRadio' })
  provide('md-radio-active', value)
</script>

<template>
  <div class="md-radio-group">
    <slot />
  </div>
</template>
