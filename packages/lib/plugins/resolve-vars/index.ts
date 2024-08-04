import { ColorEngine } from '../../src/utils/color-engine'
import { DefaultElementSizes, DefaultSizes, sizes } from './defaults'

function toCamelCase(string_: string) {
  return string_
    .replaceAll(/-([a-z])/g, (match) => match[1].toUpperCase())
    .replaceAll(/\s+/g, '')
}

export function resolver() {
  const defSizes = DefaultSizes as any
  const defElems = DefaultElementSizes as any

  const engine = new ColorEngine('#0af')
  const colors: Record<string, string> = engine.getColorVariables('light')
  const shades: Record<string, string> = engine.getShades('light')

  function setVariables(content: string): string {
    if (typeof content !== 'string') return content

    const VAR_OTHER = /var\(--([\w-]+)\)/g
    const VAR_SIZES = /var\((--(\w*|\w*-\w*))\)/g

    content = content.replaceAll(
      VAR_SIZES,
      (match, variableTxt, sizeString) => {
        const [category, size] = sizeString.split('-')

        if (category in defElems && size in sizes) {
          return `var(${variableTxt},${defSizes.size[size]}px)`
        }

        if (!size && !sizes.includes(category)) return match
        if (!size && sizes.includes(category)) {
          return `var(--${category},${defSizes.padding[category]}px)`
        }

        if (!(category in defSizes)) return match
        return `var(${variableTxt},${defSizes[category][size]}px)`
      }
    )

    content = content.replaceAll(VAR_OTHER, (match, key) => {
      const variable = toCamelCase(key)
      if (variable in shades) {
        return `var(--${key},${shades[variable]})`
      }

      if (key in colors) {
        return `var(--${key},${colors[variable]})`
      }

      return match
    })

    return content
  }

  return setVariables
}
