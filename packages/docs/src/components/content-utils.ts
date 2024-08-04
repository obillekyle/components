import { $, toKebabCase } from '@vue-material/core'
import animatedScrollTo from 'animated-scroll-to'

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

export function scrollTo(
  parent: HTMLElement,
  target: HTMLElement,
  offset = 0
) {
  const top = (target.offsetTop || 0) - offset

  animatedScrollTo(top, {
    elementToScroll: parent
  })
}

export function scrollToHash(parent: HTMLElement, hash: string) {
  if (hash.length > 1) {
    const element = $(hash)
    if (element) {
      scrollTo(parent, element, 62)
      history.pushState(true, '', hash)
    }
  }
}
