import {
  sizes,
  DefaultSizes,
  DefaultColors,
  DefaultElementSizes
} from './defaults'
import { Colors, isLight, toColorsObj } from './colors'

export function resolver() {
  const defColors = DefaultColors as any
  const defSizes = DefaultSizes as any
  const defElems = DefaultElementSizes as any

  const colors: Record<string, Colors> = {
    primary: toColorsObj(defColors.primary),
    secondary: toColorsObj(defColors.secondary),
    error: toColorsObj(defColors.error),
    mono: toColorsObj(defColors.mono)
  }

  function setVars(content: string): string {
    const VAR_OTHER = /var\((\w{1,})\)/g
    const VAR_COLOR =
      /var\((--([a-z]{1,})-(?:(\d{1,3}|\d{1,3}-\d{1,3})))\)/g
    const VAR_SIZES = /var\((--(\w*|\w*-\w*))\)/g

    content = content.replace(
      VAR_COLOR,
      (match, varTxt, color, variant) => {
        if (!(color in colors)) return match

        const [s, a] = variant.split('-')

        const shade = colors[color].shade(Number(s), a ? Number(a) : 1)
        const finalColor = a ? shade.hexa() : shade.hex()
        return `var(${varTxt}, ${finalColor})`
      }
    )

    content = content.replace(VAR_SIZES, (match, varTxt, sizeStr) => {
      const [category, size] = sizeStr.split('-')

      if (category in defElems && size in sizes) {
        return `var(${varTxt},${defSizes.size[size]}px)`
      }

      if (!size && !sizes.includes(category)) return match
      if (!size && sizes.includes(category)) {
        return `var(--${category},${defSizes.padding[category]}px)`
      }

      if (!(category in defSizes)) return match
      return `var(${varTxt},${defSizes[category][size]}px)`
    })

    content = content.replace(VAR_OTHER, (match, rawVar) => {
      const [p1, p2, p3] = rawVar.split('-')

      if (p1 in colors && !p2 && !p3) {
        const color = colors[p1].shade(50)
        return `var(--${rawVar},${color.hexa()})`
      }

      if (p1 === 'on' && p2 in colors && !p3) {
        const color = colors[p2].shade(50)
        const shade = colors[p2].shade(isLight(color) ? 5 : 95)
        return `var(--${rawVar},${shade.hexa()})`
      }

      if (p1 in colors && p2 === 'container' && !p3) {
        const color = colors[p1].shade(80)
        return `var(--${rawVar},${color.hexa()})`
      }

      if (p1 === 'on' && p2 in colors && p3 === 'container') {
        const color = colors[p2].shade(80)
        const shade = colors[p2].shade(isLight(color) ? 5 : 95)
        return `var(--${rawVar},${shade.hexa()})`
      }

      return match
    })

    return content
  }

  return setVars
}
