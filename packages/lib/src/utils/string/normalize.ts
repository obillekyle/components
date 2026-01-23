import { pipe } from '../function/pipe'

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}
const UNESCAPE_MAP: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
}
const ESCAPE_REGEX = new RegExp(
  `(${Object.keys(ESCAPE_MAP).join('|')})`,
  'g'
)
const UNESCAPE_REGEX = new RegExp(
  `(${Object.keys(UNESCAPE_MAP).join('|')})`,
  'g'
)

// TODO: refactor

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

export function escapeHtml(unsafeText: string): string {
  return pipe(
    unsafeText,
    (text) => text.replaceAll(ESCAPE_REGEX, (match) => ESCAPE_MAP[match])
  )
}

export function unescapeHtml(unsafeText: string): string {
  return pipe(
    unsafeText,
    (text) => text.replaceAll(UNESCAPE_REGEX, (match) => UNESCAPE_MAP[match])
  )
}
