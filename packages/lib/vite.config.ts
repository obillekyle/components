import { defineConfig } from 'vite'
import { attachStyles, resolver } from './plugins'

import vue from '@vitejs/plugin-vue'
import glob from 'fast-glob'
import path from 'node:path'
import circleDependency from 'vite-plugin-circular-dependency'
import dts from 'vite-plugin-dts'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      entryRoot: 'src',
      insertTypesEntry: true,
      pathsToAliases: false,
      tsconfigPath: 'tsconfig.app.json',
      strictOutput: true,
      exclude: ['src/**/*.test.ts', 'src/main.ts', 'plugins/**/*']
    }),
    vue(),
    VueDevTools(),
    circleDependency(),
    attachStyles({ transform: resolver() })
  ],
  server: {
    strictPort: true,
    host: true,
    port: 6270
  },
  build: {
    minify: false,
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      formats: ['es'],
      fileName: '[name]',
      entry: path.resolve(import.meta.dirname, 'src/index.ts')
    },
    rollupOptions: {
      input: glob
        .sync('src/**/index.ts')
        .map((file) => path.resolve(import.meta.dirname, file)),
      external: [
        'vue',
        'color2k',
        '@iconify/vue',
        'bezier-easing',
        'deepmerge'
      ],
      output: {
        esModule: true,
        preserveModules: true,
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        globals: {
          vue: 'Vue',
          color2k: 'color2k',
          deepmerge: 'deepmerge',
          '@iconify/vue': 'Iconify',
          'bezier-easing': 'bezierEasing'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src')
    }
  }
})
