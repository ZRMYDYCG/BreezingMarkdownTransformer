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
  <div class=".main">
    <FullLoading v-if="isFullLoading" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: brightness(0.8);
}
</style>