import Select from './select.vue'
import OptionItem from './option-item.vue'

type SelectComponent = typeof Select & {
  Item: typeof OptionItem
}

const SelectComponent = Select as SelectComponent
SelectComponent.Item = OptionItem

export default SelectComponent
export { Select, OptionItem }
