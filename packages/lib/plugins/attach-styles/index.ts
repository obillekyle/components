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

let packSize = 0,
  saveSize = 0,
  contents = '',
  logger = new Logger('attach-styles')

const css = {
  declarations: new Map<string, string>(),
  imports: new Map<string, Set<string>>()
}

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
  global?: string
  cleanIgnore?: string[]
  cleanCSS?: boolean
  transform?: (code: string, id: string) => string
}

export function attachStyles({
  prefix = 'css',
  cleanIgnore = [],
  cleanCSS = true,
  transform: t = (s) => s,
  global = ''
}: ASOptions = {}): Plugin {
  let config: ResolvedConfig
  const name: string = 'attach-styles'

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
          const cssString = await formatCss(code)
          const oldString = css.declarations.get(entry) || ''

          css.declarations.set(entry, oldString + cssString)
          return
        }

        if (entry.endsWith('.vue')) {
          const cssString = await formatCss(code)
          const oldString = css.declarations.get(entry) || ''
          const importSet = css.imports.get(entry) || new Set()

          importSet.add(entry)

          css.imports.has(entry) || css.imports.set(entry, importSet)
          css.declarations.set(entry, oldString + cssString)

          return
        }
      }

      const styleImports = getImportedStyles(code, entry, config)

      for (const styleImport of styleImports) {
        const { ext, dir, name } = path.parse(entry)
        const id = ext === '.vue' ? entry : normalize(path.join(dir, name))

        const importSet = css.imports.get(id) || new Set()
        css.imports.has(entry) || css.imports.set(entry, importSet)

        importSet.add(styleImport)
      }
    },
    async renderChunk(code, { name, fileName }) {
      const imports = css.imports.get(name) || new Set()

      if (imports.size > 0) {
        let add = ''
        let i = false
        const root = relativeFromSrc(name)

        for (const module of imports) {
          const modulePath = path.parse(module)
          if (modulePath.ext === '.vue') {
            const cssString = t(css.declarations.get(module)!, module)
            add += i ? '' : `import $i from '${root}/attach-styles.js'\n;`
            add += `$i(${JSON.stringify(cssString)}, '${hash(module)}');\n`

            i = true
            continue
          }

          let relative = normalize(
            path.relative(path.dirname(fileName), modulePath.dir)
          )

          relative = relative.startsWith('.') ? relative : `./${relative}`
          add += `import '${relative}/${modulePath.name}.css.js'\n;`
        }

        return add + code
      }

      if (isCSS(name)) {
        const cssString = t(css.declarations.get(name)!, name)
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
      const script = getHelperFileContent(prefix, global)
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
