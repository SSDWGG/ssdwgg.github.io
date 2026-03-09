<template>
  <canvas :id="canvasId" ></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// 生成有效的CSS选择器ID
function uuid() {
  return 'canvas_' + Math.random().toString(36).substr(2, 9);
}

const props = withDefaults(defineProps<{
    svgaUrl: string,
}>(), {
  svgaUrl: '',
})

const canvasId = uuid();

onMounted(async() => {
  // 1. 确保只在客户端运行
  if (typeof window === 'undefined') return;

  // 2. 动态导入库 (Dynamic Import)
  // 这样 Vite 在 SSR 构建时不会打包这段逻辑，或者不会立即执行
  const SVGA = await import('svgaplayerweb'); 
  // 创建 Player 和 Parser 实例
  var player = new SVGA.Player(`#${canvasId}`);
  var parser = new SVGA.Parser();
  // 加载动画文件并播放
  parser.load(props.svgaUrl, function (videoItem) {
    player.setVideoItem(videoItem);
    player.startAnimation();
  });
})

</script>
