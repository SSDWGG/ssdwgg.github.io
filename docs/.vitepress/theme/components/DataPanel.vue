<script setup lang="ts">
import { useSiteLocale } from '../untils/locale'

const { messages } = useSiteLocale()
</script>

<template>
  <div class="panel">
    <div class="container">
      <section class="grid">
        <span class="text">
          {{ messages.busuanzi.sitePv }} <span id="busuanzi_value_site_pv" class="font-bold">--</span> {{ messages.busuanzi.viewUnit }}
        </span>
        <img src="/heart.gif" alt="heart" width="50" height="50" />
        <span class="text">
          {{ messages.busuanzi.siteUv }} <span id="busuanzi_value_site_uv" class="font-bold">--</span> {{ messages.busuanzi.visitorUnit }}
        </span>
      </section>
    </div>
  </div>
</template>

<style scoped>
.panel {
  margin-top: 12px;
  margin-bottom: 8px;
}

.container {
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  width: 100%;
  min-height: 32px;
  max-width: 1152px;
  margin-left: auto;
  margin-right: auto;
}

.grid {
  font-weight: 500;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;
  padding-right: 12px;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  display: grid;
}

.text {
  font-size: .875rem;
  line-height: 1.25rem;
}
</style>
