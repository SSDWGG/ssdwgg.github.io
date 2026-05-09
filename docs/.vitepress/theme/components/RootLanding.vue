<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { localeCards, localeMessages, resolveLocale, type SiteLocale } from '../untils/locale'

const preferredLocale = ref<SiteLocale>('zh')
const copy = computed(() => localeMessages[preferredLocale.value].rootLanding)
const fallbackBadge = computed(() => localeMessages[preferredLocale.value].fallbackBadge)

onMounted(() => {
  const language = window.navigator.languages?.[0] || window.navigator.language || ''
  preferredLocale.value = resolveLocale(language)
})
</script>

<template>
  <section class="root-landing">
    <div class="glow glow-one" aria-hidden="true" />
    <div class="glow glow-two" aria-hidden="true" />

    <div class="hero-panel">
      <p class="eyebrow">{{ copy.eyebrow }}</p>
      <h1>{{ copy.title }}</h1>
      <p class="hero-description">
        {{ copy.description }}
      </p>

      <div class="hero-actions" :aria-label="copy.languageAria">
        <a
          v-for="item in localeCards"
          :key="item.id"
          class="locale-card"
          :class="{ preferred: item.id === preferredLocale }"
          :href="withBase(item.href)"
        >
          <span class="locale-badge">{{ item.id === preferredLocale ? item.badge : fallbackBadge }}</span>
          <strong>{{ item.title }}</strong>
          <span>{{ item.description }}</span>
          <em>{{ item.action }} →</em>
        </a>
      </div>
    </div>

    <div class="quick-grid" aria-label="Quick links">
      <a
        v-for="item in copy.features"
        :key="item.title"
        class="quick-card"
        :href="withBase(item.href)"
      >
        <span class="quick-icon">{{ item.icon }}</span>
        <span class="quick-content">
          <strong>{{ item.title }}</strong>
          <span>{{ item.description }}</span>
          <em>{{ item.action }} →</em>
        </span>
      </a>
    </div>

    <div class="site-note">
      <span v-for="note in copy.siteNotes" :key="note">{{ note }}</span>
    </div>
  </section>
</template>

<style scoped>
.root-landing {
  position: relative;
  width: min(1120px, calc(100vw - 48px));
  margin: -8px 0 0 50%;
  padding: 56px 0 72px;
  transform: translateX(-50%);
  overflow: hidden;
}

.glow {
  position: absolute;
  z-index: -1;
  width: 320px;
  height: 320px;
  border-radius: 999px;
  filter: blur(22px);
  opacity: 0.28;
  pointer-events: none;
}

.glow-one {
  top: 16px;
  left: -80px;
  background: radial-gradient(circle, var(--vp-c-brand-1), transparent 68%);
}

.glow-two {
  right: -90px;
  bottom: 72px;
  background: radial-gradient(circle, #8b5cf6, transparent 68%);
}

.hero-panel {
  position: relative;
  padding: 56px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 32px;
  background:
    linear-gradient(135deg, rgba(100, 108, 255, 0.14), transparent 36%),
    linear-gradient(315deg, rgba(65, 184, 131, 0.13), transparent 34%),
    color-mix(in srgb, var(--vp-c-bg-soft) 82%, transparent);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.16);
}

.eyebrow {
  margin: 0 0 14px;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-panel h1 {
  max-width: 780px;
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: clamp(40px, 7vw, 76px);
  line-height: 1.04;
  letter-spacing: -0.06em;
}

.hero-description {
  max-width: 760px;
  margin: 24px 0 0;
  color: var(--vp-c-text-2);
  font-size: 18px;
  line-height: 1.8;
}

.hero-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 36px;
}

.locale-card,
.quick-card {
  text-decoration: none;
}

.locale-card {
  display: flex;
  min-height: 188px;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  background: color-mix(in srgb, var(--vp-c-bg) 74%, transparent);
  transition:
    border-color 0.25s,
    transform 0.25s,
    background-color 0.25s;
}

.locale-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
}

.locale-card.preferred {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 72%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-soft) 34%, var(--vp-c-bg));
}

.locale-badge {
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
}

.locale-card strong {
  color: var(--vp-c-text-1);
  font-size: 26px;
}

.locale-card span:not(.locale-badge) {
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.locale-card em,
.quick-card em {
  margin-top: auto;
  color: var(--vp-c-brand-1);
  font-style: normal;
  font-weight: 700;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.quick-card {
  display: flex;
  gap: 16px;
  min-height: 180px;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 22px;
  background: var(--vp-c-bg-soft);
  transition:
    border-color 0.25s,
    transform 0.25s,
    background-color 0.25s;
}

.quick-card:hover {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 76%, var(--vp-c-brand-soft));
  transform: translateY(-3px);
}

.quick-icon {
  display: grid;
  flex: 0 0 42px;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 14px;
  background: var(--vp-c-default-soft);
  font-size: 22px;
}

.quick-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-content strong {
  color: var(--vp-c-text-1);
  font-size: 17px;
  line-height: 1.45;
}

.quick-content span {
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.site-note {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 28px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.site-note span {
  padding: 7px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 70%, transparent);
}

@media (max-width: 960px) {
  .root-landing {
    padding-top: 28px;
  }

  .hero-panel {
    padding: 36px;
  }

  .quick-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .root-landing {
    width: min(100% - 32px, 1120px);
    padding-bottom: 48px;
  }

  .hero-panel {
    padding: 28px 22px;
    border-radius: 24px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-actions,
  .quick-grid {
    grid-template-columns: 1fr;
  }

  .locale-card,
  .quick-card {
    min-height: auto;
  }
}
</style>
