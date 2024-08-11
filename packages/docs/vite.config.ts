import mdx from '@mdx-js/rollup'
import { fileURLToPath, URL } from 'node:url'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { remarkAlert } from 'remark-github-blockquote-alert'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      enforce: 'pre',
      ...mdx({
        jsxImportSource: 'vue',
        providerImportSource: '@mdx-js/vue',
        remarkPlugins: [remarkGfm, remarkAlert],
        rehypePlugins: [rehypeSlug]
      })
    }
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'docs.js',
        chunkFileNames: 'docs-[name]-[hash].js',
        assetFileNames: 'docs-[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 6280,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
      '#': fileURLToPath(new URL('pages', import.meta.url))
    }
  }
})
