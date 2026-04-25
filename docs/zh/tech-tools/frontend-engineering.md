# 前端工程化的理解与实践

前端工程化是用一套稳定的工具、规范和流程，把前端开发从“能写页面”提升到“可维护、可协作、可测试、可发布、可回滚”的系统能力。

它不是简单堆工具，也不是只配置 `Webpack`、`Vite` 或 `ESLint`。真正的前端工程化关注的是：如何让多人长期维护同一个项目时，代码质量、交付速度和线上稳定性都可控。

## 为什么需要前端工程化

早期前端页面规模较小，开发方式可能只是手写 HTML、CSS、JavaScript，然后上传到服务器。随着项目复杂度增加，前端开始承担路由、状态管理、权限、构建、性能优化、自动化测试和持续部署等工作。

如果缺少工程化，常见问题包括：

- 项目依赖混乱，本地能跑，别人电脑跑不起来。
- 代码风格不统一，评审成本高。
- 构建、测试、发布依赖人工操作，容易漏步骤。
- 环境变量、接口地址和密钥管理混乱。
- 缺少质量门禁，低级错误直接进入生产环境。
- 线上问题没有日志、监控和回滚方案。

前端工程化的价值，就是把这些不确定性沉淀成标准流程。

## 核心目标

| 目标 | 含义 |
| :--- | :--- |
| 标准化 | 统一项目结构、代码风格、依赖版本和提交规范 |
| 自动化 | 自动完成构建、检查、测试、部署等重复工作 |
| 可维护 | 通过模块边界、类型约束和文档降低长期维护成本 |
| 可协作 | 让多人并行开发时减少冲突和沟通成本 |
| 可观测 | 线上出现问题时能定位、告警和追踪 |
| 可回滚 | 发布失败或质量异常时能快速恢复 |

## 工程化包含哪些内容

前端工程化通常覆盖以下层面：

- **项目初始化**：脚手架、目录规范、模板、基础依赖。
- **包管理**：统一使用 `pnpm`、`npm` 或 `yarn`，锁定依赖版本。
- **语言体系**：使用 `TypeScript`、类型声明和接口约束。
- **代码规范**：使用 `ESLint`、`Prettier`、提交规范和 Code Review。
- **构建系统**：使用 `Vite`、`Webpack`、`Rollup` 等工具处理构建产物。
- **环境配置**：区分开发、测试、预发、生产环境。
- **测试体系**：单元测试、组件测试、端到端测试和回归测试。
- **CI/CD**：自动检查、自动构建、自动部署。
- **性能优化**：拆包、缓存、懒加载、资源压缩和监控。
- **安全治理**：依赖扫描、密钥管理、权限隔离和 XSS 防护。
- **文档沉淀**：记录架构、规范、脚本、发布流程和排障手册。

## 推荐项目结构

以一个中后台项目为例：

```text
src/
  api/              # 请求封装和接口定义
  assets/           # 图片、字体、静态资源
  components/       # 通用组件
  config/           # 应用级配置
  constants/        # 常量
  hooks/            # React Hooks 或通用组合逻辑
  layouts/          # 页面布局
  pages/            # 路由页面
  router/           # 路由配置
  stores/           # 状态管理
  styles/           # 全局样式和设计变量
  types/            # 全局类型声明
  utils/            # 工具函数
  main.ts           # 应用入口
```

结构不是越复杂越好。小项目可以保持简单，但要保证职责清楚，避免所有代码都堆在 `components` 或 `utils` 中。

## 包管理

团队需要统一包管理器，并提交锁文件。以 `pnpm` 为例：

```bash
pnpm install
pnpm dev
pnpm build
```

建议在 `package.json` 中声明包管理器版本：

```json
{
  "packageManager": "pnpm@10.0.0"
}
```

