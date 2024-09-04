import { onMounted, onUnmounted, ref } from 'vue'

export function usePreferredTheme() {
  const theme = ref('light')

  let mediaQuery: MediaQueryList

  function updateTheme(this: MediaQueryList) {
    theme.value = this.matches ? 'dark' : 'light'
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    updateTheme.call(mediaQuery)
    mediaQuery.addEventListener('change', updateTheme)
  })

  onUnmounted(() => mediaQuery.removeEventListener('change', updateTheme))

  return theme
}
