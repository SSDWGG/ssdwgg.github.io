<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Card from './card.vue'
import { useGame } from './core/useGame'
import { basicCannon, schoolPride } from './core/utils'

const containerRef = ref<HTMLElement | undefined>()
const clickAudioRef = ref<HTMLAudioElement | undefined>()
const dropAudioRef = ref<HTMLAudioElement | undefined>()
const winAudioRef = ref<HTMLAudioElement | undefined>()
const loseAudioRef = ref<HTMLAudioElement | undefined>()
const welAudioRef = ref<HTMLAudioElement | undefined>()
const bgmAudioRef = ref<HTMLAudioElement | undefined>()
const curLevel = ref(1)
const showTip = ref(false)
const LevelConfig = [
  { cardNum: 4, layerNum: 2, trap: false },
  { cardNum: 9, layerNum: 3, trap: false },
  { cardNum: 15, layerNum: 6, trap: false },
]

const isWin = ref(false)

const {
  nodes,
  selectedNodes,
  handleSelect,
  handleBack,
  backFlag,
  handleRemove,
  removeFlag,
  removeList,
  handleSelectRemove,
  initData,
} = useGame({
  container: containerRef,
  cardNum: 4,
  layerNum: 2,
  trap: false,
  events: {
    clickCallback: handleClickCard,
    dropCallback: handleDropCard,
    winCallback: handleWin,
    loseCallback: handleLose,
  },
})

function handleClickCard() {
  if (clickAudioRef.value?.paused) {
    clickAudioRef.value.play()
  }
  else if (clickAudioRef.value) {
    clickAudioRef.value.load()
    clickAudioRef.value.play()
  }
}

function handleDropCard() {
  dropAudioRef.value?.play()
}

function handleWin() {
  winAudioRef.value?.play()
  // fireworks()
  if (curLevel.value < LevelConfig.length) {
    basicCannon()
    showTip.value = true
    setTimeout(() => {
      showTip.value = false
    }, 1500)
    setTimeout(() => {
      initData(LevelConfig[curLevel.value])
      curLevel.value++
    }, 2000)
  }
  else {
    isWin.value = true
    schoolPride()
  }
}

function handleLose() {
  loseAudioRef.value?.play()
  setTimeout(() => {
    alert('槽位已满，再接再厉~')
    // window.location.reload()
    nodes.value = []
    removeList.value = []
    selectedNodes.value = []
    welAudioRef.value?.play()
    curLevel.value = 0
    showTip.value = true
    setTimeout(() => {
      showTip.value = false
    }, 1500)
    setTimeout(() => {
      initData(LevelConfig[curLevel.value])
      curLevel.value++
    }, 2000)
  }, 500)
}

onMounted(() => {
  initData()
})
</script>

<template>
  <div class="xlgx-container">
    <div class="title">
      XLGX
    </div>
    <div ref="containerRef" class="game-container">
      <div class="game-area">
        <template v-for="item in nodes" :key="item.id">
          <transition name="slide-fade">
            <Card
              v-if="[0, 1].includes(item.state)"
              :node="item"
              @click-card="handleSelect"
            />
          </transition>
        </template>
      </div>
      <transition name="bounce">
        <div v-if="isWin" class="win-message">
          成功加入kun圈~
        </div>
      </transition>
      <transition name="bounce">
        <div v-if="showTip" class="tip-message">
          第{{ curLevel + 1 }}关
        </div>
      </transition>
    </div>

    <div class="remove-area">
      <Card
        v-for="item in removeList" :key="item.id" :node="item"
        is-dock
        @click-card="handleSelectRemove"
      />
    </div>
    <div class="selected-area">
      <div class="selected-container">
        <template v-for="item in selectedNodes" :key="item.id">
          <transition name="bounce">
            <Card
              v-if="item.state === 2"
              :node="item"
              is-dock
            />
          </transition>
        </template>
      </div>
    </div>

    <div class="button-area">
      <button :disabled="removeFlag" class="remove-btn" @click="handleRemove">
        移出前三个
      </button>
      <button :disabled="backFlag" class="back-btn" @click="handleBack">
        回退
      </button>
    </div>

    <audio
      ref="clickAudioRef"
      style="display: none;"
      controls
      src="/xlgx/audio/click.mp3"
    />
    <audio
      ref="dropAudioRef"
      style="display: none;"
      controls
      src="/xlgx/audio/drop.mp3"
    />
    <audio
      ref="winAudioRef"
      style="display: none;"
      controls
      src="/xlgx/audio/win.mp3"
    />
    <audio
      ref="loseAudioRef"
      style="display: none;"
      controls
      src="/xlgx/audio/lose.mp3"
    />
    <audio
      ref="welAudioRef"
      style="display: none;"
      controls
      src="/xlgx/audio/welcome.mp3"
    />
    <audio
      ref="bgmAudioRef"
      style="display: none;"
      controls
      autoplay 
      loop 
      src="/xlgx/audio/welcome.mp3"
    />
  </div>
</template>

<style lang="less">
.xlgx-container {
  margin: 100px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 600px;
  background-color: rgba(195, 254, 139, .7);


.title {
  font-size: 44px;
  text-align: center;
  width: 100%;
  color: #000;
  font-weight: 600;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
}

.game-container {
  flex: 1;
  display: flex;
}

.game-area {
  width: 100%;
  position: relative;
  flex: 1;
}

.win-message,
.tip-message {
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 28px;
  font-weight: bold;
}

.remove-area {
  text-align: center;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-area {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-container {
  border: 4px dashed #000;
  width: 295px;
  height: 44px;
  display: flex;
}

.button-area {
  height: 50px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}

.remove-btn {
  margin-right: 10px;
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.25);
  }

  100% {
    transform: scale(1);
  }
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(25vh);
  opacity: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}}
</style>