常用脚本示例：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run"
  }
}
```

脚本名称要稳定，让新人进入项目后可以通过少量命令完成开发、检查和构建。

## TypeScript 约束

`TypeScript` 能把一部分错误提前到开发阶段发现。工程化项目中，类型不只是“提示”，更是团队协作契约。

接口类型示例：

```ts
export interface UserProfile {
  id: string
  name: string
  avatar?: string
  roles: string[]
}
```

请求函数示例：

```ts
export async function getUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/user/profile')

  if (!response.ok) {
    throw new Error('获取用户信息失败')
  }

  return response.json()
}
```

建议：

- 新项目默认使用 `TypeScript`。
- 公共接口、公共组件、状态数据要有明确类型。
- 不要大量使用 `any` 绕过类型检查。
- 类型定义和业务代码一起维护，避免接口变化后类型失真。

## 代码规范

代码规范的目标不是限制个人风格，而是降低协作成本。

常见配置：

```bash
pnpm add -D eslint prettier typescript
```

提交前检查可以放在 Git Hooks 或 CI 中：

```bash
pnpm lint
pnpm test
pnpm build
```

更重要的是团队约定：

- 命名要表达业务含义，不使用随意缩写。
- 组件只做自己职责内的事情。
- 工具函数保持纯粹，不隐藏副作用。
- 复杂逻辑优先拆分并补充测试。
- Code Review 关注边界、可读性、异常处理和可维护性。

## 环境配置

前端项目通常需要区分多个环境：

```text
.env.development
.env.test
.env.production
```

Vite 环境变量示例：

```text
VITE_APP_ENV=development
VITE_API_BASE_URL=https://dev-api.example.com
```

读取配置：

```ts
export const appConfig = {
  env: import.meta.env.VITE_APP_ENV,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
}
```

注意：

- 不要把真实密钥写进前端仓库。
- 前端环境变量会进入浏览器产物，不能存放服务端私密信息。
- 接口地址、上传地址、监控上报地址要通过环境配置管理。
- 本地示例文件可以使用 `.env.example`，真实环境文件不要提交。

## 请求封装

请求层是工程化中非常关键的一层。它负责统一处理基础地址、鉴权、错误、超时和返回结构。

```ts
interface RequestOptions extends RequestInit {
  timeout?: number
}

export async function request<T>(url: string, options: RequestOptions = {}) {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), options.timeout ?? 10000)

  try {
    const response = await fetch(`${appConfig.apiBaseUrl}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`请求失败：${response.status}`)
    }

    return response.json() as Promise<T>
  } finally {
    window.clearTimeout(timeout)
  }
}
```

请求层统一后，业务页面就不需要重复处理底层细节。

## 构建与产物

构建系统负责把源码变成可部署的静态资源。日常说“前端工程化”时，经常会把重点放在 `Vite`、`Webpack`、`Rollup` 这类构建工具上；准确地说，它们是工程化体系中的“构建工具链”部分。

需要关注：

- 入口文件是否清晰。
- 路由页面是否按需加载。
- 第三方依赖是否过大。
- 静态资源是否压缩和缓存。
- Source Map 是否按环境开启。
- 构建产物是否可回溯到提交版本。

## 常用构建工具对比

| 工具 | 更适合的场景 | 特点 |
| :--- | :--- | :--- |
| `Vite` | 现代 Vue、React、Svelte、文档站、中后台项目 | 开发启动快，配置相对简洁，生产构建基于 Rollup 体系 |
| `Webpack` | 历史项目、复杂企业应用、深度定制构建链 | 生态成熟，Loader/Plugin 能力强，配置复杂度较高 |
| `Rollup` | 类库、组件库、SDK、工具包 | 产物干净，Tree Shaking 友好，适合输出 ESM/CJS/UMD |
| `esbuild` | 高速编译、脚本打包、工具链底层能力 | 速度快，配置简单，但 Web 应用生态能力不如 Vite/Webpack 完整 |
| `Rspack` | 希望保留 Webpack 配置习惯但提升构建速度的项目 | Rust 实现，兼容 Webpack 生态中的大量配置和插件 |
| `Parcel` | 小型项目、原型验证、低配置诉求项目 | 开箱即用，配置少，但大型项目可控性相对弱 |

简单选型：

- 新的普通业务项目优先考虑 `Vite`。
- 已经有大量 `Webpack` 配置和 Loader/Plugin 的项目，不必盲目迁移。
- 发布 npm 包、组件库、SDK 时优先考虑 `Rollup`，也可以选择基于 `esbuild` 的 `tsup`。
- 对构建速度要求高，又希望保留 Webpack 心智模型，可以评估 `Rspack`。
- 做小 demo、教学项目、临时验证，可以选择 `Parcel` 或直接使用 `Vite`。

## Vite 使用与配置

`Vite` 的核心优势是开发阶段快：它利用浏览器原生 ES Module 加载源码，按需转换模块；生产构建阶段则走成熟的打包流程。它适合绝大多数现代前端应用。

创建项目：

```bash
pnpm create vite my-vite-app --template vue-ts
cd my-vite-app
pnpm install
pnpm dev
```

React 项目：

```bash
pnpm create vite my-react-app --template react-ts
```

常用脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  }
}
```

Vue 项目常用配置：

```ts
// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    base: env.VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    preview: {
      port: 4173,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      target: 'es2020',
      sourcemap: mode !== 'production',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'pinia'],
          },
        },
      },
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variables.scss" as *;',
        },
      },
    },
  }
})
```

React 项目把插件换成：

```ts
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

