import ListItem from './list-item.vue'
import List from './list.vue'

type ListComponent = typeof List & {
  Item: typeof ListItem
}

const ListComp = List as ListComponent
ListComp.Item = ListItem

export default ListComp

export { default as ListItem } from './list-item.vue'
export { default as ListElement } from './list.vue'
