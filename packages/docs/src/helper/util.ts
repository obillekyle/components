export function toPascalCase(str: string) {
  if (str.includes('-')) {
    return str
      .split('-')
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
      .join('')
  }

  return str.replaceAll(
    /(\w)(\w*)/g,
    (_, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
  )
}
