<template>
  <div class="layout-default h-screen w-screen relative">
    <AppHeader ref="headerRef" />
    <div class="layout-main">
      <slot />
    </div>
    <AppFooter ref="footerRef" />
  </div>
</template>

<script setup>

</script>

<style scoped>
.layout-default {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-default .layout-main {
  flex: 1;
  overflow-y: auto;
}
</style>