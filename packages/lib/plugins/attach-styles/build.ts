import { transform } from 'esbuild'
import { gzipSync } from 'node:zlib'
import { rollup } from 'rollup'

type Size = {
  size: number
  gzip: number
}

export async function getSizeTotal(entryPoint: string): Promise<Size> {
  try {
    const build = await rollup({
      logLevel: 'silent',
      input: entryPoint,
      external: ['vue', '@iconify/vue']
    })

    const { output } = await build.generate({
      format: 'es'
    })

    const { code } = await transform(output[0].code, {
      minify: true
    })

    const totalSize = code.length
    const totalGzipSize = gzipSync(code).buffer.byteLength

    return {
      size: totalSize,
      gzip: totalGzipSize
    }
  } catch (error) {
    console.error('Error during build:', error)
    throw error
  }
}
