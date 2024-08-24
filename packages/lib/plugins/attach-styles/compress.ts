const CSS_DECLARATIONS = /(?<={)([^}]+)(?=})/g

export class Compressor {
  private map = new Map<string, string>()
  private increment = 0

  getKey(property: string) {
    if (property.startsWith('-')) return property
    if (this.map.has(property)) return this.map.get(property)!

    const newKey = (this.increment++).toString(36)
    this.map.set(property, newKey)
    return newKey
  }

  compress(css: string) {
    return css.replaceAll(CSS_DECLARATIONS, (_, declarations: string) => {
      return declarations
        .split(';')
        .filter(Boolean)
        .map((property) => {
          property = property.trim()
          const [key, value] = property.split(':')
          return `${this.getKey(key)}:${value}`
        })
        .join(';')
    })
  }

  getMap() {
    const reverse = Object.fromEntries(
      [...this.map].map(([key, value]) => [value, key])
    )
    return "'" + JSON.stringify(reverse) + "'"
  }

  clearMap() {
    this.map.clear()
  }
}

export class Decompressor {
  private map = new Map<string, string>()

  constructor(map: string) {
    this.map = new Map(Object.entries(JSON.parse(map)))
  }

  decompress(css: string) {
    return css.replaceAll(CSS_DECLARATIONS, (_, declarations: string) => {
      return declarations
        .split(';')
        .map((property) => {
          const [key, value] = property.split(':')
          return this.map.get(key) + ':' + value
        })
        .join(';')
    })
  }
}
