<script setup lang="ts">
  import { onMounted, onUnmounted, reactive } from 'vue'
  import { Icon } from '@iconify/vue'

  defineOptions({ name: 'MdWidgetNetwork' })

  const networkIcons: any = {
    undefined: 'material-symbols:perm-scan-wifi-outline',
    online: 'material-symbols:signal-wifi-statusbar-not-connected',
    offline: 'material-symbols:signal-wifi-off-outline',
    wifi: 'material-symbols:signal-wifi-4-bar',
    ethernet: 'material-symbols:settings-ethernet',
    bluetooth: 'material-symbols:bluetooth',
    cellular: 'material-symbols:signal-cellular-4-bar',
    other: 'material-symbols:signal-wifi-statusbar-not-connected'
  }

  const network = reactive({
    type: 'undefined',
    ip: ''
  })

  async function fetchInfo() {
    const online = navigator.onLine

    if (!online) {
      network.type = 'offline'
      network.ip = ''
      return
    }

    network.type =
      'connection' in navigator
        ? (navigator.connection as any).type || 'other'
        : 'online'

    const req = await fetch('https://api.ipify.org/?format=json')

    if (req.ok) {
      const json = await req.json()
      network.ip = json.ip
    }

    if (!network.ip) {
      network.type = 'offline'
    }
  }

  onMounted(() => {
    fetchInfo()
    window.addEventListener('online', fetchInfo)
    window.addEventListener('offline', fetchInfo)
  })

  onUnmounted(() => {
    window.removeEventListener('online', fetchInfo)
    window.removeEventListener('offline', fetchInfo)
  })
</script>

<template>
  <div class="md-widget-network">
    <div class="md-network-connection">
      <div class="md-network-connection-info">
        <Icon :icon="networkIcons[network.type]" :width="24" />
        <span v-if="network.type === 'other'">Wi-Fi (unknown)</span>
        <span v-else>{{ network.type }}</span>
      </div>

      <div class="md-network-connection-info">
        <Icon icon="material-symbols:settings-ethernet" :width="24" />
        <span>{{ network.ip }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .md-network-connection-info {
    display: flex;
    gap: var(--sm);
    line-height: 1;
    align-items: center;

    span {
      margin-top: var(--xxs);
    }

    & + & {
      margin-top: var(--xs);
    }
  }
</style>
