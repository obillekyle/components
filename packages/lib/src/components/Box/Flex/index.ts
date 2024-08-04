import FlexBox from './flex-box.vue'
import FlexSpan from './flex-span.vue'

type FlexBoxComponent = typeof FlexBox & { Span: typeof FlexSpan }

const Flex: FlexBoxComponent = FlexBox as FlexBoxComponent
Flex.Span = FlexSpan

export default Flex

export { default as FlexBox } from './flex-box.vue'
export { default as FlexSpan } from './flex-span.vue'
