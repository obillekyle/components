/* eslint-disable unicorn/no-null */

type QuerySelector = {
  <T extends Element = HTMLElement>(
    selector: string,
    element?: Element | null
  ): T | null
}

export const $: QuerySelector = (selector, element) => {
  return ((element as Element) || document).querySelector(selector)
}

type GetParent = {
  <T extends Element = HTMLElement>(
    element: Element | null,
    selector: string,
    self?: boolean,
    deep?: number
  ): T | null
}

export const getParent: GetParent = (elem, sel, self, deep = 10): any => {
  if (deep <= 0 || !elem) return null
  if (self && elem.matches(sel)) return elem
  return getParent(elem.parentElement, sel, true, deep - 1)
}
