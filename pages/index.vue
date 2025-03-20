<script setup lang="ts">
import { ref, computed } from 'vue'
import TurndownService from 'turndown'
import { gfm, tables, strikethrough } from 'turndown-plugin-gfm'
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';

VMdEditor.use(githubTheme);

const url = ref('')
const isLoading = ref(false)
const title = ref('')
const html = ref('<pre>Hello world!<br/>换行了</pre>')
const md = computed(() => {
  const turndownService = new TurndownService({ codeBlockStyle: 'fenced' })
  turndownService.use(gfm)
  turndownService.use([tables, strikethrough])
  turndownService.addRule('pre2Code', {
    filter: ['pre'],
    replacement (content) {
      const len = content.length
      const isCode = content[0] === '`' && content[len - 1] === '`'
      const result = isCode ? content.substr(1, len - 2) : content
      return '```\n' + result + '\n```\n'
    }
  })
  return turndownService.turndown(html.value)
})

const getInputFocus = (event: FocusEvent) => {
  const target = event.target as HTMLInputElement
  target.select()
}

const transformUrl = async () => {
  if (!url.value) return
  isLoading.value = true

  try {
    const res = await $fetch<{code: number, title: string, html: string}>('/api/getUrlHtml', {
      params: { url: url.value }
    })
    if(res.code === 0) {
      throw new Error('解析失败')
    }
    html.value = res.html
    title.value = res.title   
  } catch {
    ElMessage.error('解析失败')
  } finally {
    isLoading.value = false
  }
}

const toDownload = async () => {
  const params = {
    md: md.value,
    url: window.location.origin
  }

  try {
    const res = await $fetch<{code: number, path: string}>('/api/getMdFile', {
      method: 'POST',
      body: params
    })
    downLoadFile(res.path)
  } catch {
    // 处理错误
  }
}

const downLoadFile = (url: string) => {
  const a = document.createElement('a')
  a.download = `${Date.now()}.md`
  a.href = url
  a.click()
}
</script>


<template>
  <client-only class="html2md-box">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="title-view mb-12 text-center">
        <div>
          <h1 class="h1 text-4xl font-bold text-gray-900 dark:text-white mb-4">
            HTML 转 MD
          </h1>
          <h3 class="h3 text-lg text-gray-600 dark:text-gray-300">
            支持 CSDN、掘金、简书、SegmentFault、博客园、开源中国、微信文章
          </h3>
        </div>
      </div>

      <!-- URL输入区域优化布局 -->
      <div class="url-box flex flex-col md:flex-row gap-4 mb-8">
        <el-input
            class="flex-1 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @keyup.enter.native="transformUrl"
            v-model="url"
            size="small"
            placeholder="🔗 请输入文章地址"
        />
        <el-button
            class="w-full md:w-auto transition-colors shadow-md"
            @click="transformUrl"
            :loading="isLoading"
            size="small"
            type="primary"
        >
          🚀 一键转换
        </el-button>
      </div>

      <el-input
          class="mb-6 shadow-sm focus:ring-2 focus:ring-blue-500"
          v-model="title"
          size="small"
          placeholder="📝 标题（自动读取）"
      />

      <div class="markdown-box rounded-xl shadow-lg overflow-hidden border dark:border-gray-700">
        <v-md-editor
            v-model="md"
            height="500px"
            class="prose max-w-none"
            @save="toDownload"
        />
      </div>
    </div>
  </client-only>
</template>


