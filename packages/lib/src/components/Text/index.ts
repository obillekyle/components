import Awaited from './awaited-text.vue'
import Floater from './floater.vue'
import Scroller from './scroller.vue'
import Text from './text.vue'

type TextComponent = typeof Text & {
  Floater: typeof Floater
  Awaited: typeof Awaited
  Scroller: typeof Scroller
}

export default Object.assign({}, Text, {
  Text,
  Awaited,
  Floater,
  Scroller
}) as TextComponent

export { default as AwaitedText } from './awaited-text.vue'
export { default as Floater } from './floater.vue'
export { default as Scroller } from './scroller.vue'
export { default as TextElement } from './text.vue'
