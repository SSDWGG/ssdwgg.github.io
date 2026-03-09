<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<Props>()
const emit = defineEmits(['clickCard'])

// 加载图片资源
// const modules = (import.meta as any).glob('/xlgx/tutukun/*.png', {
//   as: 'url',
//   import: 'default',
//   eager: true,
// })
// const IMG_MAP = Object.keys(modules).reduce((acc, cur) => {
//   const key = cur.replace('/xlgx/tutukun/', '').replace('.png', '')
//   acc[key] = modules[cur]
//   return acc
// }, {} as Record<string, string>)
const IMG_MAP = {
  1: "/xlgx/tutukun/1.png",
  2: "/xlgx/tutukun/2.png",
  3: "/xlgx/tutukun/3.png",
  4: "/xlgx/tutukun/4.png",
  5: "/xlgx/tutukun/5.png",
  6: "/xlgx/tutukun/6.png",
  7: "/xlgx/tutukun/7.png",
  8: "/xlgx/tutukun/8.png",
  9: "/xlgx/tutukun/9.png",
  10: "/xlgx/tutukun/10.png",
  11: "/xlgx/tutukun/11.png"
}

// 卡片节点类型
type CardNode = {
  id: string           // 节点id zIndex-index
  type: number         // 类型
  zIndex: number       // 图层
  index: number        // 所在图层中的索引
  parents: CardNode[]  // 父节点
  row: number          // 行
  column: number       // 列
  top: number
  left: number
  state: number        // 是否可点击 0： 无状态  1： 可点击 2：已选 3：已消除
}

interface Props {
  node: CardNode
  isDock?: boolean
}
const isFreeze = computed(() => {
  return props.node.parents.length > 0 ? props.node.parents.some(o => o.state < 2) : false
},
)

function handleClick() {
  if (!isFreeze.value)
    emit('clickCard', props.node)
}
</script>

<template>
  <div class="card"
    :style="isDock ? {} : { position: 'absolute', zIndex: node.zIndex, top: `${node.top}px`, left: `${node.left}px` }"
    @click.stop="handleClick">
    <!-- {{ node.zIndex }}-{{ node.type }} -->
    <!-- {{ node.id }} -->
    <img :src="IMG_MAP[node.type]" width="40" height="40" :alt="`${node.type}`">
    <div v-if="isFreeze" class="mask" />
  </div>
</template>

<style scoped>
.card {
  width: 40px;
  height: 40px;
  /* border: 1px solid red; */
  background: #f9f7e1;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 4px;
  border: 1px solid #000;
  box-shadow: 1px 5px 5px -1px #000;
  cursor: pointer;
}

img {
  border-radius: 4px;
}

.mask {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.55);
  width: 40px;
  height: 40px;
  pointer-events: none;
}
</style>
