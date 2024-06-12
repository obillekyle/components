import Text from './text.vue'
import Floater from './floater.vue'
import AwaitedText from './awaited-text.vue'

type TextComponent = typeof Text & {
  Floater: typeof Floater
  Awaited: typeof AwaitedText
}

export default Text as TextComponent
export { Text, Floater, AwaitedText }
