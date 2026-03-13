import { defineConfig } from 'vitepress'

import markdownItTaskCheckbox from 'markdown-it-task-checkbox'
import { groupIconMdPlugin, groupIconVitePlugin, localIconLoader } from 'vitepress-plugin-group-icons'
import { MermaidMarkdown, MermaidPlugin } from 'vitepress-plugin-mermaid'
import { devDependencies } from '../../package.json'
import timeline from "vitepress-markdown-timeline"; // [!code focus]
import { generateSidebar } from 'vitepress-sidebar';

import { usePosts } from './theme/untils/permalink'

const { rewrites } = await usePosts()

const vitepressSidebarOptions = {
  /* Options... */
};

export default defineConfig({
  lang: 'zh-CN',
  title: 'WPD',
  description: 'WGG’s personal docs',
  rewrites,

  // #region fav
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  // #endregion fav

  base: '/', // 网站部署到github的vitepress这个仓库里

  cleanUrls:true, //开启纯净链接无html

  // 启用深色模式
  appearance: 'dark',
  // 站点地图
  sitemap: {
    hostname: 'https://ssdwgg.github.io',
  },

  // 多语言
  locales: {
    root: {
      label: '简体中文',
      lang: 'Zh_CN',
    },
    // en: {
    //   label: 'English',
    //   lang: 'en',
    //   link: '/en/',
    // },
    // fr: {
    //   label: 'French',
    //   lang: 'fr',
    //   link: '/fr/',
    // },
  },

  // markdown配置
  markdown: {
    // 行号显示
    lineNumbers: true,

    // toc显示一级标题
    toc: { level: [1, 2, 3] },

    // 使用 `!!code` 防止转换
    codeTransformers: [
      {
        postprocess(code) {
          return code.replace(/\[!!code/g, '[!code')
        },
      },
    ],

    // 开启图片懒加载
    image: {
      lazyLoading: true,
    },

    config: (md) => {
      // 组件插入h1标题下
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1')
          htmlResult += `<ArticleMetadata />`
        return htmlResult
      },

      // 代码组中添加图片
      md.use((md) => {
        const defaultRender = md.render
        md.render = (...args) => {
          const [content, env] = args
          const currentLang = env?.localeIndex || 'root'
          const isHomePage = env?.path === '/' || env?.relativePath === 'index.md' // 判断是否是首页

          if (isHomePage) {
            return defaultRender.apply(md, args) // 如果是首页，直接渲染内容
          }
          // 调用原始渲染
          let defaultContent = defaultRender.apply(md, args)
          // 替换内容
          if (currentLang === 'root') {
            defaultContent = defaultContent.replace(/NOTE/g, '提醒')
              .replace(/TIP/g, '建议')
              .replace(/IMPORTANT/g, '重要')
              .replace(/WARNING/g, '警告')
              .replace(/CAUTION/g, '注意')
          }
          else if (currentLang === 'ko') {
            // 韩文替换
            defaultContent = defaultContent.replace(/NOTE/g, '알림')
              .replace(/TIP/g, '팁')
              .replace(/IMPORTANT/g, '중요')
              .replace(/WARNING/g, '경고')
              .replace(/CAUTION/g, '주의')
          }
          // 返回渲染的内容
          return defaultContent
        }

        // 获取原始的 fence 渲染规则
        const defaultFence = md.renderer.rules.fence?.bind(md.renderer.rules) ?? ((...args) => args[0][args[1]].content)

        // 重写 fence 渲染规则
        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
          const token = tokens[idx]
          const info = token.info.trim()

          // 判断是否为 md:img 类型的代码块
          if (info.includes('md:img')) {
            // 只渲染图片，不再渲染为代码块
            return `<div class="rendered-md">${md.render(token.content)}</div>`
          }

          // 其他代码块按默认规则渲染（如 java, js 等）
          return defaultFence(tokens, idx, options, env, self)
        }
      })

      md.use(groupIconMdPlugin) // 代码组图标
      md.use(markdownItTaskCheckbox) // todo
      md.use(MermaidMarkdown)
      md.use(timeline);

    },

  },

  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          ts: localIconLoader(import.meta.url, '../public/svg/typescript.svg'), //本地ts图标导入
          md: localIconLoader(import.meta.url, '../public/svg/md.svg'), //markdown图标
          css: localIconLoader(import.meta.url, '../public/svg/css.svg'), //css图标
          js: 'logos:javascript', //js图标
        },
      }),
      [MermaidPlugin()]
    ]as any,
    optimizeDeps: {
      include: ['mermaid'],
    },
    ssr: {
      noExternal: ['mermaid'],
    },
    build: {
      chunkSizeWarningLimit: 10000, 
      rollupOptions: {
        onwarn(warning, warn) {
          // 忽略特定库的 eval 警告
          if (
            warning.code === 'EVAL' && 
            warning.id?.includes('svgaplayerweb')
          ) {
            return;
          }
          // 保留其他警告
          warn(warning);
        },
        output: {
          manualChunks(id) {
            // 1. 将 three.js 及其示例单独分包
            if (id.includes('/node_modules/three/')) {
              return 'three-vendor';
            }
            
            // 2. 将 svga 单独分包
            if (id.includes('/node_modules/svgaplayerweb/')) {
              return 'svga-vendor';
            }

            // 3. (可选) 将其他 node_modules 打包到 vendor 中
            if (id.includes('/node_modules/')) {
              return 'vendor';
            }
          },
          
        },
      
      },
    },
  },

  lastUpdated: true, // 此配置不会立即生效，需git提交后爬取时间戳，没有安装git本地报错可以先注释

  // 主题配置
  themeConfig: {
    // 左上角logo
    logo: '/favicon.ico',
    // logo: 'https://vitejs.cn/vite3-cn/logo-with-shadow.png', //远程引用
    // siteTitle: false, //标题隐藏

    // 设置站点标题 会覆盖title
    // siteTitle: 'Hello World',

    // 编辑本页
    editLink: {
      pattern: 'https://github.com/SSDWGG/ssdwgg.github.io/blob/main/docs/:path', // 改成自己的仓库
      text: '在Github编辑本页',
    },

    // 上次更新时间
    lastUpdated: {
      text: '上次更新时间',
      formatOptions: {
        dateStyle: 'short', // 可选值full、long、medium、short
        timeStyle: 'medium', // 可选值full、long、medium、short
      },
    },
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'WGG🍉', link: '/wgg/personal' },
      { text: `导航`, link: '/wgg/project' },
      { text: '更新日志', link: '/changelog' },
    ],

    // 侧边栏
    sidebar: [
     {
        text: '📚vitepress文档简介',
        collapsed: true,
        items: [
          {
            // 分组标题1
            text: '介绍',
            collapsed: false,
            items: [
              { text: '前言', link: '/preface' },
            ],
          },
          {
            // 分组标题2
            text: '基础配置',
            collapsed: false,
            items: [
              { text: '快速上手', link: '/getting-started' },
              { text: '配置', link: '/configuration' },
              { text: '页面', link: '/page' },
              { text: 'Frontmatter', link: '/frontmatter' },
            ],
          },
          {
            // 分组标题3
            text: '进阶玩法',
            collapsed: false,
            items: [
              { text: 'Markdown', link: '/markdown' },
              { text: '团队', link: '/team' },
              { text: '多语言', link: '/multi-language' },
              { text: 'DocSearch', link: '/docsearch' },
              { text: '静态部署', link: '/assets' },
              { text: '样式美化', link: '/style' },
              { text: '组件', link: '/components' },
              { text: '布局插槽', link: '/layout' },
              { text: '插件', link: '/plugin' },
              { text: '更新及卸载', link: '/update' },
              { text: '搭建导航', link: '/nav/' },
              { text: '永久链接', link: '/permalink/' },
            ],
          },
        ],
      },
      {
        text: '开发范式',
        collapsed: true,
        items: [
          { text: '开发模式', link: '/development/type' },
          { text: 'Vibe coding', link: '/development/ai' },
          { text: '版本控制', link: '/development/git' },
        ],
      },
      {
        text: '简单算法',
        collapsed: true,
        items: [
          { text: '排序', link: '/frontEnd/algorithm' },
        ],
      },
      {
        text: '电子书籍',
        collapsed: true,
        items: [
          { text: 'JS高级程序设计', link: '/frontEnd/book/advancedProgramming' },
          { text: '面试宝典', link: '/frontEnd/book/interview' },
          { text: 'css揭秘', link: '/frontEnd/book/css' },
          { text: '代码整洁之道', link: '/frontEnd/book/code' },
          { text: '算法详解', link: '/frontEnd/book/algorithm' },
        ],
      },
      {
        text: 'ERP 2026',
        collapsed: true,
        items: [
          // { text: '项目配置', link: '/plan/env' },
          { text: '目标需求', link: '/plan/todo' },
          // { text: '需求评估', link: '/plan/solution' },
          // { text: '需求模块', link: '/plan/solution-part' },
          // { text: 'ERP迭代记录', link: '/plan/iteration' },
          // { text: '人员招聘', link: '/plan/recruitment' },
        ],
      },
      {
        text: '其他文档',
        collapsed: true,
        items: [
          { text: '单向同步windows', link: '/other/sync-win' },
          { text: '单向同步mac', link: '/other/sync-mac' },
          { text: 'svga资源', link: '/other/svga' },
          { text: 'IKUN', link: '/other/ikun' },
          { text: 'XLGX', link: '/other/xlgx' },
          { text: 'Thursday', link: '/other/Thursday' },
          { text: '圣诞节树', link: '/other/christmas-tree' },
          { text: '圣诞人', link: '/other/christmas-role' },
          { text: 'splineRole', link: '/other/splineRole' },
          { text: '新年', link: '/other/newYear' },
          { text: 'hextris', link: '/other/hextris' },

        ],
      },
    ],
    // sidebar: generateSidebar({
    //   /*
    //    * For detailed instructions, see the links below:
    //    * https://vitepress-sidebar.jooy2.com/guide/api
    //    */
    //   documentRootPath: '/docs', //文档根目录
    //   // scanStartPath: null,
    //   // resolvePath: null,
    //   // useTitleFromFileHeading: true,
    //   // useTitleFromFrontmatter: true,
    //   // frontmatterTitleFieldName: 'title',
    //   // useFolderTitleFromIndexFile: false, //是否使用层级首页文件名做分级标题
    //   // useFolderLinkFromIndexFile: false, //是否链接至层级首页文件
    //   // hyphenToSpace: true,
    //   // underscoreToSpace: true,
    //   // capitalizeFirst: false,
    //   // capitalizeEachWords: false,
    //   collapsed: false, //折叠组关闭
    //   collapseDepth: 2, //折叠组2级菜单
    //   // sortMenusByName: false,
    //   // sortMenusByFrontmatterOrder: false,
    //   // sortMenusByFrontmatterDate: false,
    //   // sortMenusOrderByDescending: false,
    //   // sortMenusOrderNumericallyFromTitle: false,
    //   // sortMenusOrderNumericallyFromLink: false,
    //   // frontmatterOrderDefaultValue: 0,
    //   // manualSortFileNameByPriority: ['first.md', 'second', 'third.md'], //手动排序，文件夹不用带后缀
    //   removePrefixAfterOrdering: false, //删除前缀，必须与prefixSeparator一起使用
    //   prefixSeparator: '.', //删除前缀的符号
    //   // excludeFiles: ['first.md', 'secret.md'],
    //   // excludeFilesByFrontmatterFieldName: 'exclude',
    //   // excludeFolders: ['secret-folder'],
    //   // includeDotFiles: false,
    //   // includeRootIndexFile: false,
    //   // includeFolderIndexFile: false, //是否包含层级主页
    //   // includeEmptyFolder: false,
    //   // rootGroupText: 'Contents',
    //   // rootGroupLink: 'https://github.com/jooy2',
    //   // rootGroupCollapsed: false,
    //   // convertSameNameSubFileToGroupIndexPage: false,
    //   // folderLinkNotIncludesFileName: false,
    //   // keepMarkdownSyntaxFromTitle: false,
    //   // debugPrint: false,
    // }),

    // Algolia搜索
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                },
              },
            },
          },
        },
      },      // provider: 'algolia',
      // options: {
      //   appId: 'QVKQI62L15',
      //   apiKey: 'bef8783dde57293ce082c531aa7c7e0c',
      //   indexName: 'doc',
      //   locales: {
      //     root: {
      //       placeholder: '搜索文档',
      //       translations: {
      //         button: {
      //           buttonText: '搜索文档',
      //           buttonAriaLabel: '搜索文档',
      //         },
      //         modal: {
      //           searchBox: {
      //             // resetButtonTitle: '清除查询条件',
      //             // resetButtonAriaLabel: '清除查询条件',
      //             // cancelButtonText: '取消',
      //             // cancelButtonAriaLabel: '取消',
      //           },
      //           startScreen: {
      //             recentSearchesTitle: '搜索历史',
      //             noRecentSearchesText: '没有搜索历史',
      //             saveRecentSearchButtonTitle: '保存至搜索历史',
      //             removeRecentSearchButtonTitle: '从搜索历史中移除',
      //             favoriteSearchesTitle: '收藏',
      //             removeFavoriteSearchButtonTitle: '从收藏中移除',
      //           },
      //           errorScreen: {
      //             titleText: '无法获取结果',
      //             helpText: '你可能需要检查你的网络连接',
      //           },
      //           footer: {
      //             selectText: '选择',
      //             navigateText: '切换',
      //             closeText: '关闭',
      //             // searchByText: '搜索提供者',
      //           },
      //           noResultsScreen: {
      //             noResultsText: '无法找到相关结果',
      //             suggestedQueryText: '你可以尝试查询',
      //             reportMissingResultsText: '你认为该查询应该有结果？',
      //             reportMissingResultsLinkText: '点击反馈',
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/SSDWGG/ssdwgg.github.io' },
      
      {
        icon: {
          svg: '<svg t="1773385389751" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9862" width="48" height="48"><path d="M183.515429 492.495238v67.657143l87.161904 0.024381 150.869334 55.734857h159.744a37.010286 37.010286 0 0 1 0 74.020571h-135.216762a12.361143 12.361143 0 0 0 0 24.697905h156.086857c10.630095 0 21.138286-2.267429 30.817524-6.704762l190.634666-87.064381a64.26819 64.26819 0 0 1 84.016762 29.354667 61.293714 61.293714 0 0 1-27.233524 82.578286L519.509333 913.310476a123.66019 123.66019 0 0 1-96.475428 6.022095l-197.388191-69.680761H183.515429v62.464H109.714286V492.495238h73.801143zM527.969524 97.52381C704.609524 97.52381 847.823238 241.200762 847.823238 418.425905c0 56.417524-14.506667 109.470476-40.009143 155.526095l-4.486095 1.926095-137.020952 62.585905-0.780191-4.071619a86.186667 86.186667 0 0 0-84.114286-67.852191l-151.161904-0.02438-150.796191-55.710477H232.71619v-67.705904h-23.649523a326.460952 326.460952 0 0 1-0.926477-24.673524C208.14019 241.176381 351.329524 97.52381 527.969524 97.52381z m30.963809 121.904761h-73.142857l-0.048762 28.476953a80.457143 80.457143 0 0 0-20.723809 11.385905c-16.335238 12.55619-24.502857 30.061714-24.502857 52.49219 0 11.995429 1.926095 22.381714 5.753904 31.158857 3.82781 8.777143 9.728 16.579048 17.676191 23.332572 7.94819 6.777905 19.846095 13.799619 35.742476 21.016381 17.554286 7.875048 28.355048 13.116952 32.426667 15.652571 4.047238 2.56 6.997333 5.095619 8.825904 7.582476a14.384762 14.384762 0 0 1 2.755048 8.777143 15.62819 15.62819 0 0 1-6.826667 13.068191c-4.559238 3.388952-11.727238 5.071238-21.504 5.071238-11.337143 0-23.79581-1.80419-37.351619-5.412572a195.632762 195.632762 0 0 1-31.573333-11.385905L438.857143 416.963048v58.660571c11.897905 5.656381 23.332571 9.630476 34.328381 11.922286 3.85219 0.78019 8.045714 1.462857 12.55619 1.950476l0.048762 22.503619h73.142857v-28.379429a96.792381 96.792381 0 0 0 5.924572-2.438095c14.433524-6.485333 25.502476-15.60381 33.158095-27.306666 7.68-11.727238 11.50781-25.136762 11.50781-40.252953 0-16.457143-4.071619-30.086095-12.239239-40.911238-8.167619-10.849524-22.77181-20.967619-43.763809-30.427429-21.894095-9.99619-35.303619-16.896-40.228572-20.675047-4.973714-3.779048-7.43619-8.045714-7.43619-12.824381 0-4.437333 1.950476-8.167619 5.851429-11.166476 3.876571-2.998857 10.093714-4.510476 18.651428-4.510476 14.726095 0 31.890286 4.144762 51.516953 12.385523l7.484952 3.291429L609.52381 257.950476a202.849524 202.849524 0 0 0-50.614858-15.36V219.428571z" p-id="9863" fill="#d0a0eb"></path></svg>',
        },
        link: '/buymecoffee',
        ariaLabel: 'BuyMeCoffee',
      },
      {
        icon: {
          svg: '<svg t="1773385324197" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7069" width="48" height="48"><path d="M0 0m192 0l640 0q192 0 192 192l0 640q0 192-192 192l-640 0q-192 0-192-192l0-640q0-192 192-192Z" fill="#000000" p-id="7070"></path><path d="M444.608 416.256V384.64a200.512 200.512 0 0 0-32.512-2.56 241.536 241.536 0 0 0-241.408 241.152c0 82.112 41.088 153.92 103.552 197.568a239.616 239.616 0 0 1-65.024-164.224C208.32 525.76 313.6 418.816 444.608 416.256z" fill="#00F2EA" p-id="7071"></path><path d="M450.56 767.744c59.136 0 107.904-47.04 110.464-106.048V135.744h95.872c-1.664-11.136-3.392-22.208-3.392-33.344H522.496v525.952a110.4 110.4 0 0 1-110.4 106.048c-18.88 0-35.968-4.224-51.392-12.8 20.544 28.16 53.12 46.144 89.92 46.144z" fill="#00F2EA" p-id="7072"></path><path d="M736.512 255.488a179.84 179.84 0 0 1-44.48-119.68h-35.136a183.296 183.296 0 0 0 79.616 119.68zM412.096 513.792c-60.8 0-110.464 49.6-110.464 110.272 0 42.816 24 79.552 59.072 97.536-12.8-17.92-20.48-40.192-20.48-64.128 0-60.8 49.6-110.336 110.4-110.336 11.072 0 22.208 1.664 32.512 5.12V417.92a200.576 200.576 0 0 0-32.512-2.56h-6.016v102.592a135.616 135.616 0 0 0-32.512-4.224z" fill="#FF004F" p-id="7073"></path><path d="M836.672 314.496v101.76a305.664 305.664 0 0 1-182.336-59.008v266.88a241.536 241.536 0 0 1-380.096 197.504 243.008 243.008 0 0 0 177.216 76.992 241.536 241.536 0 0 0 241.408-241.152v-266.88a313.6 313.6 0 0 0 182.4 59.008V317.888c-13.76 0-26.56-0.832-38.592-3.392z" fill="#FF004F" p-id="7074"></path><path d="M653.44 624.128v-266.88a313.536 313.536 0 0 0 182.4 59.008v-101.76a185.152 185.152 0 0 1-99.328-59.008 182.4 182.4 0 0 1-80.448-119.68H561.024v525.952a110.4 110.4 0 0 1-110.4 105.984 110.72 110.72 0 0 1-89.92-46.144 111.04 111.04 0 0 1-59.072-97.472c0-60.8 49.664-110.336 110.464-110.336 11.136 0 22.208 1.664 32.512 5.12V416.256a241.088 241.088 0 0 0-236.288 241.216c0 63.296 24.832 121.408 65.088 164.16a242.688 242.688 0 0 0 138.688 43.648 241.024 241.024 0 0 0 241.408-241.152z" fill="#FFFFFF" p-id="7075"></path></svg>',
        },
        link: 'https://instagram.com/ssdwgg?igshid=YmMyMTA2M2Y=',
        ariaLabel: 'TikTok',
      },
      {
        icon: {
          svg: '<svg t="1773385219607" class="icon" viewBox="0 0 1031 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4871" width="48" height="48"><path d="M0 0z m790.037 519.76c0 149.27-121.04 270.277-270.276 270.277-149.269 0-270.276-121.007-270.276-270.276a266.31 266.31 0 0 1 5.1-51.976H72.767v359.252c0 77.12 62.468 139.718 139.718 139.718h614.552c77.12 0 139.718-62.533 139.718-139.718V467.785H785.001a271.41 271.41 0 0 1 5.036 51.976z m37-446.993H212.485c-77.185 0-139.718 62.566-139.718 139.718v151.348h226.29c48.923-69.129 129.518-114.348 220.704-114.348s171.78 45.22 220.703 114.348h226.291V212.485c0-77.12-62.566-139.718-139.718-139.718z m68.349 172.56c0 13.774-11.24 24.949-24.949 24.949h-74.78c-13.71 0-24.95-11.24-24.95-24.949v-74.845c0-13.774 11.273-24.949 24.95-24.949h74.78c13.774 0 24.949 11.24 24.949 24.949v74.845zM686.084 519.761c0-91.9-74.488-166.324-166.323-166.324s-166.324 74.424-166.324 166.324 74.489 166.323 166.324 166.323 166.323-74.423 166.323-166.323z" fill="#db639b" p-id="4872"></path></svg>',
        },
        link: 'https://instagram.com/ssdwgg?igshid=YmMyMTA2M2Y=',
        ariaLabel: 'instagram',
      },
      {
        icon: {
          svg: '<svg t="1773385295733" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6053" width="48" height="48"><path d="M1024.16 694.816c0-149.92-143.104-271.392-319.584-271.392-176.576 0-319.68 121.504-319.68 271.392S528 966.208 704.576 966.208c55.456 0 107.648-12.096 153.184-33.248l125.984 54.528-14.592-140.544c34.784-43.392 55.04-95.808 55.04-152.128zM596.832 621.28c-25.152 0-45.472-20.352-45.472-45.472s20.32-45.472 45.472-45.472c25.12 0 45.44 20.384 45.44 45.472s-20.384 45.472-45.44 45.472z m215.392 0c-25.056 0-45.44-20.352-45.44-45.472s20.384-45.472 45.44-45.472c25.184 0 45.536 20.384 45.536 45.472s-20.352 45.472-45.536 45.472zM704.576 387.488c49.376 0 96.416 8.8 139.264 24.64 0.32-5.728 0.992-11.232 0.992-16.992 0-198.08-189.152-358.624-422.432-358.624C189.184 36.512 0.032 197.024 0.032 395.136c0 74.496 26.816 143.776 72.704 201.12L53.472 781.92l166.432-72.096c41.216 19.2 86.784 32.16 134.88 38.784-3.616-17.504-5.824-35.424-5.824-53.792 0.032-169.44 159.552-307.296 355.616-307.296z m-139.808-209.6c33.184 0 60 26.88 60 60 0 33.184-26.816 60.064-60 60.064s-60.032-26.88-60.032-60.064c0-33.152 26.88-60 60.032-60zM280.032 297.952c-33.184 0-60-26.88-60-60.064 0-33.152 26.848-60 60-60 33.184 0 60.032 26.88 60.032 60s-26.88 60.064-60.032 60.064z" fill="#51C332" p-id="6054"></path></svg>',
        },
        link: '/wechatLink',
        ariaLabel: 'wechat',
      },
    ],

    // 手机端深浅模式文字修改
    darkModeSwitchLabel: '深浅模式',

    // 页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2023-${new Date().getFullYear()} <a href="https://github.com/SSDWGG" target="_blank">任羿玮</a> 备案号：<a href="https://beian.miit.gov.cn/" target="_blank">浙 ICP备2021009489号-2</a>`,
    },

    // 侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    // 返回顶部文字修改(移动端)
    returnToTopLabel: '返回顶部',

    // 大纲显示2-3级标题
    outline: {
      level: [2, 3],
      label: '当前页大纲',
    },

    // 自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

  },

})
