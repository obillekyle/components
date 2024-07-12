import Chip from './chip.vue'
import ChipGroup from './chip-group.vue'

type ChipComponent = typeof Chip & {
  Group: typeof ChipGroup
}

const ChipElement = Chip as ChipComponent
ChipElement.Group = ChipGroup

export { Chip, ChipGroup }
export default ChipElement
