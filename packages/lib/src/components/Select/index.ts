import OptionItem from './option-item.vue'
import Select from './select.vue'

type SelectComponent = typeof Select & {
  Item: typeof OptionItem
}

const SelectComponent = Select as SelectComponent
SelectComponent.Item = OptionItem

export default SelectComponent

export { default as OptionItem } from './option-item.vue'
export { default as SelectElement } from './select.vue'
