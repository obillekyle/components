import { transform } from 'esbuild'
import crypto from 'node:crypto'
import path from 'node:path'
import { normalizePath, type ResolvedConfig } from 'vite'

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

export function getHelperFileContent(prefix: string, map: string) {
  return `
    const CSS_DECLARATIONS = /(?<={)([^}]+)(?=})/g

    class Decompressor {
      constructor(map) {
        this.map = new Map(Object.entries(JSON.parse(map)))
      }
      decompress(css) {
        return css.replaceAll(CSS_DECLARATIONS, (_, declarations) => {
          return declarations
            .split(';')
            .filter(Boolean)
            .map((property) => {
              property = property.trim()
              const [key, value] = property.split(':')
              return (this.map.get(key) ?? key) + ':' + value
            }).join(';')
        })
      }
    }

    const decompressor = new Decompressor(${map});

    export default function injectCSS(css, hash) {
      if (typeof window !== 'undefined') {
        const style = 
          document.querySelector('style#${prefix}-' + hash) 
          ?? document.createElement('style');
        
        style.id = '${prefix}-' + hash;
        style.textContent = decompressor.decompress(css);

        const head = document.head;
        const styleTags = head.querySelectorAll('style[id^=${prefix}-]');

        if (styleTags.length > 0) {
          const lastStyleTag = styleTags[styleTags.length - 1];
          lastStyleTag.after(style);
        } else {
          head.prepend(style);
        }
      }
    }
  `
}

export function normalize(string_: string) {
  return normalizePath(string_).replaceAll('\\', '/')
}

export function relativeFromSrc(name: string) {
  return normalize(
    path.relative(
      path.resolve(process.cwd(), 'src', path.dirname(name)),
      path.resolve(process.cwd(), 'src')
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
        // eslint-disable-next-line unicorn/prefer-regexp-test
        path.match(alias.find)
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

  for (const m of match) {
    if (m[1].includes('?')) continue
    imports.push(m[1])
  }

  const sourceRoot = path.resolve(process.cwd(), 'src')

  return imports.map((m) => {
    const imported = m.startsWith('.')
      ? path.resolve(path.join(sourceRoot, path.dirname(origin)), m)
      : resolveAlias(m, config)

    return normalize(path.relative(sourceRoot, imported))
  })
}
