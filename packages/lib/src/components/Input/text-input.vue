<script setup lang="ts">
  import './style.scss'

  import type { InputHTMLAttributes, Component } from 'vue'
  import type { AppSizes } from '@/utils/css'

  import Counter from './counter.vue'
  import IconOrComponent from '../Misc/icon-or-component.vue'
  import { ref, onBeforeMount } from 'vue'
  import { getCSSValue } from '@/utils/css'

  interface InputText
    extends /** @vue-ignore */ Omit<InputHTMLAttributes, 'height'> {
    leftIcon?: string | Component
    rightIcon?: string | Component
    defaultValue?: string
    radius?: 'rounded' | AppSizes | String | number
    height?: AppSizes | String | number
    counter?: boolean
    span?: boolean
  }

  const inputRef = ref<HTMLInputElement | null>(null)
  const props = withDefaults(defineProps<InputText>(), {
    // eslint-disable-next-line vue/require-valid-default-prop
    height: 'md',
    radius: 'xs',
    span: false,
    counter: false
  })
  const model = defineModel<string>({
    default: ''
  })

  onBeforeMount(() => {
    model.value ??= props.defaultValue ?? ''
  })

  defineExpose({
    value: model,
    input: inputRef
  })
</script>

<template>
  <div
    class="md-input text"
    :class="{ span }"
    @click="() => inputRef?.focus()"
    :style="{
      '--radius': getCSSValue(props.radius),
      '--height': getCSSValue(props.height, 'px', 'size')
    }"
  >
    <IconOrComponent class="md-input-icon left" :icon="leftIcon" />
    <div class="md-input-content">
      <input type="text" v-bind="$attrs" v-model="model" ref="inputRef" />
      <Counter
        v-if="counter"
        :length="model.length"
        :max="$attrs.maxlength"
      />
    </div>
    <IconOrComponent class="md-input-icon right" :icon="rightIcon" />
  </div>
</template>
