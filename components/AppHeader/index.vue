<script setup lang="ts">
import { Help } from "@element-plus/icons-vue"

</script>

<template>
  <div class="app-header flex justify-between items-center px-2 py-4 bg-gray-100">
    <div class="flex items-center gap-2">
      <ElImage style="width: 40px; height: 30px;" src="/favicon.svg" alt="logo" />
      <ElText class="ml-2 text-2xl font-bold">Breezing Markdown Transformer</ElText>
    </div>
    <div class="flex items-center gap-2">
      <el-tooltip content="进入后台管理" placement="bottom">
        <el-icon  class="cursor-pointer">
          <Help />
        </el-icon>
      </el-tooltip>
      <ColorMode />
      <el-dropdown placement="bottom">
        <div class="w-6 h-6 bg-gray-300 rounded-full cursor-pointer"></div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>登录</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped></style>