<script setup lang="ts">
import { withBase } from 'vitepress'
import { onMounted, onUnmounted, ref } from 'vue'
import { useSiteLocale } from '../untils/locale'

const iframeRef = ref<HTMLIFrameElement | null>(null)
const { messages } = useSiteLocale()

// 默认标签列表
const defaultLabels = [...messages.value.christmasTree.labels]

// 需要传递给iframe的标签数据
const labels = ref<string[]>(defaultLabels)

// 构建带参数的iframe源
const iframeSrc = ref<string>('')

const updateLabels = (newLabels: string[]) => {
  labels.value = newLabels
  const encodedLabels = encodeURIComponent(JSON.stringify(newLabels))
  iframeSrc.value = `${withBase('/outHtml/Christmas-draw.html')}?labels=${encodedLabels}`
}

const handleMessage = (event: MessageEvent) => {
  if (event.data?.type === 'getLabelsRequest') {
    // 响应iframe的请求，发送标签数据
    if (iframeRef.value && iframeRef.value.contentWindow) {
      iframeRef.value.contentWindow.postMessage({
        type: 'setLabels',
        labels: labels.value,
      }, '*')
    }
  }
}

onMounted(() => {
  updateLabels([...messages.value.christmasTree.labels])
  // 监听来自iframe的消息（如果需要双向通信）
  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="w-full h-full">
    <iframe
      ref="iframeRef"
      :src="iframeSrc"
      :title="messages.christmasTree.title"
      style="width: 100%; height: 100vh; border: none;"

    />
  </div>
</template>
