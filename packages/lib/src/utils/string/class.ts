import { pipe } from '../function/pipe'
import { toCamelCase, toKebabCase, toPascalCase } from './cases'
import { escapeHtml, normalizeNewLines, unescapeHtml } from './normalize'
import { insertAt, replaceRange, reverseString } from './transform'

export class MutableString extends String {
  constructor(string_: string) {
    super(string_)
  }

  normalizeNewLines() {
    return pipe(
      this.toString(),
      (text) => normalizeNewLines(text),
      (text) => new MutableString(text)
    )
  }

  replaceRange([start, end]: [number, number], replace: string) {
    return pipe(
      this.toString(),
      (text) => replaceRange(text, [start, end], replace),
      (text) => new MutableString(text)
    )
  }

  insert(index: number, replace: string) {
    return pipe(
      this.toString(),
      (text) => insertAt(text, index, replace),
      (text) => new MutableString(text)
    )
  }

  reverse() {
    return pipe(
      this.toString(),
      (text) => reverseString(text),
      (text) => new MutableString(text)
    )
  }

  escape() {
    return pipe(
      this.toString(),
      (text) => escapeHtml(text),
      (text) => new MutableString(text)
    )
  }

  unescape() {
    return pipe(
      this.toString(),
      (text) => unescapeHtml(text),
      (text) => new MutableString(text)
    )
  }

  toKebabCase() {
    return pipe(
      this.toString(),
      (text) => toKebabCase(text),
      (text) => new MutableString(text)
    )
  }

  toCamelCase() {
    return pipe(
      this.toString(),
      (text) => toCamelCase(text),
      (text) => new MutableString(text)
    )
  }

  toPascalCase() {
    return pipe(
      this.toString(),
      (text) => toPascalCase(text),
      (text) => new MutableString(text)
    )
  }
}

type TemplateString =
  | { raw: readonly string[] | ArrayLike<string> }
  | string

function fromRaw(str: TemplateString, ...args: unknown[]) {
  return typeof str === 'string' ? str : String.raw(str, ...args)
}

export const mt = (template: TemplateString, ...args: unknown[]) => {
  return pipe(
    template,
    (template) => fromRaw(template, ...args),
    (template) => new MutableString(template)
  )
}
