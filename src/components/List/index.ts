import List from './list.vue'
import listItem from './list-item.vue'

type ListComponent = typeof List & {
  Item: typeof listItem
}

const ListComp = List as ListComponent
ListComp.Item = listItem

export default ListComp
