import NavigationBar from './navigation-bar.vue'
import Container from './navigation-container.vue'
import Content from './navigation-content.vue'
import Entry from './navigation-entry.vue'
import Item from './navigation-item.vue'

type NavigationComponent = typeof NavigationBar & {
  Bar: typeof NavigationBar
  Container: typeof Container
  Content: typeof Content
  Entry: typeof Entry
  Item: typeof Item
}

export default Object.assign({}, NavigationBar, {
  Container,
  Content,
  Entry,
  Item
}) as NavigationComponent

export { default as NavigationBar } from './navigation-bar.vue'
export { default as NavigationContainer } from './navigation-container.vue'
export { default as navigationContent } from './navigation-content.vue'
export { default as NavigationEntry } from './navigation-entry.vue'
export { default as NavigationItem } from './navigation-item.vue'
