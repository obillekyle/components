<script setup lang="ts">
  import { onMounted, ref, watch, type Component } from 'vue'

  interface AwaitedTextProps {
    text: Promise<string>
    fallback?: string
    element?: Component | string
  }

  const awaitedText = ref('')
  const props = defineProps<AwaitedTextProps>()
  defineOptions({ name: 'MdAwaitedText' })

  onMounted(async () => {
    const value = await props.text
    awaitedText.value = value
  })

  watch(props, async () => {
    const value = await props.text
    awaitedText.value = value
  })
</script>

<template>
  <component :is="props.element ?? 'span'" v-if="awaitedText">
    {{ awaitedText }}
  </component>
</template>
