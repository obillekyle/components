import Group from './chip-group.vue'
import Chip from './chip.vue'

type ChipComponent = typeof Chip & {
  Group: typeof Group
}

export default Object.assign({}, Chip, { Group }) as ChipComponent

export { default as ChipGroup } from './chip-group.vue'
export { default as ChipElement } from './chip.vue'
