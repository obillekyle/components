import Checkbox from './checkbox.vue'
import Number from './number.vue'
import Text from './text.vue'

import RadioItem from './radio-item.vue'
import RadioElement from './radio.vue'

type RadioComponent = typeof RadioElement & {
  Item: typeof RadioItem
}

type InputComponent = typeof Text & {
  Text: typeof Text
  Number: typeof Number
  Checkbox: typeof Checkbox
  Radio: RadioComponent
}

const Radio = Object.assign({}, RadioElement, {
  Item: RadioItem
}) as RadioComponent

export default Object.assign({}, Text, {
  Text,
  Number,
  Checkbox,
  Radio
}) as InputComponent

export { default as Checkbox } from './checkbox.vue'
export { default as NumberInput } from './number.vue'
export { default as TextInput } from './text.vue'
export { Radio }
