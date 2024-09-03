import type { Component, Ref } from 'vue'

export type SwipeOptions = {
  left?: {
    icon: string | Component
    color: string
    handler: () => void
  }
  right?: {
    icon: string | Component
    color: string
    handler: () => void
  }
}

export type ListItemType = {
  value: string | number
  label: string | number
}

export type ListProps = {
  sortable?: boolean
  size?: number
  items?: (ListItemType | string | number)[]
  swipe?: 'dismiss' | 'custom' | 'off'
  listComp?: string | Component
  swipeDistance?: number
  swipeOptions?: SwipeOptions
}

export type ReorderArgs = {
  from: number
  to: number
  item: ListItemType
  value: ListItemType[]
}

export type DismissArgs = {
  index: number
  item: ListItemType
  value: ListItemType[]
}

export type ListEmits = {
  (event: 'reorder', emit: ReorderArgs): void
  (event: 'dismiss', emit: DismissArgs): void
}

export type UseList = {
  size: number
  sortable: boolean
  component: string | Component
  swipe: 'dismiss' | 'custom' | 'off'
  swipeDistance: number
  swipeOptions: SwipeOptions
  items: Ref<ListItemType[]>
  root: HTMLElement | undefined
  emit: ListEmits
}
