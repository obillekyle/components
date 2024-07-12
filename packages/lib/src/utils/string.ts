import { evaluate } from './object'
import type { TemplateString } from './types'

export function escapeHtml(unsafeText: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }

  return unsafeText.replace(/[&<>"']/g, (match) => map[match])
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
  return unsafeText.replace(regex, (match) => map[match])
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

export function reverseString(str: string) {
  return str.split('').reverse().join('')
}

export function fixLineBreaks(str: string) {
  if (str === '' || str === '\n') return ''
  let text = ''
  let skip = true

  str = str.endsWith('\n') ? str.slice(0, -1) : str
  const arr = str.split('\n') as string[]

  for (let i = 0; i < arr.length; i++) {
    const line = arr[i].replace('\r', '')
    if (i == 0 && line == '') {
      text += '\n'
      continue
    } else if (arr[i - 1] == '' && line == '' && skip) {
      text += ''
      skip = false
      continue
    } else if (line == '' && i !== arr.length - 1) {
      text += '\n'
      skip = true
      continue
    } else if (line == '' && i === arr.length - 1) {
      continue
    } else if (i == arr.length - 1) {
      text += line
      skip = false
      break
    }

    text += `${line}\n`
    skip = false
  }

  return text
}

export class MutableString extends String {
  constructor(str: string) {
    super(str)
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
}

function toRegularString(parts: TemplateString[0], ...args: any[]): string {
  return parts.reduce(
    (result, part, i) =>
      result + part + (args[i] ? String(evaluate(args[i])) : ''),
    ''
  )
}

export const mt = (...args: TemplateString | [string]) => {
  return new MutableString(toRegularString(args))
}
