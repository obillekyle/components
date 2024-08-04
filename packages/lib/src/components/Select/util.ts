export type SelectItem = {
  readonly id: string | number
  readonly name: string
  [key: string]: any
}

export function toSelectItems(
  items: (string | number | SelectItem)[]
): SelectItem[] {
  return items.map((item) => {
    if (typeof item === 'object') return item
    const stringItem = String(item)
    return { id: stringItem, name: stringItem }
  })
}

export function toggleItem<T>(list: T[], item: T): T[] {
  const index = list.indexOf(item)
  return index === -1
    ? [...list, item]
    : list.filter((_, index_) => index_ !== index)
}

export function filterByName<T extends { name: string }>(
  list: T[],
  name: string
): T[] {
  return list.filter((item) => item.name.includes(name))
}
