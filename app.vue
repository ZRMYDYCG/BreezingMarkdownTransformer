<script setup lang="ts">
const nuxtApp = useNuxtApp()

// 是否首次加载
const isFullLoading = ref(true)

nuxtApp.hook('page:start', () => {
  isFullLoading.value = true
})

nuxtApp.hook('page:finish', () => {
  isFullLoading.value = false
})
</script>

<template>
  <div>
    <FullLoading v-if="isFullLoading" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>