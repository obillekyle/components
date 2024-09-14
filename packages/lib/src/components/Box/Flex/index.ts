import Flex from './flex-box.vue'
import Span from './flex-span.vue'

type FlexBoxComponent = typeof Flex & { Span: typeof Span }

export default Object.assign({}, Flex, { Span }) as FlexBoxComponent

export { default as FlexBox } from './flex-box.vue'
export { default as FlexSpan } from './flex-span.vue'
