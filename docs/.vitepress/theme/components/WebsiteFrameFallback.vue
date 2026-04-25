<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useSiteLocale } from '../untils/locale'

const { messages } = useSiteLocale()

const props = withDefaults(defineProps<{
  httpsUrl: string
  httpUrl: string
  height?: string
  timeoutMs?: number
  autoRedirect?: boolean
}>(), {
  height: '100vh',
  timeoutMs: 5000,
  autoRedirect: true,
})

const mode = ref<'checking' | 'https' | 'fallback'>('checking')
const iframeLoaded = ref(false)

let probeTimer: ReturnType<typeof setTimeout> | undefined
let iframeTimer: ReturnType<typeof setTimeout> | undefined

function clearTimers() {
  if (probeTimer)
    clearTimeout(probeTimer)
  if (iframeTimer)
    clearTimeout(iframeTimer)
}

function fallbackToHttp() {
  mode.value = 'fallback'
  if (typeof window !== 'undefined' && props.autoRedirect)
    window.location.href = props.httpUrl
}

function handleIframeLoad() {
  iframeLoaded.value = true
  if (iframeTimer)
    clearTimeout(iframeTimer)
}

onMounted(async () => {
  if (typeof window === 'undefined')
    return

  const controller = new AbortController()
  probeTimer = setTimeout(() => controller.abort(), props.timeoutMs)

  try {
    await fetch(props.httpsUrl, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal,
    })

    if (probeTimer)
      clearTimeout(probeTimer)

    mode.value = 'https'
    iframeTimer = setTimeout(() => {
      if (!iframeLoaded.value)
        fallbackToHttp()
    }, props.timeoutMs)
  }
  catch {
    fallbackToHttp()
  }
})

onBeforeUnmount(() => {
  clearTimers()
})
</script>

<template>
  <div class="website-frame-fallback">
    <div
      v-if="mode === 'checking'"
      class="website-frame-fallback__status"
      :style="{ height }"
    >
      <p>{{ messages.websiteFrameFallback.checking }}</p>
    </div>

    <iframe
      v-else-if="mode === 'https'"
      class="website-frame-fallback__iframe"
      :style="{ height }"
      :src="httpsUrl"
      @load="handleIframeLoad"
    />

    <div
      v-else
      class="website-frame-fallback__status"
      :style="{ height }"
    >
      <p>{{ messages.websiteFrameFallback.fallback }}</p>
      <div class="website-frame-fallback__actions">
        <a :href="httpsUrl">{{ messages.websiteFrameFallback.retryHttps }}</a>
        <a :href="httpUrl">{{ messages.websiteFrameFallback.visitHttp }}</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.website-frame-fallback {
  width: 100%;
}

.website-frame-fallback__iframe {
  width: 100%;
  border: none;
  display: block;
}

.website-frame-fallback__status {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.website-frame-fallback__status p {
  margin: 0;
  color: var(--vp-c-text-1);
}

.website-frame-fallback__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.website-frame-fallback__actions a {
  padding: 10px 16px;
  border-radius: 10px;
  background: var(--vp-c-brand-1);
  color: #fff;
  text-decoration: none;
}

.website-frame-fallback__actions a:last-child {
  background: var(--vp-c-default-2);
  color: var(--vp-c-text-1);
}
</style>
