import { ColorEngine } from '../../src/utils/color-engine'
import { DefaultSizes } from '../../src/utils/css/defaults'
import { toKebabCase } from '../../src/utils/string/cases'

const engine = new ColorEngine('#4a5')
const colors = {
  light: engine.getColorVariables('light'),
  dark: engine.getColorVariables('dark')
}

export function getGlobal() {
  let css = ''

  css += ':root{'

  for (const [prefix, dict] of Object.entries(DefaultSizes))
    for (const [suffix, value] of Object.entries(dict)) {
      if (prefix === 'padding') {
        css += `--${suffix}:${value}px;`
      }
      css += `--${prefix}-${suffix}:${value}px;`
    }

  css += '--header-size: var(--component-sm);'
  css += '--navbar-size: var(--component-lg);'
  css += '--fab-size: var(--component-xs);'

  for (const [key, value] of Object.entries(colors.light)) {
    css += `--${toKebabCase(key)}:${value};`
  }

  css += '--shadow-1: 0 1px 2px #0004, 0 1px 3px 1px #0002;'
  css += '--shadow-2: 0 1px 2px #0004, 0 2px 6px 2px #0002;'
  css += '--shadow-3: 0 1px 3px #0004, 0 3px 8px 3px #0002;'
  css += '--timing-standard: cubic-bezier(0.4, 0, 0.2, 1);'

  css += '}'
  // css += '@media (prefers-color-scheme: dark){'
  // css += ':root{'

  // for (const [key, value] of Object.entries(colors.dark)) {
  //   css += `--${toKebabCase(key)}:${value};`
  // }

  // css += '}'
  // css += '}'

  return css
}
