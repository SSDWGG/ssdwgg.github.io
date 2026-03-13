<script setup lang="ts">
import { onMounted, ref } from 'vue'

const iframeRef = ref<HTMLIFrameElement | null>(null)

// 默认标签列表
const defaultLabels = ['aaa', 'Merry Christmas']

// 需要传递给iframe的标签数据
const labels = ref<string[]>(defaultLabels)

// 构建带参数的iframe源
const iframeSrc = ref<string>('')

const updateLabels = (newLabels: string[]) => {
  labels.value = newLabels
  iframeSrc.value = `/outHtml/Christmas-draw.html?labels=${encodeURIComponent(JSON.stringify(newLabels))}`
}

onMounted(() => {
  updateLabels(['Happy', 'every', 'day'])
  // 监听来自iframe的消息（如果需要双向通信）
  window.addEventListener('message', (event) => {
    if (event.data.type === 'getLabelsRequest') {
      // 响应iframe的请求，发送标签数据
      if (iframeRef.value && iframeRef.value.contentWindow) {
        iframeRef.value.contentWindow.postMessage({
          type: 'setLabels',
          labels: labels.value,
        }, '*')
      }
    }
  })
})


</script>

<template>
  <div class="w-full h-full">
    <iframe
      ref="iframeRef"
      :src="iframeSrc"
      title="Christmas Draw"
      style="width:100%; height: 100vh;border: none;" 

    />
  </div>
</template>
