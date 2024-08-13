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
</script>

<template>
  <div class="md-default-loader">
    <CircularProgress :value="loading ? 0 : progress" :rotate="!ready">
      <Icon
        icon="material-symbols:refresh"
        :width="24"
        v-if="error"
        @click="onRetry"
        style="cursor: pointer"
        color="var(--error, red)"
      />
    </CircularProgress>
  </div>
</template>
