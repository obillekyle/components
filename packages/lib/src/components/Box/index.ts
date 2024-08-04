import Box from './box.vue'
import Flex from './Flex'
export * from './Flex'
export * from './util'

type BoxComponent = typeof Box & {
  Flex: typeof Flex
}

const BoxElement: BoxComponent = Box as BoxComponent
BoxElement.Flex = Flex

export default BoxElement

export { default as BoxElement } from './box.vue'
export { default as Flex } from './Flex'