环境变量示例：

```text
# .env.development
VITE_PUBLIC_PATH=/
VITE_API_PROXY_TARGET=http://localhost:3000

# .env.production
VITE_PUBLIC_PATH=/admin/
VITE_API_PROXY_TARGET=https://api.example.com
```

业务代码中读取：

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

Vite 常用配置理解：

- `plugins`：接入 Vue、React、legacy、mock、自动导入等插件。
- `base`：控制部署子路径，例如部署到 `/admin/` 时必须配置。
- `resolve.alias`：配置 `@` 指向 `src`，减少复杂相对路径。
- `server.proxy`：本地开发代理接口，避免浏览器跨域问题。
- `build.outDir`：控制打包输出目录。
- `build.sourcemap`：控制是否生成 Source Map。
- `build.rollupOptions`：透传 Rollup 配置，常用于拆包、外部化依赖、定制输出文件名。
- `define`：在构建时注入常量，例如版本号、构建时间。

常见拆包配置：

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('echarts')) return 'echarts'
          if (id.includes('lodash-es')) return 'lodash'
          return 'vendor'
        }
      },
    },
  },
}
```

注意：拆包不是越细越好。过度拆分会增加请求数量，也可能降低缓存命中收益。通常先分析产物，再针对大依赖拆分。

## Webpack 使用与配置

`Webpack` 是非常成熟的模块打包器。它可以处理 JavaScript、TypeScript、CSS、图片、字体等资源，并通过 Loader 和 Plugin 完成复杂构建任务。

安装常见依赖：

```bash
pnpm add -D webpack webpack-cli webpack-dev-server html-webpack-plugin
pnpm add -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript
pnpm add -D css-loader style-loader postcss-loader sass-loader sass mini-css-extract-plugin
```

常用脚本：

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

React + TypeScript 常用配置：

```js
// webpack.config.js
const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: path.resolve(__dirname, 'src/main.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    chunkFilename: isProduction ? 'js/[name].[contenthash:8].chunk.js' : 'js/[name].chunk.js',
    publicPath: '/',
    clean: true,
  },
  devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'assets/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /\.(woff2?|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
    }),
    ...(isProduction
      ? [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].chunk.css',
          }),
        ]
      : []),
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
```

Webpack 常用配置理解：

- `entry`：入口文件，可以是单入口，也可以是多入口。
- `output`：输出目录、文件名、静态资源公共路径。
- `module.rules`：通过 Loader 处理不同类型文件。
- `plugins`：处理 HTML 模板、CSS 提取、环境变量注入、构建分析等。
- `resolve.alias`：路径别名。
- `devServer`：本地服务、热更新、接口代理、History 路由回退。
- `optimization.splitChunks`：公共依赖拆包。
- `devtool`：Source Map 策略。

Webpack 适合复杂定制，但配置维护成本较高。对于新项目，如果没有历史包袱，通常优先考虑 `Vite`；对于老项目，可以逐步优化 Webpack 配置，而不是为了追新重写整个构建系统。

## Rollup 使用与配置

`Rollup` 更适合打包类库，而不是直接作为大型业务应用的开发服务器。它的输出结构更干净，Tree Shaking 效果好，常用于组件库、工具库、SDK。

安装常见依赖：

```bash
pnpm add -D rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs
pnpm add -D @rollup/plugin-typescript @rollup/plugin-terser rollup-plugin-dts typescript
```

常用脚本：

```json
{
  "scripts": {
    "build": "rollup -c"
  }
}
```

类库打包配置：

```js
// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import dts from 'rollup-plugin-dts'

const external = ['react', 'react-dom']

export default [
  {
    input: 'src/index.ts',
    external,
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'MyLibrary',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
      }),
      terser(),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]
