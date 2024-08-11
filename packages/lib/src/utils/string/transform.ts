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
