export function toKebabCase(string_: string) {
  return string_
    .replaceAll(/([\da-z])([A-Z])/g, '$1-$2')
    .replaceAll(/[\s,_]+/g, '-')
    .toLowerCase()
}

export function toCamelCase(string_: string): string {
  return string_
    .replaceAll(/[\s_-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^[A-Z]/, (match) => match.toLowerCase())
}

export function toPascalCase(input: string): string {
  return input
    .split(/[\s,_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
}
