export type SelectItem = {
  label: string
  value: string | number
}

export function toSelectItems(
  items: (number | string | SelectItem)[]
): SelectItem[] {
  return items.map((item) =>
    typeof item === 'object' ? item : { value: item, label: String(item) }
  )
}

export function toggleItem<T>(list: T[], value: T): T[] {
  const index = list.indexOf(value)
  return index === -1
    ? [...list, value]
    : list.filter((_, index_) => index_ !== index)
}

export function filterByLabel(list: SelectItem[], label: string) {
  return list.filter((item) => item.label.includes(label))
}
