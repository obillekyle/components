import NavigationBar from './navigation-bar.vue'
import NavigationContainer from './navigation-container.vue'
import navigationContent from './navigation-content.vue'
import NavigationEntry from './navigation-entry.vue'
import NavigationItem from './navigation-item.vue'

type NavigationComponent = typeof NavigationBar & {
  Bar: typeof NavigationBar
  Container: typeof NavigationContainer
  Content: typeof navigationContent
  Entry: typeof NavigationEntry
  Item: typeof NavigationItem
}

const Navigation = NavigationBar as NavigationComponent
Navigation.Bar = NavigationBar
Navigation.Container = NavigationContainer
Navigation.Content = navigationContent
Navigation.Entry = NavigationEntry
Navigation.Item = NavigationItem

export default Navigation

export { default as NavigationBar } from './navigation-bar.vue'
export { default as NavigationContainer } from './navigation-container.vue'
export { default as navigationContent } from './navigation-content.vue'
export { default as NavigationEntry } from './navigation-entry.vue'
export { default as NavigationItem } from './navigation-item.vue'
