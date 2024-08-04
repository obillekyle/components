import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import VueDevTools from 'vite-plugin-vue-devtools'
import { attachStyles, resolver } from './plugins'

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
      exclude: ['src/**/__tests__/*', 'src/main.ts', 'plugins/**/*']
    }),
    vue(),
    VueDevTools(),
    attachStyles({
      transform: resolver()
    })
  ],
  build: {
    minify: false,
    copyPublicDir: false,
    cssCodeSplit: true,
    lib: {
      formats: ['es'],
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      fileName: '[name]'
    },
    rollupOptions: {
      treeshake: false,
      preserveEntrySignatures: 'strict',
      external: [
        'vue',
        'color2k',
        '@iconify/vue',
        'bezier-easing',
        'deepmerge'
      ],
      output: {
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
