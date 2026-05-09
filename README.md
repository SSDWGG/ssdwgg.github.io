<div align="center">
  <img alt="WPD" width="140" src="./docs/public/logo.png">
  <h1>WPD</h1>
  <p>一个基于 VitePress 的个性化文档模板。</p>
  <p>适合用来搭建文档站、知识库、博客或个人内容主页。</p>
</div>

## 项目简介

`WPD` 是一个基于 `VitePress` 搭建的个性化文档站点模板。

它不只是一个基础文档壳子，而是一个适合继续扩展的站点底座: 你可以拿它写技术笔记、搭知识库、做作品展示、沉淀组件实验，也可以把它改造成属于你自己的博客或文档品牌。

这个仓库已经内置了不少定制能力，比如主题扩展、文章元信息、评论系统、动效组件、Mermaid、任务列表、时间线、图片缩放、代码组图标等，适合希望在 VitePress 默认主题之上进一步增强体验的人。

## 在线预览

- 预览地址: [https://ssdwgg.github.io/WPD/](https://ssdwgg.github.io/WPD/)

## 这个项目有什么特点

- 基于 `VitePress + Vue 3`，保留官方生态的轻量和开发体验。
- 首页、主题样式、组件系统都做了明显定制，不是开箱即用的默认皮肤。
- 支持 `Mermaid`、任务清单、时间线、代码组图标等常见内容增强能力。
- 自动注入文章元信息，便于展示阅读时长、字数等内容维度。
- 内置 `medium-zoom` 图片缩放、路由进度条、评论区、统计等站点能力。
- 提供了不少有趣的演示组件，比如彩带、圣诞树、鼠标特效、SVGA、播放器、3D/Spline、小游戏模块等。
- 预留多语言结构、站点地图、纯净链接、构建分包优化，适合作为长期维护的站点底座。

## 技术栈

- `VitePress`
- `Vue 3`
- `TypeScript`
- `Vite`
- `pnpm`
- `Mermaid`
- `Giscus`
- `xgplayer`
- `SVGAPlayer`
- `UnoCSS / three / gsap` 等扩展能力

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动本地开发

```bash
pnpm docs:dev
```

### 3. 打包站点

```bash
pnpm docs:build
```

### 4. 本地预览构建结果

```bash
pnpm docs:preview
```

## 常用脚本

```json
{
  "docs:dev": "vitepress dev docs",
  "docs:build": "vitepress build docs",
  "docs:preview": "vitepress preview docs"
}
```

## 推送前约定

- 每次推送前需同步更新中英文变更记录：
  - `docs/zh/changelog.md`
  - `docs/en/changelog.md`
- 仓库已提供 `.githooks/pre-push` 校验；若本地启用了 `core.hooksPath`，未更新变更记录时会阻止推送。

## 目录结构

```text
vitepress-WPD
├─ docs
│  ├─ .vitepress
│  │  ├─ config.mts              # VitePress 站点配置
│  │  └─ theme                   # 自定义主题、组件、样式
│  ├─ public                     # 静态资源
│  ├─ index.md                   # 首页
│  ├─ preface.md                 # 前言/介绍
│  ├─ update.md                  # 依赖更新说明
│  └─ ...                        # 其他内容页
├─ .github/workflows/deploy.yml  # GitHub Pages 部署 (docs/.vitepress/dist)工作流
├─ vercel.json                   # Vercel 重写配置
├─ package.json
└─ README.md
```

## 已内置的能力

### 内容侧

- Markdown 文档编写
- 任务列表 `markdown-it-task-checkbox`
- Mermaid 图表
- 时间线 `vitepress-markdown-timeline`
- 代码组图标 `vitepress-plugin-group-icons`
- 图片懒加载
- 图片点击放大

### 站点侧

- 自定义导航与布局
- `cleanUrls` 纯净链接
- `sitemap` 站点地图
- `lastUpdated` 最后更新时间
- 评论系统 `giscus`
- 访问统计 `busuanzi`
- Google Analytics

### 表现侧

- 自定义首页动效
- 鼠标点击/跟随效果
- 彩带特效
- SVGA 动画播放
- 视频播放器组件
- 节日/新年/圣诞主题组件
- 3D/Spline 展示组件
- 趣味互动模块与实验性内容

## 适合拿来做什么

- 个人技术博客
- 团队文档站
- 知识库或学习笔记
- 作品展示型主页
- 一个可以长期迭代的 VitePress 主题实验场

如果你希望文档站在保持清晰结构的同时，也具备更丰富的展示能力，这个项目会比较合适。

## 如何定制

### 改站点基础信息

主要修改 `docs/.vitepress/config.mts`：

- 站点标题、描述
- 导航栏和侧边栏
- `base` 路径
- `sitemap` 域名
- `editLink`
- 多语言配置

### 改首页内容

主要修改 `docs/index.md`：

- `hero` 区域
- 首页按钮
- `features` 特色卡片
- 首页插入的自定义组件

### 改主题和组件

主要查看：

- `docs/.vitepress/theme/index.ts`
- `docs/.vitepress/theme/components`
- `docs/.vitepress/theme/style`

这里是这个项目最有“个性”的部分，很多体验和视觉增强都在这里完成。

## 部署说明

仓库里已经带了基础部署配置:

- `GitHub Pages`: 见 `.github/workflows/deploy.yml`
- `Vercel`: 见 `vercel.json`

默认构建产物目录为:

```bash
docs/.vitepress/dist
```

如果你要部署到自己的仓库或域名，记得同步修改：

- `docs/.vitepress/config.mts` 里的 `base`
- `sitemap.hostname`
- `editLink.pattern`
- 评论区仓库信息
- 统计或分析工具的 ID

## 使用建议

- 想把它当模板用，建议先替换站点名称、域名、仓库地址和评论配置。
- 想长期维护，建议把你的自定义组件收敛到 `docs/.vitepress/theme/components` 里统一管理。
- 当前仓库已经包含不少演示性资源和效果，正式使用时可以按你的内容风格做减法。

## 致谢

- [VitePress](https://vitepress.dev/zh/)
- [Vue](https://cn.vuejs.org/)
- [Vite](https://vitejs.cn/)
- [vitepress-plugin-group-icons](https://www.npmjs.com/package/vitepress-plugin-group-icons)
- [vitepress-plugin-mermaid](https://www.npmjs.com/package/vitepress-plugin-mermaid)
- [vitepress-plugin-comment-with-giscus](https://www.npmjs.com/package/vitepress-plugin-comment-with-giscus)

## License

本项目使用 `MIT` License，详见 `LICENSE` 文件。
