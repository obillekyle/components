import ButtonGroup from './button-group.vue'
import Button from './button.vue'
import IconButton from './icon-button.vue'

type ButtonComponent = typeof Button & {
  Icon: typeof IconButton
  Group: typeof ButtonGroup
}

const ButtonElement = Button as ButtonComponent
ButtonElement.Icon = IconButton
ButtonElement.Group = ButtonGroup

export default ButtonElement

export { default as ButtonGroup } from './button-group.vue'
export { default as ButtonElement } from './button.vue'
export { default as IconButton } from './icon-button.vue'
