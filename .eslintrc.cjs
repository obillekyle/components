/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    'plugin:unicorn/recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'vue/valid-v-model-argument': 'off',
    'unicorn/prevent-abbreviations': 'off'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
