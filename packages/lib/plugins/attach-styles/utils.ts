import { transform } from 'esbuild'
import crypto from 'node:crypto'
import path from 'node:path'
import { normalizePath, type ResolvedConfig } from 'vite'

export const CURRENT_SRC = path.resolve(process.cwd(), 'src')

export async function formatCss(
  css: string,
  minify: boolean | string = true
) {
  const minified = await transform(css, {
    minify: !!minify && minify !== 'terser',
    minifyWhitespace: true,
    loader: 'css'
  })

  return minified.code.trim()
}

export function hash(string_: string) {
  return crypto.createHash('md5').update(string_).digest('hex').slice(0, 8)
}

export function isCSS(string_: string) {
  return /\.(scss|sass|css|styl|stylus|less)$/.test(string_)
}

export function getHelperFileContent(prefix: string, global: string) {
  return `
    let lastStyleTag = null

    export default function injectCSS(css, hash) {
      if (typeof window !== 'undefined') {
        const style = 
          document.querySelector('style#${prefix}-' + hash) 
          ?? document.createElement('style');
        
        style.id = '${prefix}-' + hash;
        style.textContent = css;

        const head = document.head;

        if (lastStyleTag) {
          lastStyleTag.after(style);
          return;
        }

        const styleTags = head.querySelectorAll('style[id^=${prefix}-]');

        if (styleTags.length > 0) {
          lastStyleTag = styleTags[styleTags.length - 1];
          lastStyleTag.after(style);
        } else {
          head.prepend(style);
        }
      }
    }

    injectCSS(${JSON.stringify(global)}, 'global');
  `
}

export const toKB = (b: number) => (b / 1024).toFixed(2)

export function normalize(string_: string) {
  return normalizePath(string_).replaceAll('\\', '/')
}

export function relativeFromSrc(name: string) {
  return normalize(
    path.relative(
      path.resolve(CURRENT_SRC, path.dirname(name)),
      CURRENT_SRC
    )
  )
}

export function resolveAlias(path: string, config: ResolvedConfig) {
  if (!config.resolve?.alias) return path
  const aliases = config.resolve.alias

  if (Array.isArray(aliases)) {
    for (const alias of aliases) {
      if (
        (typeof alias.find === 'string' && path.startsWith(alias.find)) ||
        (alias.find instanceof RegExp && alias.find.test(path))
      ) {
        return path.replace(alias.find, alias.replacement)
      }
    }
  }
  return path
}

export function getImportedStyles(
  code: string,
  origin: string,
  config: ResolvedConfig
): string[] {
  const re =
    /import\s+["']([^"']*(?<!\.module)\.(css|scss|sass|less|styl|stylus))["']/g

  const imports: string[] = []
  const match = code.matchAll(re)

  for (const [, imported] of match) {
    if (imported.includes('?')) continue
    imports.push(imported)
  }

  return imports.map((m) => {
    const imported = m.startsWith('.')
      ? path.resolve(path.join(CURRENT_SRC, path.dirname(origin)), m)
      : resolveAlias(m, config)

    return normalize(path.relative(CURRENT_SRC, imported))
  })
}

export const padLength = (...strings: string[]) => {
  return Math.max(...strings.map((string) => string.length))
}
