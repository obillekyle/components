/* eslint-disable unicorn/no-null */

type QuerySelector = {
  <T extends Element = HTMLElement>(
    selector: string,
    element?: Element | EventTarget | null
  ): T | undefined
}

export const $: QuerySelector = (selector, element): any => {
  if (element === null) return
  return element instanceof Element
    ? element.querySelector(selector)
    : document.querySelector(selector)
}

type GetParent = {
  <T extends Element = HTMLElement>(
    element: Element | EventTarget | null,
    selector: string,
    self?: boolean,
    deep?: number
  ): T | undefined
}

export const getParent: GetParent = (elem, sel, self, deep = 10): any => {
  if (deep <= 0 || !elem) return
  if (elem instanceof Element) {
    if (self && elem.matches(sel)) return elem
    return getParent(elem.parentElement, sel, true, deep - 1)
  }
}