```

对应 `package.json`：

```json
{
  "name": "@scope/my-library",
  "version": "1.0.0",
  "main": "dist/index.cjs",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"]
}
```

Rollup 常用配置理解：

- `input`：库入口。
- `output.format`：输出格式，常见有 `es`、`cjs`、`umd`。
- `external`：外部依赖，不打进产物，避免用户项目重复安装多份 React/Vue。
- `globals`：UMD 格式下外部依赖对应的全局变量。
- `plugins`：解析 npm 包、转换 CommonJS、处理 TypeScript、压缩代码、打包类型声明。
- `preserveModules`：保留模块结构，适合需要更细粒度 Tree Shaking 的组件库。

如果是组件库，还可以按模块输出：

```js
output: {
  dir: 'dist/es',
  format: 'es',
  preserveModules: true,
  preserveModulesRoot: 'src',
}
```

## esbuild 使用与配置

`esbuild` 使用 Go 编写，速度非常快，常被用在开发工具底层。它可以直接做脚本打包、库打包、简单 Web 应用构建，也可以作为其他工具的编译器。

安装：

```bash
pnpm add -D esbuild
```

命令行打包：

```bash
pnpm esbuild src/main.ts --bundle --outdir=dist --format=esm --sourcemap --minify
```

使用 JavaScript API：

```js
// scripts/build.mjs
import * as esbuild from 'esbuild'

const isProduction = process.env.NODE_ENV === 'production'

await esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  splitting: true,
  sourcemap: true,
  minify: isProduction,
  target: ['es2020'],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  loader: {
    '.png': 'file',
    '.svg': 'dataurl',
  },
  assetNames: 'assets/[name]-[hash]',
  chunkNames: 'chunks/[name]-[hash]',
})
```

监听模式：

```js
// scripts/dev.mjs
import * as esbuild from 'esbuild'

const context = await esbuild.context({
  entryPoints: ['src/main.ts'],
  bundle: true,
  outdir: 'dist',
  sourcemap: true,
})

await context.watch()

const server = await context.serve({
  servedir: 'dist',
  port: 8000,
})

console.log(`dev server: http://${server.host}:${server.port}`)
```

`esbuild` 的优点是快，缺点是应用级开发体验不如 `Vite` 完整。大型业务项目通常不会直接只用 `esbuild`，而是通过 `Vite`、`tsup`、自研脚本等方式使用它。

## Rspack 使用与配置

`Rspack` 可以理解为 Webpack 思路的高性能实现。它保留了大量 Webpack 配置习惯，但在构建性能上更激进，适合大型项目或 Webpack 项目迁移评估。

安装：

```bash
pnpm add -D @rspack/cli @rspack/core @rspack/dev-server
```

常用脚本：

```json
{
  "scripts": {
    "dev": "rspack serve",
    "build": "rspack build"
  }
}
```

基础配置：

```js
// rspack.config.mjs
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from '@rspack/cli'
import { rspack } from '@rspack/core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  mode: isProduction ? 'production' : 'development',
  entry: {
    main: './src/main.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'builtin:swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
        type: 'javascript/auto',
      },
      {
        test: /\.css$/,
        type: 'css',
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    ],
  },
})
```

迁移建议：

- 先从构建耗时较长的 Webpack 项目中选择一个模块试点。
- 不要默认认为所有 Webpack 插件都可以无成本迁移。
- 优先验证 TypeScript、样式、静态资源、路由、环境变量、微前端等关键链路。
- 构建速度提升之外，也要关注产物体积、Source Map、线上错误定位是否稳定。

## Parcel 使用与配置

`Parcel` 的特点是“少配置”。它可以从 HTML 入口自动追踪依赖，适合小项目、原型项目和教学场景。

安装：

```bash
pnpm add -D parcel
```

`package.json`：

```json
{
  "source": "src/index.html",
  "scripts": {
    "dev": "parcel",
    "build": "parcel build"
  },
  "browserslist": "> 0.5%, last 2 versions, not dead"
}
```

入口文件：

```html
<!-- src/index.html -->
<div id="app"></div>
<script type="module" src="./main.ts"></script>
```

使用：

```bash
pnpm dev
pnpm build
```

Parcel 的优势是简单，缺点是当项目需要非常细的构建控制时，可预测性和可定制性不如 Vite/Webpack/Rollup。

## 构建工具怎么选

| 场景 | 推荐 |
| :--- | :--- |
| 新 Vue/React 业务项目 | `Vite` |
| 老项目已有复杂 Loader/Plugin | 继续优化 `Webpack` 或评估 `Rspack` |
| 组件库、工具库、SDK | `Rollup` 或 `tsup` |
| 只需要快速打包一个脚本 | `esbuild` |
| 大型 Webpack 项目构建慢 | 评估 `Rspack` |
| 原型项目、教学项目 | `Vite` 或 `Parcel` |

不要只看工具热度。选型时更应该看：

- 团队是否熟悉。
- 生态插件是否满足项目需求。
- 和现有框架、组件库、部署方式是否兼容。
- 构建速度和产物体积是否真的改善。
- 出问题时团队能否排查和维护。

路由懒加载示例：

```ts
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/pages/Dashboard.vue'),
  },
]
```

构建时可以注入版本信息：

```ts
export const buildInfo = {
  version: import.meta.env.VITE_APP_VERSION,
  commit: import.meta.env.VITE_GIT_COMMIT,
}
```

线上排查问题时，版本信息非常重要。

## 测试体系

测试不一定一开始就追求覆盖率很高，但关键路径要有保护。

| 类型 | 关注点 |
| :--- | :--- |
| 单元测试 | 工具函数、状态逻辑、复杂计算 |
| 组件测试 | 组件渲染、交互、边界状态 |
| 端到端测试 | 登录、下单、支付、发布等关键流程 |
| 视觉回归 | 设计系统、组件库、营销页面 |

示例：

```ts
import { describe, expect, it } from 'vitest'
import { formatPrice } from './format-price'

