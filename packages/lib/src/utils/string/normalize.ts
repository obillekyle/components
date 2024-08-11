import { pipe } from '../function/pipe'

export function normalizeNewLines(string_: string) {
  if (string_ === '' || string_ === '\n') return ''
  let text = ''
  let skip = true

  string_ = string_.endsWith('\n') ? string_.slice(0, -1) : string_
  const array = string_.split('\n')

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

/** @deprecated use ```normalizeNewLines``` instead */
export const fixLineBreaks = normalizeNewLines

export function escapeHtml(unsafeText: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }

  return pipe(
    Object.keys(map),
    (keys) => keys.join('|'),
    (match) => new RegExp(`(${match})`, 'g'),
    (regex) => unsafeText.replaceAll(regex, (match) => map[match])
  )
}

export function unescapeHtml(unsafeText: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  }

  return pipe(
    Object.keys(map),
    (keys) => keys.join('|'),
    (match) => new RegExp(`(${match})`, 'g'),
    (regex) => unsafeText.replaceAll(regex, (match) => map[match])
  )
}
