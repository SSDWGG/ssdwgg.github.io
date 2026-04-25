import { computed } from 'vue'
import { useData } from 'vitepress'

export type SiteLocale = 'zh' | 'en' | 'fr'

export const localeMessages = {
  zh: {
    dateLocale: 'zh-CN',
    fallbackBadge: 'Language',
    busuanzi: {
      sitePv: '本站总访问量',
      siteUv: '本站访客数',
      viewUnit: '次',
      visitorUnit: '人次',
    },
    lastUpdated: '更新时间',
    article: {
      updated: '更新',
      words: '字数',
      wordUnit: '字',
      readingTime: '时长',
      minuteUnit: '分钟',
    },
    backToTop: '返回顶部',
    websiteFrameFallback: {
      checking: '正在检测 HTTPS 站点可用性...',
      fallback: 'HTTPS 访问异常，正在降级到 HTTP...',
      retryHttps: '重试 HTTPS',
      visitHttp: '访问 HTTP',
    },
    noticeCard: {
      title: 'WGGのCRAD',
      contact: 'WX: Sunshine-RovF',
      lines: ['我是 Ren', '前端开发者', '在接下来的日子里', '继续前进!!'],
      ok: '知道了',
    },
    newYearTexts: ['岁聿其莫，时维新春', '龙马精神，万象更新'],
    clickWords: ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法制', '爱国', '敬业', '诚信', '友善'],
    xlgx: {
      slotFull: '槽位已满，再接再厉~',
      win: '成功加入 kun 圈~',
      level: '第',
      levelSuffix: '关',
      removeFirstThree: '移出前三个',
      back: '回退',
    },
    christmasTree: {
      title: '圣诞树绘制',
      labels: ['开心', '每一天'],
    },
    fluidborderDemo: {
      info: 'INFO 流体边框',
      tip: 'TIP 流体边框',
      warning: 'WARNING 流体边框',
      danger: 'DANGER 流体边框',
      note: 'NOTE 流体边框',
      important: 'IMPORTANT 流体边框',
      caution: 'CAUTION 流体边框',
    },
    rootLanding: {
      eyebrow: 'WPD · WGG’s Personal Docs',
      title: '规划预期、实现技术、持续升级',
      description: '一个用于记录技术工具、AI 协作、开发实践与个人项目的多语言文档站。Choose your language and keep exploring.',
      languageAria: '语言入口',
      siteNotes: ['Built with VitePress', 'Markdown + Vue Components', 'Static docs, fast navigation'],
      features: [
        {
          icon: '🧰',
          title: '技术工具',
          description: '沉淀 Docker、Nginx、ECS、SaaS、PaaS、Vue、React 等常用技术说明。',
          href: '/zh/tech-tools/docker',
          action: '查看工具',
        },
        {
          icon: '🤖',
          title: 'AI 协作',
          description: '记录 AI 工具、环境配置、国内访问方式，以及与 Codex、Claude 的协作经验。',
          href: '/zh/ai/preface',
          action: '阅读 AI',
        },
        {
          icon: '🚀',
          title: '开发范式',
          description: '整理开发模式、版本控制、Docker-first 与 Vibe Coding 等实践方法。',
          href: '/zh/development/type',
          action: '进入开发范式',
        },
        {
          icon: '🗒️',
          title: '更新记录',
          description: '按时间归纳站点内容、结构、部署与文档维护的关键变化。',
          href: '/zh/changelog',
          action: '查看更新',
        },
      ],
    },
  },
  en: {
    dateLocale: 'en-US',
    fallbackBadge: 'Language',
    busuanzi: {
      sitePv: 'Total page views',
      siteUv: 'Site visitors',
      viewUnit: 'views',
      visitorUnit: 'visits',
    },
    lastUpdated: 'Last updated',
    article: {
      updated: 'Updated',
      words: 'Words',
      wordUnit: 'words',
      readingTime: 'Reading time',
      minuteUnit: 'min',
    },
    backToTop: 'Back to top',
    websiteFrameFallback: {
      checking: 'Checking HTTPS availability...',
      fallback: 'HTTPS is unavailable. Falling back to HTTP...',
      retryHttps: 'Retry HTTPS',
      visitHttp: 'Open HTTP',
    },
    noticeCard: {
      title: 'WGG Card',
      contact: 'WeChat: Sunshine-RovF',
      lines: ['I am Ren', 'Front-end developer', 'In the days to come', 'Keep going!!'],
      ok: 'Got it',
    },
    newYearTexts: ['The year turns, spring begins', 'Fresh energy, renewed possibilities'],
    clickWords: ['Focus', 'Build', 'Ship', 'Learn', 'Create', 'Explore', 'Share', 'Iterate', 'Trust', 'Craft', 'Grow', 'Enjoy'],
    xlgx: {
      slotFull: 'The slot is full. Try again!',
      win: 'Successfully joined the kun circle!',
      level: 'Level ',
      levelSuffix: '',
      removeFirstThree: 'Remove first three',
      back: 'Back',
    },
    christmasTree: {
      title: 'Christmas draw',
      labels: ['Happy', 'every', 'day'],
    },
    fluidborderDemo: {
      info: 'INFO fluid border',
      tip: 'TIP fluid border',
      warning: 'WARNING fluid border',
      danger: 'DANGER fluid border',
      note: 'NOTE fluid border',
      important: 'IMPORTANT fluid border',
      caution: 'CAUTION fluid border',
    },
    rootLanding: {
      eyebrow: 'WPD · WGG’s Personal Docs',
      title: 'Plan, build, and keep improving',
      description: 'A multilingual docs site for technical tools, AI workflow, development practices, and personal projects. Choose your language and keep exploring.',
      languageAria: 'Language entrances',
      siteNotes: ['Built with VitePress', 'Markdown + Vue Components', 'Static docs, fast navigation'],
      features: [
        {
          icon: '🧰',
          title: 'Tech Tools',
          description: 'Notes on Docker, Nginx, ECS, SaaS, PaaS, Vue, React, and other everyday tools.',
          href: '/en/getting-started',
          action: 'Explore tools',
        },
        {
          icon: '🤖',
          title: 'AI Workflow',
          description: 'AI tooling, environment setup, China access notes, and Codex / Claude collaboration practices.',
          href: '/en/ai/preface',
          action: 'Read AI notes',
        },
        {
          icon: '🚀',
          title: 'Development',
          description: 'Development modes, Git workflow, Docker-first ideas, and Vibe Coding practices.',
          href: '/en/development/type',
          action: 'Open development',
        },
        {
          icon: '🗒️',
          title: 'Changelog',
          description: 'Meaningful changes to site content, structure, deployment, and documentation maintenance.',
          href: '/en/changelog',
          action: 'View updates',
        },
      ],
    },
  },
  fr: {
    dateLocale: 'fr-FR',
    fallbackBadge: 'Langue',
    busuanzi: {
      sitePv: 'Pages vues',
      siteUv: 'Visiteurs',
      viewUnit: 'vues',
      visitorUnit: 'visites',
    },
    lastUpdated: 'Dernière mise à jour',
    article: {
      updated: 'Mis à jour',
      words: 'Mots',
      wordUnit: 'mots',
      readingTime: 'Temps de lecture',
      minuteUnit: 'min',
    },
    backToTop: 'Retour en haut',
    websiteFrameFallback: {
      checking: 'Vérification de la disponibilité HTTPS...',
      fallback: 'HTTPS est indisponible. Bascule vers HTTP...',
      retryHttps: 'Réessayer HTTPS',
      visitHttp: 'Ouvrir HTTP',
    },
    noticeCard: {
      title: 'Carte WGG',
      contact: 'WeChat : Sunshine-RovF',
      lines: ['Je suis Ren', 'Développeur front-end', 'Pour les jours à venir', 'Continuons !!'],
      ok: 'Compris',
    },
    newYearTexts: ['L’année se termine, le printemps arrive', 'Nouvelle énergie, nouvelles possibilités'],
    clickWords: ['Concentrer', 'Créer', 'Livrer', 'Apprendre', 'Explorer', 'Partager', 'Itérer', 'Grandir', 'Fiabilité', 'Clarté', 'Élan', 'Joie'],
    xlgx: {
      slotFull: 'Les emplacements sont pleins. Réessayez !',
      win: 'Bienvenue dans le cercle kun !',
      level: 'Niveau ',
      levelSuffix: '',
      removeFirstThree: 'Retirer les trois premiers',
      back: 'Retour',
    },
    christmasTree: {
      title: 'Dessin de Noël',
      labels: ['Joie', 'chaque', 'jour'],
    },
    fluidborderDemo: {
      info: 'Bordure fluide INFO',
      tip: 'Bordure fluide CONSEIL',
      warning: 'Bordure fluide AVERTISSEMENT',
      danger: 'Bordure fluide DANGER',
      note: 'Bordure fluide REMARQUE',
      important: 'Bordure fluide IMPORTANT',
      caution: 'Bordure fluide ATTENTION',
    },
    rootLanding: {
      eyebrow: 'WPD · Documentation personnelle de WGG',
      title: 'Planifier, construire et améliorer en continu',
      description: 'Un site de documentation multilingue pour les outils techniques, les workflows IA, les pratiques de développement et les projets personnels. Choisissez votre langue pour continuer.',
      languageAria: 'Entrées de langue',
      siteNotes: ['Propulsé par VitePress', 'Markdown + composants Vue', 'Documentation statique, navigation rapide'],
      features: [
        {
          icon: '🧰',
          title: 'Outils techniques',
          description: 'Notes sur Docker, Nginx, ECS, SaaS, PaaS, Vue, React et d’autres outils courants.',
          href: '/fr/tech-tools/docker',
          action: 'Explorer les outils',
        },
        {
          icon: '🤖',
          title: 'Workflow IA',
          description: 'Outils IA, configuration d’environnement et pratiques de collaboration avec Codex et Claude.',
          href: '/fr/ai/preface',
          action: 'Lire les notes IA',
        },
        {
          icon: '🚀',
          title: 'Développement',
          description: 'Modes de développement, Git workflow, approche Docker-first et pratiques Vibe Coding.',
          href: '/fr/development/type',
          action: 'Ouvrir le développement',
        },
        {
          icon: '🗒️',
          title: 'Journal des changements',
          description: 'Suivi des évolutions importantes du contenu, de la structure et du déploiement.',
          href: '/fr/changelog',
          action: 'Voir le journal',
        },
      ],
    },
  },
} as const

