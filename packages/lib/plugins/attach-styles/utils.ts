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

export function getHelperFileContent(css: string, prefix: string) {
  return `
    export default function injectCSS(css, hash) {
      if (typeof window !== 'undefined') {
        const style = 
          document.querySelector('style#${prefix}-' + hash) 
          ?? document.createElement('style');
        
        style.id = '${prefix}-' + hash;
        style.textContent = css;
        document.head.contains(style) || document.head.appendChild(style);
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
