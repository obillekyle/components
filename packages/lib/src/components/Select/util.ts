import type { ObjectValue } from '@/utils/other/to-object-value'

export function toggleItem<T>(list: T[], value: T): T[] {
  const index = list.indexOf(value)
  return index === -1
    ? [...list, value]
    : list.filter((_, index_) => index_ !== index)
}

export function filterByLabel(list: ObjectValue[], label: string) {
  return list.filter((item) => item.label.includes(label))
}
