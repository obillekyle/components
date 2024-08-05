import { $, toKebabCase } from '@vue-material/core'
import animatedScrollTo from 'animated-scroll-to'
import { type Router } from 'vue-router'

export type MetaOptions = {
  title?: string
  description?: string
  source?: string
  hide?: boolean
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
      scrollTo(parent, element, -2)
      history.pushState(true, '', hash)
    }
  }
}

export function handleContentClick(event: MouseEvent, router: Router) {
  const parent = event.currentTarget as HTMLElement
  const target = event.target as HTMLElement
  const link = target.closest('a') as HTMLAnchorElement
  if (link) {
    event.preventDefault()
    const isOutbound = link.host !== location.host
    if (isOutbound) {
      window.open(link.href, '_blank')
      return
    }

    if (
      link.hash === location.hash &&
      location.pathname === link.pathname
    ) {
      scrollToHash(parent, link.hash)
      return
    }
    router.push(link.pathname + link.hash)
  }

  const header = target.closest('h1, h2, h3') as HTMLElement
  if (header && header.id) {
    scrollToHash(parent, `#${header.id}`)
  }
}
