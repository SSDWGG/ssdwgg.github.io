<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { useSiteLocale } from '../untils/locale'

const { page } = useData()
const { messages } = useSiteLocale()

const date = computed(
  () => new Date(page.value.lastUpdated!)
)
</script>

<template>
  <div class="LastUpdated">
    <p>{{ messages.lastUpdated }}: {{ date.toLocaleString(messages.dateLocale) }}</p>
  </div>
</template>

<style>
.LastUpdated {
  color: var(--vp-c-text-2);
}
</style>
