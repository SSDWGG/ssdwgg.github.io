

<script setup lang="ts">
import { useSiteLocale } from '../untils/locale'

const { messages } = useSiteLocale()
</script>

<template>
  <div class="busuanzi">
    {{ messages.busuanzi.siteUv }} <span id="busuanzi_value_site_uv" /> {{ messages.busuanzi.visitorUnit }}
    {{ messages.busuanzi.sitePv }} <span id="busuanzi_value_site_pv" /> {{ messages.busuanzi.viewUnit }}
  </div>
</template>

<style>
.busuanzi {
  font-size: 15px;
  color: gray;
  text-align: center;
}
</style>
