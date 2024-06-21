import { Plugin, ResolvedConfig, normalizePath } from 'vite'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { transform as transformJS } from 'esbuild'

let packSize = 0
let fileSize = 0
const css: Record<string, string> = {}
function generateHash(str: string) {
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 8)
}

function attachCSSFile(additionalCSS: string, prefix: string) {
  return `
function injectCSS(css, hash) {
  const style = 
    document.querySelector('style#${prefix}-' + hash) 
    ?? document.createElement('style');
  
  style.id = '${prefix}-' + hash;
  style.textContent = css;
  document.head.contains(style) || document.head.appendChild(style);
}

const helper = function() {
  injectCSS(${JSON.stringify(additionalCSS)}, 'global');
  return injectCSS;
}

export default helper();
`
}

async function deleteCSSFiles(dir: string, out: string, ignore: string[] = []) {
  try {
    const files = await fs.promises.readdir(dir)
    for (const file of files) {
      if (
        ignore.includes(
          path.relative(path.resolve(__dirname, out), path.join(dir, file))
        )
      )
        continue
      const filePath = path.join(dir, file)
      const stats = await fs.promises.stat(filePath)
      if (stats.isDirectory()) {
        await deleteCSSFiles(filePath, out, ignore)
      } else if (file.endsWith('.css')) {
        fileSize += stats.size
        await fs.promises.unlink(filePath)
      } else {
        packSize += stats.size
      }
    }
  } catch (err) {
    console.error(`Failed to delete CSS file: ${dir}`, err)
  }
}

type ASOptions = {
  prefix?: string
  cleanIgnore?: string[]
  cleanCSS?: boolean
}

function attachStyles({
  prefix = 'css',
  cleanIgnore = [],
  cleanCSS = true
}: ASOptions = {}): Plugin {
  let config: ResolvedConfig
  const name: string = 'attach-styles'

  async function transformCSS(code: string) {
    return (
      await transformJS(code, {
        minify: config.build.minify && config.build.minify !== 'terser',
        minifyWhitespace: true,
        loader: 'css'
      })
    ).code
  }

  return {
    name,
    apply: 'build',
    configResolved: (_config) => {
      config = _config
    },
    async transform(code, id) {
      const isCSS = (p: string) => /\.(scss|sass|css|styl|stylus|less)$/.test(p)

      if (!isCSS(id)) return
      const relative: string = path.relative(path.resolve(__dirname, 'src'), id)
      const entry = relative.split('?')[0]
      const key = entry.endsWith('.vue')
        ? normalizePath(entry).replace(/\\/g, '/') + '.js'
        : 'globalCss'

      const cssString = await transformCSS(code)
      css[key] = css[key] ? `${css[key]}\n${cssString}` : cssString
    },
    renderChunk(code, { fileName }) {
      const cssObj = css[fileName]

      if (cssObj) {
        delete css[fileName]
        const root = normalizePath(
          path.relative(
            path.resolve(__dirname, 'src', path.dirname(name)),
            path.resolve(__dirname, 'src')
          )
        )
        return {
          code: `
            import injectCSS from '${root}/attach-styles.js'
            injectCSS(${JSON.stringify(cssObj)}, ${JSON.stringify(generateHash(name))});
            ${code}
          `,
          map: { mappings: '' }
        }
      }

      if (name === 'index') {
        return {
          code: `
            import './attach-styles.js'
            ${code}
          `,
          map: { mappings: '' }
        }
      }
    },

    async writeBundle() {
      const unattachedCSS = await transformCSS(Object.values(css).join('\n'))
      const script = attachCSSFile(unattachedCSS || '', prefix)

      await fs.promises.writeFile(
        path.resolve(__dirname, config.build.outDir, 'attach-styles.js'),
        (await transformJS(script, { loader: 'js' })).code
      )

      console.log(``)
      console.log(`\x1b[36m[vite:${name}]\x1b[32m Created attach-styles.js`)
      console.log(`\x1b[36m[vite:${name}]\x1b[32m Injecting CSS...\n`)

      Object.keys(css).forEach((key) => {
        delete css[key]
      })

      if (cleanCSS) {
        const outDir = config.build.outDir
        const start = Date.now()
        await deleteCSSFiles(outDir, outDir, cleanIgnore)
        const end = Date.now()
        const elapsed = end - start
        const size = (fileSize / 1024).toFixed(2)
        const pack = (packSize / 1024).toFixed(2)

        console.log(`\x1b[36m[vite:${name}]\x1b[32m Clean CSS files...`)
        console.log(
          `\x1b[36m[vite:${name}]`,
          `\x1b[32mCleaned CSS files in ${elapsed}ms.`
        )
        console.log(
          `\x1b[36m[vite:${name}]`,
          `\x1b[32mPack: \x1b[90m\x1b[1m${pack} kB\x1b[0m\x1b[90m │`,
          `\x1b[32mSaved: \x1b[90m\x1b[1m${size} kB\x1b[0m\n`
        )
      }
    }
  }
}

export default attachStyles
