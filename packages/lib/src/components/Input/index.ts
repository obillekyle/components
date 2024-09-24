import Checkbox from './checkbox.vue'
import Number from './number.vue'
import Text from './text.vue'

type InputComponent = typeof Text & {
  Number: typeof Number
  Text: typeof Text
  Checkbox: typeof Checkbox
}

export default Object.assign({}, Text, {
  Text,
  Number,
  Checkbox
}) as InputComponent

export { default as Checkbox } from './checkbox.vue'
export { default as NumberInput } from './number.vue'
export { default as TextInput } from './text.vue'