describe('formatPrice', () => {
  it('formats number as CNY text', () => {
    expect(formatPrice(12.5)).toBe('¥12.50')
  })
})
```

测试要优先覆盖稳定规则和高风险路径，不要只为了数字写大量脆弱测试。

## CI/CD

CI/CD 把质量检查和发布流程自动化。

GitHub Actions 示例：

```yaml
name: docs

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

基础流程可以分成：

1. 拉取代码。
2. 安装依赖。
3. 静态检查。
4. 运行测试。
5. 构建产物。
6. 部署到目标环境。
7. 记录版本并支持回滚。

## 性能治理

前端性能治理不是上线前临时压缩一下资源，而是贯穿开发、构建和运行时。

常见手段：

- 路由级代码分割，减少首屏资源。
- 组件和图表按需加载。
- 大型依赖做替换或拆包。
- 图片使用合适格式和尺寸。
- 静态资源使用缓存策略。
- 关键接口增加缓存、并发控制和降级。
- 使用监控记录首屏时间、资源错误和接口耗时。

性能优化要先测量，再处理。不要凭感觉优化，也不要为了极小收益引入复杂方案。

## 安全治理

前端安全重点包括：

- 避免直接渲染不可信 HTML，降低 XSS 风险。
- Token、密钥和私密配置不要硬编码在前端代码中。
- 上传、下载、跳转链接需要校验来源和类型。
- 依赖包要定期检查安全风险。
- 权限控制不能只依赖前端隐藏按钮，后端也必须校验。
- 对外部脚本、iframe 和第三方 SDK 保持最小授权。

工程化不是只追求效率，也要把安全作为默认约束。

## 文档与规范

一个项目至少应该说明：

- 如何安装依赖。
- 如何本地启动。
- 如何构建和预览。
- 如何配置环境变量。
- 如何新增页面、接口、组件。
- 如何发布和回滚。
- 常见问题如何排查。

文档不需要一次写得很完美，但要和项目一起持续更新。过期文档会比没有文档更容易误导团队。

## 不同团队的落地路线

小团队可以先做：

- 统一包管理器和 Node 版本。
- 补齐 `dev`、`build`、`lint` 基础脚本。
- 加入 `TypeScript` 和基础代码规范。
- 写清楚 README 和环境变量示例。

中型团队继续补：

- 组件库和业务组件规范。
- Git Hooks、CI 构建和自动部署。
- 单元测试和关键流程端到端测试。
- 错误监控、性能监控和版本追踪。

大型团队需要关注：

- Monorepo 或多仓库治理。
- 统一脚手架和工程模板。
- 微前端、模块联邦或多应用发布体系。
- 依赖升级策略、灰度发布和回滚机制。
- 跨团队规范、架构评审和技术债治理。

## 常见误区

### 工程化不是工具越多越好

工具越多，维护成本越高。先明确问题，再选择工具。

### 工程化不是只由架构师完成

工程化需要每个开发者遵守规范，并在日常开发中持续改进。

### 工程化不是一次性配置

项目规模、团队人数和业务形态都会变化，工程化方案也要迭代。

### 工程化不能脱离业务

如果一套规范严重拖慢交付，又没有带来质量收益，就需要重新评估。

## 一句话总结

前端工程化的本质，是把前端项目的开发、协作、质量、发布和运行维护变成可重复、可验证、可持续改进的体系。
