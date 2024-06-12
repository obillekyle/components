import NumberInput from './number-input.vue'
import TextInput from './text-input.vue'

type InputComponent = typeof TextInput & {
  Number: typeof NumberInput
  Text: typeof TextInput
}

const Input = TextInput as InputComponent

Input.Number = NumberInput
Input.Text = TextInput

export default Input
