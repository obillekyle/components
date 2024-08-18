<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { computed } from 'vue'
  import CircularProgress from '../Progress/circular-progress.vue'

  const props = defineProps<{
    progress: number
    ready: boolean
    error: boolean
    onRetry: () => void
  }>()

  const loading = computed(() => !props.ready && !props.error)
  const value = computed(() =>
    loading.value ? (props.progress >= 100 ? Infinity : props.progress) : 0
  )
</script>

<template>
  <transition name="md-loader">
    <div class="md-loader-default" v-if="!ready">
      <CircularProgress :value :rotate="!ready">
        <Icon
          icon="material-symbols:refresh"
          :width="24"
          v-if="error"
          @click="onRetry"
          :inline="false"
          style="cursor: pointer"
          color="var(--error, red)"
        />
      </CircularProgress>
    </div>
  </transition>
</template>
