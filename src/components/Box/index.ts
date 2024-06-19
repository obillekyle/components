import Box from './box.vue'
import Flex from './Flex'
export * from './util'
export * from './Flex'

type BoxComponent = typeof Box & {
  Flex: typeof Flex
}

const BoxElement: BoxComponent = Box as BoxComponent
BoxElement.Flex = Flex

export default BoxElement
export { Box, Flex }
