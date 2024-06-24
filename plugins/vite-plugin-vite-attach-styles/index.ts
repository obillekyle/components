import path from 'node:path'
import fs from 'node:fs'
import { gzipSync } from 'node:zlib'
import { transform } from 'esbuild'
import { Plugin, ResolvedConfig } from 'vite'
import {
  formatCss,
  getHelperFileContent,
  getImportedStyles,
  hash,
  isCSS,
  normalize,
  relativeFromSrc
} from './utils'
import Logger from './logger'

let packSize = 0
let fileSize = 0
let moduleSize = 0
let modSizeGzip = 0
let logger = new Logger('attach-styles')
const css: Record<string, string> = {}
const importedMap: Record<string, string[]> = {}

async function deleteCSSFiles(dir: string, out: string, ignore: string[] = []) {
  try {
    const files = await fs.promises.readdir(dir)
    for (const file of files) {
      if (
        ignore.includes(
          path.relative(path.resolve(process.cwd(), out), path.join(dir, file))
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
        if (file.endsWith('.js')) {
          const content = await fs.promises.readFile(filePath, 'utf-8')
          modSizeGzip += await gzipSync(content).length
          moduleSize += stats.size
        }
      }
    }
  } catch (err) {
    logger.error(`Failed to delete CSS file: ${dir} ${err}`)
  }
}

type ASOptions = {
  prefix?: string
  cleanIgnore?: string[]
  cleanCSS?: boolean
}

export function attachStyles({
  prefix = 'css',
  cleanIgnore = [],
  cleanCSS = true
}: ASOptions = {}): Plugin {
  let config: ResolvedConfig
  const name: string = 'attach-styles'

  return {
    name,
    apply: 'build',
    configResolved: (_config) => {
      config = _config
      logger = new Logger(name)
    },

    async transform(code, id) {
      const relative = path.relative(path.resolve(process.cwd(), 'src'), id)
      const entry = normalize(relative.split('?')[0])

      if (isCSS(id)) {
        if (isCSS(entry)) {
          const cssString = await formatCss(code)
          css[entry] = (css[entry] || '') + cssString
          return
        }

        if (entry.endsWith('.vue')) {
          const cssString = await formatCss(code)
          const iMap = importedMap[entry]
          css[entry] = (css[entry] || '') + cssString

          if (!iMap) importedMap[entry] = [entry]
          else if (!iMap.includes(entry)) iMap.push(entry)

          return
        }
      }

      const styleImports = getImportedStyles(code, entry, config)

      for (const styleImport of styleImports) {
        const file = path.parse(entry)
        const id = normalize(path.join(file.dir, file.name))

        const map = importedMap[id]

        if (map) map.push(styleImport)
        else importedMap[id] = [styleImport]
      }
    },
    async renderChunk(code, { name, fileName }) {
      const imports = importedMap[name]

      if (imports) {
        const root = relativeFromSrc(name)
        code = `import injectCSS from '${root}/attach-styles.js';\n` + code

        for (const imported of imports) {
          if (imported.endsWith('.vue')) {
            const cssStr = css[imported]

            if (cssStr) {
              code += `\ninjectCSS(${JSON.stringify(cssStr)}, '${hash(imported)}');`
            }
            continue
          }

          const file = path.parse(imported)
          const relative = normalize(
            path.relative(path.dirname(fileName), path.dirname(imported))
          )
          code = `import './${relative || '.'}/${file.name}.split.js';\n${code}`
        }

        return { code, map: { mappings: '' } }
      }

      if (isCSS(name)) {
        const cssStr = css[name]
        const root = relativeFromSrc(name)
        const newFile = `
          import i from '${root}/attach-styles.js';
          i(${JSON.stringify(cssStr)},'${hash(name)}');
        `

        const file = path.parse(name)

        await fs.promises.mkdir(
          path.join(process.cwd(), config.build.outDir, file.dir),
          { recursive: true }
        )

        await fs.promises.writeFile(
          path.resolve(
            process.cwd(),
            config.build.outDir,
            path.join(file.dir, file.name + '.split.js')
          ),
          (await transform(newFile, { loader: 'js' })).code
        )
      }
    },

    async writeBundle() {
      const script = getHelperFileContent('', prefix)

      await fs.promises.writeFile(
        path.resolve(process.cwd(), config.build.outDir, 'attach-styles.js'),
        (await transform(script, { loader: 'js' })).code
      )

      console.log(``)
      logger.log(`Created attach-styles.js`)
      logger.log(`Injecting CSS...\n`)

      if (cleanCSS) {
        const outDir = config.build.outDir
        const start = Date.now()
        await deleteCSSFiles(outDir, outDir, cleanIgnore)
        const end = Date.now()
        const elapsed = end - start
        const size = (fileSize / 1024).toFixed(2)
        const pack = (packSize / 1024).toFixed(2)
        const mod = (moduleSize / 1024).toFixed(2)
        const modGzip = (modSizeGzip / 1024).toFixed(2)

        logger.log(`Clean CSS files...`)
        logger.log(`Cleaned CSS files in ${elapsed}ms.`)
        logger.log(
          `$cyan;Files: $gray;$B;${pack} kB $R;$gray;│`,
          `$cyan;Saved: $gray;$B;${size} kB$R;`
        )
        logger.log(
          `$cyan;Module size: $gray;$B;${mod} kB $R;$gray;│ gzip: ${modGzip} kB$R;\n`
        )
      }
    }
  }
}

export default attachStyles
