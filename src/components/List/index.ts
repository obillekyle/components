import List from './list.vue'
import ListItem from './list-item.vue'

type ListComponent = typeof List & {
  Item: typeof ListItem
}

const ListComp = List as ListComponent
ListComp.Item = ListItem

export default ListComp
export { List, ListItem }
