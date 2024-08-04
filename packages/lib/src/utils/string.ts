export function escapeHtml(unsafeText: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }

  return unsafeText.replaceAll(/["&'<>]/g, (match) => map[match])
}

export function unescapeHtml(unsafeText: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  }

  const regex = new RegExp(`(${Object.keys(map).join('|')})`, 'g')
  return unsafeText.replaceAll(regex, (match) => map[match])
}

export function insertAt(text: string, index: number, value: string) {
  return text.slice(0, index) + value + text.slice(index)
}

export function replaceRange(
  text: string,
  [start, end]: [number, number],
  value: string
) {
  return text.slice(0, start) + value + text.slice(end)
}

export function reverseString(string: string) {
  return [...string].reverse().join('')
}

export function fixLineBreaks(string_: string) {
  if (string_ === '' || string_ === '\n') return ''
  let text = ''
  let skip = true

  string_ = string_.endsWith('\n') ? string_.slice(0, -1) : string_
  const array = string_.split('\n') as string[]

  for (let index = 0; index < array.length; index++) {
    const line = array[index].replace('\r', '')
    if (index == 0 && line == '') {
      text += '\n'
      continue
    } else if (array[index - 1] == '' && line == '' && skip) {
      text += ''
      skip = false
      continue
    } else if (line == '' && index !== array.length - 1) {
      text += '\n'
      skip = true
      continue
    } else if (line == '' && index === array.length - 1) {
      continue
    } else if (index == array.length - 1) {
      text += line
      skip = false
      break
    }

    text += `${line}\n`
    skip = false
  }

  return text
}

export function hashStr(string_: string, limit?: number) {
  let hash = 5381
  for (let index = 0; index < string_.length; index++) {
    hash = (hash * 33) ^ (string_.codePointAt(index) ?? 0)
  }
  return (hash >>> 0).toString(16).slice(0, limit)
}

export function toKebabCase(string_: string) {
  return string_
    .replaceAll(/([\da-z])([A-Z])/g, '$1-$2')
    .replaceAll(/\s+/g, '-')
    .toLowerCase()
}

export function toCamelCase(string_: string) {
  return string_
    .replaceAll(/-([a-z])/g, (match) => match[1].toUpperCase())
    .replaceAll(/\s+/g, '')
}

export function toPascalCase(str: string) {
  if (str.includes('-')) {
    return str
      .split('-')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('')
  }

  return str[0].toUpperCase() + str.slice(1)
}

export class MutableString extends String {
  constructor(string_: string) {
    super(string_)
  }

  fixLineBreaks() {
    return new MutableString(fixLineBreaks(this.toString()))
  }

  replaceRange([start, end]: [number, number], replace: string) {
    return new MutableString(
      replaceRange(this.toString(), [start, end], replace)
    )
  }

  insert(index: number, replace: string) {
    return new MutableString(insertAt(this.toString(), index, replace))
  }

  reverse() {
    return new MutableString(reverseString(this.toString()))
  }

  escape() {
    return new MutableString(escapeHtml(this.toString()))
  }

  unescape() {
    return new MutableString(unescapeHtml(this.toString()))
  }

  toKebabCase() {
    return new MutableString(toKebabCase(this.toString()))
  }

  toCamelCase() {
    return new MutableString(toCamelCase(this.toString()))
  }

  toPascalCase() {
    return new MutableString(toPascalCase(this.toString()))
  }
}

type TemplateString = { raw: readonly string[] | ArrayLike<string> }

export const mt = (
  template: TemplateString | string,
  ...args: unknown[]
) => {
  return new MutableString(
    typeof template === 'string' ? template : String.raw(template, ...args)
  )
}
