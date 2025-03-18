<script setup lang="ts">
import { ref } from 'vue'
import { Help, User, Lock } from "@element-plus/icons-vue"

const showLoginDialog = ref(false)
const form = ref({
  username: '',
  password: ''
})
const handleLoginClick = () => {
  showLoginDialog.value = true
}

const handleCloseDialog = () => {
  showLoginDialog.value = false
}
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
        <div class="w-5 h-5 bg-green-300 rounded-full cursor-pointer"></div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleLoginClick">登录</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog
        v-model="showLoginDialog"
        title="用户登录"
        width="30%"
        :close-on-click-modal="true"
        @closed="handleCloseDialog"
        align-center
    >
      <el-form :model="form" label-width="80px" class="px-4">
        <el-form-item label="用户名" class="mb-4">
          <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
          />
        </el-form-item>

        <el-form-item label="密码" class="mb-6">
          <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
          />
        </el-form-item>

        <div class="flex justify-center">
          <div class="w-24 bg-blue-600 text-white text-center rounded-md py-2 px-4 cursor-pointer">登录</div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped></style>