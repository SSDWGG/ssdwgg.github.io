<script setup lang="ts">
import TextType from './TextType.vue'
import LightPillar from './LightPillar.vue'
import ColorBends from './ColorBends.vue'
import PixelSnow from './PixelSnow.vue'

const emit = defineEmits(['ok'])
const textList = ['岁聿其莫,时维新春', '龙马精神,万象更新']
const handleSentenceComplete = (_sentence: string, index: number) => {
  if (index === textList.length - 1) {
    emit('ok')
  }
}
</script>

<template>
  <div style="width: 100%; height: 100vh; position: relative;">
    <LightPillar
      top-color="#29dbff"
      bottom-color="#9EF19E"
      :intensity="0.5"
      :rotation-speed="0.3"
      :glow-amount="0.005"
      :pillar-width="3.5"
      :pillar-height="0.4"
      :noise-intensity="0.5"
      :pillar-rotation="50"
      :interactive="false"
      mix-blend-mode="normal"
    />
    <ColorBends
      :colors="['red']"
      :rotation="30"
      :speed="1"
      :scale="1.2"
      :frequency="1.4"
      :warp-strength="1.2"
      :mouse-influence="0.8"
      :parallax="0.6"
      :noise="0.08"
      transparent
    />
    <PixelSnow
      color="#ffffff"
      :flake-size="0.01"
      :min-flake-size="1.25"
      :pixel-resolution="500"
      :speed="1"
      :density="0.1"
      :direction="0"
      :brightness="1"
    />
    <TextType
      class="absolute top-1/2 left-1/2 transform -translate-x-1/4 -translate-y-1/2 text-6xl font-bold text-white whitespace-nowrap"
      :text="textList"
      :typing-speed="100"
      :pause-duration="1500"
      :show-cursor="true"
      cursor-character="|"
      @sentence-complete="handleSentenceComplete"
    />
  </div>
</template>
