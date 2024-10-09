<script setup lang="ts">
  import dayjs from 'dayjs'

  import { onMounted, inject, ref, onUnmounted } from 'vue'
  import { Icon } from '@iconify/vue'

  let timeout: any = 0
  const uptime = ref('')
  const start = inject('start-time', dayjs())

  defineOptions({ name: 'MdWidgetUptime' })

  function getTime() {
    let value = ''
    const now = dayjs()

    const days = now.diff(start, 'days')
    const hours = now.diff(start, 'hours') % 24
    const minutes = now.diff(start, 'minutes') % 60
    const seconds = now.diff(start, 'seconds') % 60

    value += days ? `${days}d ` : ''
    value += hours ? `${hours}h ` : ''
    value += minutes ? `${minutes}m ` : ''
    value += seconds ? `${seconds}s` : ''

    uptime.value = value
  }

  onMounted(() => {
    getTime()
    timeout = setInterval(getTime, 1000)
  })

  onUnmounted(() => clearInterval(timeout))
</script>

<template>
  <div class="md-widget-uptime">
    <div class="md-uptime-title">Uptime</div>
    <div class="md-uptime-value">
      <Icon icon="mdi:arrow-up-bold-outline" :width="24" />
      <span class="md-uptime-value-text">
        {{ start.format('MMM d, YYYY:  h:mm a') }}
      </span>
    </div>
    <div class="md-uptime-value">
      <Icon icon="mdi:clock-outline" :width="24" />
      <span class="md-uptime-value-text">
        {{ uptime }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
  .md-uptime-value {
    display: flex;
    align-items: center;
    gap: var(--xxs);
    margin-top: var(--xxs);
  }
</style>
