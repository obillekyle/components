<script setup lang="ts">
  import type { Component, InputHTMLAttributes, Ref } from 'vue'
  import { onMounted, ref, useAttrs, watch } from 'vue'
  import NumberArrows from './number-arrows.vue'
  import IconOrComponent from '../icon-or-component.vue'
  import './style.scss'

  interface InputText extends /** @vue-ignore */ InputHTMLAttributes {
    leftIcon?: string | Component
    defaultValue?: number
    modelValue?: Ref<number>
  }

  const input = ref<HTMLInputElement | null>(null)
  const props = defineProps<InputText>()
  const model = defineModel<number>({
    default: 0
  })

  const attrs = useAttrs()

  watch(model, (val) => {
    const min = Number(attrs.min)
    const max = Number(attrs.max)

    if (isFinite(max)) {
      if (val > max) {
        model.value = max
      }
    }

    if (isFinite(min)) {
      if (min > val) {
        model.value = min
      }
    }
  })

  onMounted(() => {
    model.value ??= props.defaultValue ?? 0
  })

  defineExpose({
    value: model,
    input: input
  })
</script>

<template>
  <div class="md-input number" @click="() => input?.focus()">
    <IconOrComponent class="md-input-icon left" :icon="leftIcon" />
    <div class="md-input-content">
      <input type="number" v-bind="$attrs" v-model="model" ref="input" />
      <NumberArrows v-model="model" />
    </div>
  </div>
</template>
