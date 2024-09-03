import type { SizeDict } from '@/utils/css/type'

import { addPX } from '@/utils/css/sizes'

export function getSizes(object: SizeDict, prefix: string) {
  const object_: Record<string, string> = {}
  const sizes = object as Record<string, number>

  for (const key in sizes) {
    object_[prefix + '-' + key] = addPX(sizes[key])
  }

  return object_
}