export const localeCards = [
  {
    id: 'zh',
    badge: '推荐',
    title: '简体中文',
    description: '进入中文文档，阅读技术工具、AI 协作、开发范式与个人项目记录。',
    href: '/zh/',
    action: '进入中文站点',
  },
  {
    id: 'en',
    badge: 'Recommended',
    title: 'English',
    description: 'Open the English docs for guides, notes, project pages, and bilingual navigation.',
    href: '/en/',
    action: 'Enter English site',
  },
  {
    id: 'fr',
    badge: 'Recommandé',
    title: 'Français',
    description: 'Accédez aux pages françaises pour les guides VitePress, IA, développement et outils techniques.',
    href: '/fr/',
    action: 'Entrer sur le site français',
  },
] as const

export function resolveLocale(rawLocale = '', relativePath = ''): SiteLocale {
  const locale = rawLocale.toLowerCase()
  const path = relativePath.toLowerCase()

  if (locale.startsWith('fr') || path === 'fr/index.md' || path.startsWith('fr/'))
    return 'fr'

  if (locale.startsWith('en') || path === 'en/index.md' || path.startsWith('en/'))
    return 'en'

  return 'zh'
}

export function useSiteLocale() {
  const { lang, page } = useData()

  const locale = computed(() => resolveLocale(lang.value, page.value.relativePath))
  const messages = computed(() => localeMessages[locale.value])

  return {
    locale,
    messages,
  }
}
