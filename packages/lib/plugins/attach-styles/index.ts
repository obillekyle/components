import { type Plugin, type ResolvedConfig } from 'vite'

import { transform } from 'esbuild'
import { gzipSync } from 'node:zlib'
import {
  formatCss,
  getHelperFileContent,
  getImportedStyles,
  hash,
  isCSS,
  normalize,
  padLength,
  relativeFromSrc,
  toKB
} from './utils'

import fs from 'node:fs'
import path from 'node:path'
import Logger from '../logger'
import { getSizeTotal } from './build'
import { Compressor } from './compress'

let packSize = 0,
  saveSize = 0,
  contents = '',
  logger = new Logger('attach-styles')

const css: Record<string, string> = {}
const importedMap: Record<string, string[]> = {}

async function deleteCSSFiles(
  dir: string,
  out: string,
  ignore: string[] = []
) {
  try {
    const files = await fs.promises.readdir(dir)
    for (const file of files) {
      if (
        ignore.includes(
          path.relative(
            path.resolve(process.cwd(), out),
            path.join(dir, file)
          )
        )
      )
        continue
      const filePath = path.join(dir, file)
      const stats = await fs.promises.stat(filePath)
      if (stats.isDirectory()) {
        await deleteCSSFiles(filePath, out, ignore)
      } else if (file.endsWith('.css')) {
        saveSize += stats.size
        await fs.promises.unlink(filePath)
      } else {
        packSize += stats.size
        if (file.endsWith('.js')) {
          const content = await fs.promises.readFile(filePath, 'utf8')
          const newContent = content.replaceAll(
            /\/\* empty css\s*\*\/\n/gm,
            ''
          )
          await fs.promises.writeFile(filePath, newContent)
          contents += newContent
          saveSize += content.length - newContent.length
        }
      }
    }
  } catch (error) {
    logger.error(`Failed to delete CSS file: ${dir} ${error}`)
  }
}

type ASOptions = {
  prefix?: string
  cleanIgnore?: string[]
  cleanCSS?: boolean
  transform?: (code: string, id: string) => string
}

export function attachStyles({
  prefix = 'css',
  cleanIgnore = [],
  cleanCSS = true,
  transform: t = (s) => s
}: ASOptions = {}): Plugin {
  let config: ResolvedConfig
  const name: string = 'attach-styles'
  const compressor = new Compressor()

  return {
    name,
    apply: 'build',
    configResolved(_config) {
      config = _config
      logger = new Logger(name)
    },

    async transform(code, id) {
      const relative = path.relative(path.resolve(process.cwd(), 'src'), id)
      const entry = normalize(relative.split('?')[0])

      if (isCSS(id)) {
        if (isCSS(entry)) {
          const cssString = compressor.compress(await formatCss(code))
          css[entry] = (css[entry] || '') + cssString
          return
        }

        if (entry.endsWith('.vue')) {
          const cssString = compressor.compress(await formatCss(code))
          const indexMap = importedMap[entry]
          css[entry] = (css[entry] || '') + cssString

          if (!indexMap) importedMap[entry] = [entry]
          else if (!indexMap.includes(entry)) indexMap.push(entry)

          return
        }
      }

      const styleImports = getImportedStyles(code, entry, config)

      for (const styleImport of styleImports) {
        const file = path.parse(entry)
        const id =
          file.ext === '.vue'
            ? entry
            : normalize(path.join(file.dir, file.name))

        const map = importedMap[id]

        if (map) map.push(styleImport)
        else importedMap[id] = [styleImport]
      }
    },
    async renderChunk(code, { name, fileName }) {
      let added = false
      const imports = importedMap[name]

      if (imports?.length) {
        for (const imported of imports) {
          if (imported.endsWith('.vue')) {
            const cssString = t(css[imported], imported)

            if (cssString) {
              if (!added) {
                const root = relativeFromSrc(name)
                code = `import $i from '${root}/attach-styles.js';\n` + code
                added = true
              }
              code += `\n$i(${JSON.stringify(cssString)}, '${hash(imported)}');`
            }
            continue
          }

          const file = path.parse(imported)
          let relative = normalize(
            path.relative(path.dirname(fileName), path.dirname(imported))
          )
          relative = relative.startsWith('.') ? relative : `./${relative}`
          code = `import '${relative}/${file.name}.css.js';\n${code}`
        }

        return code
      }

      if (isCSS(name)) {
        const cssString = t(css[name], name)
        const root = relativeFromSrc(name)
        const newFile = `
          import i from '${root}/attach-styles.js';
          i(${JSON.stringify(cssString)},'${hash(name)}');
        `

        const file = path.parse(name)
        const minified = await transform(newFile, { loader: 'js' })
        const parentDir = path.join(
          process.cwd(),
          config.build.outDir,
          file.dir
        )

        await fs.promises.mkdir(parentDir, { recursive: true })
        await fs.promises.writeFile(
          path.join(parentDir, file.name + '.css.js'),
          minified.code
        )
      }
    },

    async writeBundle() {
      const script = getHelperFileContent(prefix, compressor.getMap())
      const parentDir = path.join(process.cwd(), config.build.outDir)
      const minified = await transform(script, { loader: 'js' })

      await fs.promises.writeFile(
        path.join(parentDir, 'attach-styles.js'),
        minified.code
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

        logger.log(`Clean CSS files...`)
        logger.log(`Cleaned CSS files in ${elapsed}ms.\n`)
      }

      logger.log(`Calculating size...`)

      const prod = await getSizeTotal('dist/index.js')
      const saved = toKB(saveSize)
      const packed = toKB(packSize)
      const module = toKB(contents.length)
      const modGzip = toKB(gzipSync(contents).length)
      const minSize = toKB(prod.size)
      const minGzip = toKB(prod.gzip)

      const packPad = padLength(packed, module, minSize)
      const sizePad = padLength(saved, modGzip, minGzip)

      cleanCSS &&
        logger.log(
          `$cyan;Unpacked: $gray;$B;${packed.padStart(packPad, ' ')} kB`,
          `$R;$gray;│ save: ${saved.padStart(sizePad, ' ')} kB$R;`
        )

      logger.log(
        `$cyan;Packaged: $gray;$B;${module.padStart(packPad, ' ')} kB`,
        `$R;$gray;│ gzip: ${modGzip.padStart(sizePad, ' ')} kB$R;`
      )

      logger.log(
        `$cyan;Minified: $gray;$B;${minSize.padStart(packPad, ' ')} kB`,
        `$R;$gray;│ gzip: ${minGzip.padStart(sizePad, ' ')} kB$R;\n`
      )
    }
  }
}

export default attachStyles
