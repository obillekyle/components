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
