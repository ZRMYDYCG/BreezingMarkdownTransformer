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
    html.value = res.html
    title.value = res.title
  } catch {
    // 处理错误
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
    <div class="title-view">
      <a href="https://www.helloworld.net" target="_blank">
        <img width="100" src="/favicon.svg">
      </a>
      <div>
        <h1 class="h1">html 转 md</h1>
        <h3 class="h3">支持 csdn、掘金、简书、segmentfault、cnblogs、oschina、微信文章</h3>
      </div>
      <a href="https://github.com/helloworld-Co/html2md" target="_blank">
        <img width="40" src="/favicon.svg">
      </a>
    </div>

    <div class="url-box">
      <el-input
          @keyup.enter.native="transformUrl"
          @focus="getInputFocus($event)"
          v-model="url"
          size="small"
          placeholder="请输入文章地址" />
      <div>&nbsp;</div>
      <el-button
          @click="transformUrl"
          :loading="isLoading"
          size="small"
          type="primary"
      >👉一键转换</el-button>
    </div>
    <br/>
    <el-input
        @focus="getInputFocus($event)"
        v-model="title"
        size="small"
        placeholder="标题（自动读取）" />
    <br/>

    <div class="input-box">
      <v-md-editor
          v-model="md"
          height="500px"
          @save="toDownload"
      />
    </div>
  </client-only>
</template>


