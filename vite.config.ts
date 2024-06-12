import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'
import path from 'node:path'
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      outDir: 'dist',
      entryRoot: 'src',
      insertTypesEntry: true,
      pathsToAliases: false,
      tsconfigPath: 'tsconfig.app.json',
      strictOutput: true
    }),
    vue(),
    VueDevTools()
  ],
  build: {
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    copyPublicDir: false,

    lib: {
      formats: ['es'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: '[name]'
    },
    rollupOptions: {
      external: ['vue', 'color', '@iconify/vue', 'deepmerge'],
      output: {
        preserveModules: true,
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        globals: {
          vue: 'Vue',
          color: 'Color',
          deepmerge: 'Deepmerge',
          '@iconify/vue': 'Iconify'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    __MDC_VER__: JSON.stringify(version)
  }
})
