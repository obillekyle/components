import Text from './text.vue'
import Floater from './floater.vue'
import AwaitedText from './awaited-text.vue'
import Scroller from './scroller.vue'

type TextComponent = typeof Text & {
  Floater: typeof Floater
  Awaited: typeof AwaitedText
  Scroller: typeof Scroller
}

const TextElem = Text as TextComponent

Text.Floater = Floater
Text.Awaited = AwaitedText
Text.Scroller = Scroller

export default TextElem
export { Text, Floater, AwaitedText, Scroller }
