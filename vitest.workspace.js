import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/lib/vitest.config.ts',
  './packages/docs/vite.config.ts'
])
