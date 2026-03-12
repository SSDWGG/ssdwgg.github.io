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
      // { icon: 'twitter', link: 'https://twitter.com/' },
      // { icon: 'discord', link: 'https://chat.vitejs.dev/' },
      {
        icon: {
          svg: '<svg t="1703483542872" class="icon" viewBox="0 0 1309 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6274" width="200" height="200"><path d="M1147.26896 912.681417l34.90165 111.318583-127.165111-66.823891a604.787313 604.787313 0 0 1-139.082747 22.263717c-220.607239 0-394.296969-144.615936-394.296969-322.758409s173.526026-322.889372 394.296969-322.889372C1124.219465 333.661082 1309.630388 478.669907 1309.630388 656.550454c0 100.284947-69.344929 189.143369-162.361428 256.130963zM788.070086 511.869037a49.11114 49.11114 0 0 0-46.360916 44.494692 48.783732 48.783732 0 0 0 46.360916 44.494693 52.090549 52.090549 0 0 0 57.983885-44.494693 52.385216 52.385216 0 0 0-57.983885-44.494692z m254.985036 0a48.881954 48.881954 0 0 0-46.09899 44.494692 48.620028 48.620028 0 0 0 46.09899 44.494693 52.385216 52.385216 0 0 0 57.983886-44.494693 52.58166 52.58166 0 0 0-57.951145-44.494692z m-550.568615 150.018161a318.567592 318.567592 0 0 0 14.307712 93.212943c-14.307712 1.080445-28.746387 1.768001-43.283284 1.768001a827.293516 827.293516 0 0 1-162.394168-22.296458l-162.001279 77.955749 46.328175-133.811485C69.410411 600.858422 0 500.507993 0 378.38496 0 166.683208 208.689602 0 463.510935 0c227.908428 0 427.594322 133.18941 467.701752 312.379588a427.463358 427.463358 0 0 0-44.625655-2.619261c-220.24709 0-394.100524 157.74498-394.100525 352.126871zM312.90344 189.143369a64.270111 64.270111 0 0 0-69.803299 55.659291 64.532037 64.532037 0 0 0 69.803299 55.659292 53.694846 53.694846 0 0 0 57.852923-55.659292 53.465661 53.465661 0 0 0-57.852923-55.659291z m324.428188 0a64.040926 64.040926 0 0 0-69.574114 55.659291 64.302852 64.302852 0 0 0 69.574114 55.659292 53.694846 53.694846 0 0 0 57.951145-55.659292 53.465661 53.465661 0 0 0-57.951145-55.659291z" p-id="6275"></path></svg>',
        },
        link: '/wechatLink',
        // You can include a custom label for accessibility too (optional but recommended):
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
