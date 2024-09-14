import Box from './box.vue'
import Flex from './Flex/flex-box.vue'
export * from './Flex'
export * from './util'

type BoxComponent = typeof Box & {
  Flex: typeof Flex
}

export default Object.assign({}, Box, { Flex }) as BoxComponent

export { default as BoxElement } from './box.vue'
export { default as Flex } from './Flex'
