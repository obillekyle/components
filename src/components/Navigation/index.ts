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
export {
  NavigationBar,
  NavigationContainer,
  navigationContent,
  NavigationEntry,
  NavigationItem
}
