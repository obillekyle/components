import Group from './button-group.vue'
import Button from './button.vue'
import Icon from './icon-button.vue'

type ButtonComponent = typeof Button & {
  Icon: typeof Icon
  Group: typeof Group
}

export default Object.assign({}, Button, { Icon, Group }) as ButtonComponent

export { default as ButtonGroup } from './button-group.vue'
export { default as ButtonElement } from './button.vue'
export { default as IconButton } from './icon-button.vue'
