import ChipGroup from './chip-group.vue'
import Chip from './chip.vue'

type ChipComponent = typeof Chip & {
  Group: typeof ChipGroup
}

const ChipElement = Chip as ChipComponent
ChipElement.Group = ChipGroup

export default ChipElement

export { default as ChipGroup } from './chip-group.vue'
export { default as ChipElement } from './chip.vue'
