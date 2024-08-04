import { toKebabCase } from '@vue-material/core'

export type MetaOptions = {
  title?: string
  description?: string
  source?: string
  inherits?: string[]
}

export type Module = {
  default: any
  meta?: MetaOptions
}

export async function fetchComponent(category: string, file?: string) {
  let component: Module
  category = toKebabCase(category)

  if (file) {
    file = toKebabCase(file)

    try {
      component = await import(`#/${category}/${file}/index.mdx`)
    } catch {
      component = await import(`#/${category}/${file}.mdx`)
    }
  } else {
    try {
      component = await import(`#/${category}/index.mdx`)
    } catch {
      component = await import(`#/${category}.mdx`)
    }
  }

  return component
}
