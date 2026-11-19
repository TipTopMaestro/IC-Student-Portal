import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'icsp_theme'
const DEFAULT_THEME = 'light'
const VALID_THEMES = ['light', 'dark', 'bloom', 'bloom-dark']

/**
 * Theme Store — Manages the active theme and applies it globally.
 * 
 * Sets `data-theme` on <html> and persists to localStorage.
 * CSS custom properties defined in main.css respond to [data-theme] selectors,
 * making all `bg-theme-*`, `text-theme-*`, `border-theme-*` utilities reactive.
 */
export const useThemeStore = defineStore('theme', () => {
  // --- State ---
  const currentTheme = ref(DEFAULT_THEME)

  // --- Getters ---
  const isDark = computed(() => 
    currentTheme.value === 'dark' || currentTheme.value === 'bloom-dark'
  )

  const themeLabel = computed(() => {
    const labels = {
      'light': 'Light',
      'dark': 'Dark',
      'bloom': 'Bloom',
      'bloom-dark': 'Bloom Dark'
    }
    return labels[currentTheme.value] || 'Light'
  })

  // --- Actions ---
  function setTheme(themeId) {
    if (!VALID_THEMES.includes(themeId)) {
      console.warn(`[ThemeStore] Invalid theme "${themeId}". Falling back to "${DEFAULT_THEME}".`)
      themeId = DEFAULT_THEME
    }
    currentTheme.value = themeId
    applyTheme(themeId)
    persistTheme(themeId)
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE_KEY)
    const themeId = VALID_THEMES.includes(stored) ? stored : DEFAULT_THEME
    currentTheme.value = themeId
    applyTheme(themeId)
  }

  // --- Internal ---
  function applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId)
  }

  function persistTheme(themeId) {
    localStorage.setItem(STORAGE_KEY, themeId)
  }

  return {
    currentTheme,
    isDark,
    themeLabel,
    setTheme,
    initTheme
  }
})

/**
 * Bootstrap theme BEFORE Vue mounts to prevent flash of unstyled content (FOUC).
 * Called in main.js before createApp().mount().
 */
export function bootstrapTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  const themeId = VALID_THEMES.includes(stored) ? stored : DEFAULT_THEME
  document.documentElement.setAttribute('data-theme', themeId)
}
