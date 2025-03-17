// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@element-plus/nuxt'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode'
  },
  css: ['~/assets/css/main.css'],
  vite: {
      plugins: [
          tailwindcss(),
      ],
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false }
})
