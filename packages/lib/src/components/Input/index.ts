import Number from './number-input.vue'
import Text from './text-input.vue'

type InputComponent = typeof Text & {
  Number: typeof Number
  Text: typeof Text
}

export default Object.assign({}, Text, { Text, Number }) as InputComponent

export { default as NumberInput } from './number-input.vue'
export { default as TextInput } from './text-input.vue'
