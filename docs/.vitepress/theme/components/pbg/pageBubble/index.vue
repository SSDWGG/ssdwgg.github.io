<script setup lang="ts">
import { delayTimer } from '@v-c/utils'
import pageBubble from './page-bubble'
import { ref, onMounted, onBeforeUnmount,unref } from 'vue'

const bubbleCanvas = ref<HTMLCanvasElement>()

onMounted( async() => {
  await delayTimer(300)
    pageBubble.init(unref(bubbleCanvas)!)
})


onBeforeUnmount(() => {
  pageBubble.removeListeners()
})
</script>

<template>
  <!-- 底部泡泡 -->
   <div h-screen w-screen absolute>
      <canvas ref="bubbleCanvas" />
    </div>
</template>

