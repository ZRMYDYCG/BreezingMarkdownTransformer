// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@element-plus/nuxt', '@nuxt/image', 'nuxt-icons', '@nuxtjs/robots'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title:'HTMLToMD',
      meta: [
        { name: 'keywords', content: '爬虫' },
        { name: 'description', content: '爬取网页并转换为Markdown格式' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: 'favicon.svg' }],
    },
  },
  nitro: {
    compressPublicAssets: true,
    publicAssets: [
      {
        dir: 'public'
      }
    ]
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    }
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
