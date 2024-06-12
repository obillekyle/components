import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import dts from 'vite-plugin-dts'
import path from 'node:path'
import { version } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: 'tsconfig.app.json'
    }),
    vue(),
    vueJsx(),
    VueDevTools()
  ],
  build: {
    cssMinify: 'lightningcss',
    cssCodeSplit: true,
    copyPublicDir: false,

    lib: {
      formats: ['es'],
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (_format, entryName) =>
        entryName.startsWith('src/')
          ? `${entryName.slice(4)}.js`
          : `deps/${entryName}.js`
    },
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      external: ['vue', 'color', '@iconify/vue', 'deepmerge'],
      output: {
        exports: 'named',
        preserveModules: true,
        inlineDynamicImports: false,
        globals: {
          vue: 'Vue',
          color: 'Color',
          deepmerge: 'Deepmerge',
          '@iconify/vue': 'Iconify'
        },

        assetFileNames: ({ name }) =>
          name?.startsWith('src/')
            ? `${name.slice(4)}.[ext]`
            : `assets/[name].[ext]`
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
