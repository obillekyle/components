import { Plugin, ResolvedConfig, normalizePath } from 'vite'
import path from 'node:path'
import crypto from 'node:crypto'
import fs from 'node:fs'
import { transform } from 'lightningcss'

let packSize = 0
let fileSize = 0
const css: Record<string, string> = {}
function generateHash(str: string) {
  return crypto.createHash('md5').update(str).digest('hex').slice(0, 8)
}

const script = `
export default function injectCSS(css, hash) {
  const style = 
    document.querySelector('style#' + hash) 
    ?? document.createElement('style');
  
  style.id = hash;
  style.textContent = css;
  document.head.contains(style) || document.head.appendChild(style);
}
`

async function deleteCSSFiles(dir: string) {
  try {
    const files = await fs.promises.readdir(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stats = await fs.promises.stat(filePath)
      if (stats.isDirectory()) {
        await deleteCSSFiles(filePath)
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

function attachStyles(): Plugin {
  let config: ResolvedConfig
  const name: string = 'attach-styles'

  function transformCSS(code: string, key: string) {
    return transform({
      code: new Uint8Array(Buffer.from(code)),
      minify: config.build.cssMinify === 'lightningcss',
      filename: key
    }).code.toString()
  }

  return {
    name,
    apply: 'build',
    configResolved: (_config) => {
      config = _config
    },
    transform(code, id) {
      const isCSS = (path: string) =>
        /\.(scss|sass|css|styl|stylus|less)$/.test(path)

      if (!isCSS(id)) return
      const relative: string = path.relative(path.resolve(__dirname, 'src'), id)
      const entry = relative.split('?')[0]
      const key = entry.endsWith('.vue')
        ? normalizePath(entry).replace(/\\/g, '/')
        : 'index'

      const cssString = transformCSS(code, key)
      css[key] = css[key] ? `${css[key]}\n${cssString}` : cssString
    },
    renderChunk(code, { name }) {
      const cssObj = css[name]

      if (cssObj) {
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
    },

    async writeBundle() {
      await fs.promises.writeFile(
        path.resolve(__dirname, config.build.outDir, 'attach-styles.js'),
        script
      )

      console.log(``)
      console.log(`\x1b[36m[vite:${name}]\x1b[32m Created attach-styles.js`)
      console.log(`\x1b[36m[vite:${name}]\x1b[32m Injecting CSS...\n`)

      Object.keys(css).forEach((key) => {
        delete css[key]
      })

      const outDir = config.build.outDir
      const start = Date.now()
      await deleteCSSFiles(outDir)
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

export default attachStyles
