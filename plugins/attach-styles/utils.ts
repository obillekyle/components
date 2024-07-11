import crypto from 'node:crypto'
import { transform } from 'esbuild'
import { type ResolvedConfig, normalizePath } from 'vite'
import path from 'node:path'

export async function formatCss(
  css: string,
  minify: boolean | string = true
) {
  return (
    await transform(css, {
      minify: !!minify && minify !== 'terser',
      minifyWhitespace: true,

      loader: 'css'
    })
  ).code.trim()
}

export function hash(str: string) {
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 8)
}

export function isCSS(str: string) {
  return /\.(scss|sass|css|styl|stylus|less)$/.test(str)
}

export function getHelperFileContent(css: string, prefix: string) {
  return `
    function injectCSS(css, hash) {
      const style = 
        document.querySelector('style#${prefix}-' + hash) 
        ?? document.createElement('style');
      
      style.id = '${prefix}-' + hash;
      style.textContent = css;
      document.head.contains(style) || document.head.appendChild(style);
    }

    export default injectCSS;
  `
}

export function normalize(str: string) {
  return normalizePath(str).replace(/\\/g, '/')
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

  if (aliases instanceof Array) {
    for (const alias of aliases) {
      if (
        (typeof alias.find === 'string' && path.startsWith(alias.find)) ||
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
    /import\s+['"]([^'"]*(?<!\.module)\.(css|scss|sass|less|styl|stylus))['"]/g

  const imports: string[] = []
  const match = code.matchAll(re)

  for (const m of match) {
    if (m[1].includes('?')) continue
    imports.push(m[1])
  }

  const srcRoot = path.resolve(process.cwd(), 'src')

  return imports.map((m) => {
    const imported = m.startsWith('.')
      ? path.resolve(path.join(srcRoot, path.dirname(origin)), m)
      : resolveAlias(m, config)

    return normalize(path.relative(srcRoot, imported))
  })
}
