type WidgetInfo = {
  name: string
  icon: string
  description: string
}

export const WIDGETS: Record<string, WidgetInfo> = {
  clock: {
    name: 'Clock',
    icon: 'mdi:clock-outline',
    description: 'Show time and date'
  },
  network: {
    name: 'Network',
    icon: 'mdi:network-outline',
    description: 'Show network information'
  },
  gh_graph: {
    name: 'GitHub Contribution Calendar',
    icon: 'mdi:github',
    description: 'Show your github cantribution calendar'
  },
  uptime: {
    name: 'Uptime',
    icon: 'mdi:clock-outline',
    description: 'Show uptime information'
  },
  battery: {
    name: 'Battery',
    icon: 'material-symbols:battery-0-bar',
    description: 'Show battery percentage'
  }
}

export const DEFAULT_WIDGETS = [
  'clock',
  'network',
  'gh_graph',
  'uptime',
  'battery'
]
