<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  defineOptions({ name: 'MdWidgetBattery' })

  let timeout: any = 0
  const battery = ref(0)

  async function getBattery() {
    if (
      'getBattery' in navigator &&
      typeof navigator.getBattery == 'function'
    ) {
      const Battery = await navigator.getBattery()
      battery.value = Battery.level * 100
    }
  }

  onMounted(() => {
    getBattery()
    timeout = setInterval(getBattery, 1000)
  })

  onUnmounted(() => clearInterval(timeout))
</script>

<template>
  <div class="md-widget-battery">{{ battery }}%</div>
</template>
