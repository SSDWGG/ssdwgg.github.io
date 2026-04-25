<script setup lang="ts">
import { computed } from 'vue'
import TextType from './TextType.vue'
import { useSiteLocale } from '../../untils/locale'


const emit = defineEmits(['ok'])
const { messages } = useSiteLocale()
const textList = computed(() => messages.value.newYearTexts)
const handleSentenceComplete = (_sentence: string, index: number) => {
  if (index === textList.value.length - 1) {
    emit('ok')
  }
}
</script>

<template>
  <div style="width: 100%; height: 100vh; position: relative;">
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
