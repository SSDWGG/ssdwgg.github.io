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
  <canvas ref="bubbleCanvas" id="bubbleCanvas" style="height: 100vh; width: 100vw;position: fixed;top: 0;left: 0;" />
</template>

