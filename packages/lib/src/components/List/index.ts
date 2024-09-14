import Item from './list-item.vue'
import List from './list.vue'

type ListComponent = typeof List & {
  Item: typeof Item
}

export default Object.assign({}, List, { Item }) as ListComponent

export { default as ListItem } from './list-item.vue'
export { default as ListElement } from './list.vue'
