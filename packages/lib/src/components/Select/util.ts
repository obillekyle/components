export type SelectItem = {
  label: string
  value: string
}

export function toSelectItems(
  items: (string | number | SelectItem)[]
): SelectItem[] {
  return items.map((item) => {
    if (typeof item === 'object') return item
    const stringItem = String(item)
    return { value: stringItem, label: stringItem }
  })
}

export function toggleItem<T>(list: T[], value: T): T[] {
  const index = list.indexOf(value)
  return index === -1
    ? [...list, value]
    : list.filter((_, index_) => index_ !== index)
}

export function filterByLabel<T extends { label: string }>(
  list: T[],
  label: string
): T[] {
  return list.filter((item) => item.label.includes(label))
}
