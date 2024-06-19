import FlexBox from './flex-box.vue'
import FlexSpan from './flex-span.vue'

type FlexBoxComponent = typeof FlexBox & { Span: typeof FlexSpan }

const Flex: FlexBoxComponent = FlexBox as FlexBoxComponent
Flex.Span = FlexSpan

export { FlexBox, FlexSpan }
export default Flex
