import Button from './button.vue'
import IconButton from './icon-button.vue'
import ButtonGroup from './button-group.vue'

type ButtonComponent = typeof Button & {
  Icon: typeof IconButton
  Group: typeof ButtonGroup
}

const ButtonElement = Button as ButtonComponent
ButtonElement.Icon = IconButton
ButtonElement.Group = ButtonGroup

export { Button, IconButton, ButtonGroup }

export default ButtonElement
