# 微前端介绍与使用配置

微前端是一种把大型前端应用拆分成多个可独立开发、独立构建、独立发布的小型前端应用的架构方式。它借鉴了微服务的拆分思想，但落点在浏览器端：一个“基座应用”负责整体布局、路由和公共能力，多个“子应用”负责各自业务模块。

微前端不是某个固定框架，而是一类架构方案。常见实现包括 `iframe`、`single-spa`、`qiankun`、`Webpack Module Federation`、`Web Components` 以及基于路由和构建产物的自研方案。

## 适合什么场景

- 一个前端仓库过大，构建慢、协作冲突多、发布风险高。
- 多个团队维护同一个业务平台，但团队技术栈、发布节奏不同。
- 需要把历史系统逐步迁移到新技术栈，而不是一次性重写。
- 后台管理系统、低代码平台、运营平台等模块边界清晰的中大型项目。
- 希望某些业务模块可以单独灰度、单独回滚、单独部署。

如果项目规模不大，团队人数较少，或者只是普通组件拆分，优先使用模块化、Monorepo、组件库和路由拆分即可，不必过早引入微前端。

## 核心角色

| 角色 | 作用 |
| :--- | :--- |
| 基座应用 | 负责登录态、全局布局、菜单、路由分发、公共请求、权限与子应用加载 |
| 子应用 | 负责某个业务域，可以独立开发、构建、部署 |
| 应用注册表 | 描述每个子应用的名称、入口地址、激活规则和容器 |
| 沙箱机制 | 隔离子应用的全局变量、样式和副作用 |
| 通信机制 | 让基座和子应用交换必要状态，例如用户信息、主题、权限 |
| 发布系统 | 保证每个子应用可独立发布，并能被基座稳定加载 |

## 常见实现方式

| 方案 | 优点 | 风险 |
| :--- | :--- | :--- |
| `iframe` | 隔离最强，实现简单 | 体验割裂，通信复杂，路由和弹窗处理麻烦 |
| `single-spa` | 生命周期模型清晰，框架无关 | 需要自己补齐工程、样式隔离和通信约束 |
| `qiankun` | 对 `single-spa` 做了封装，适合后台平台 | 对构建格式、跨域和运行时隔离有要求 |
| `Module Federation` | 构建层共享模块，适合组件或模块级集成 | 运行时依赖管理复杂，版本治理要求高 |
| `Web Components` | 标准化封装，跨框架能力好 | 生态和工程实践需要团队额外沉淀 |

实际项目中常见两类路线：

- **路由级微前端**：按页面或业务域拆分，例如 `/order`、`/user`、`/finance`。
- **模块级微前端**：按组件或能力拆分，例如一个商品选择器、图表模块、低代码渲染器。

## 基座应用配置

以 `qiankun` 为例，基座应用负责注册子应用并启动微前端运行时。

```bash
pnpm add qiankun
```

```ts
// src/micro-apps.ts
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
  {
    name: 'order-app',
    entry: '//localhost:7101',
    container: '#micro-app-container',
    activeRule: '/order',
    props: {
      source: 'main-app',
    },
  },
  {
    name: 'user-app',
    entry: '//localhost:7102',
    container: '#micro-app-container',
    activeRule: '/user',
  },
])

start({
  prefetch: 'all',
  singular: true,
  sandbox: {
    experimentalStyleIsolation: true,
  },
})
```

在基座页面中准备子应用挂载容器：

```vue
<template>
  <section class="layout">
    <aside>菜单区域</aside>
    <main id="micro-app-container"></main>
  </section>
</template>
```

然后在应用入口中加载注册逻辑：

```ts
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import './micro-apps'

createApp(App).mount('#app')
```

## 子应用生命周期配置

子应用需要暴露 `bootstrap`、`mount`、`unmount` 等生命周期，让基座能够加载和卸载它。

React 子应用示例：

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

let root: ReactDOM.Root | null = null

function render(container?: Element | Document) {
  const rootElement = container
    ? container.querySelector('#root')
    : document.querySelector('#root')

  if (!rootElement) return

  root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {}

export async function mount(props: { container?: Element }) {
  render(props.container)
}

export async function unmount() {
  root?.unmount()
  root = null
}
```

子应用入口 HTML 中保留挂载节点：

```html
<div id="root"></div>
```

## 子应用构建配置

微前端子应用通常需要把构建产物导出为 `UMD` 格式，并允许基座跨域加载。

Webpack 示例：

```js
const packageName = require('./package.json').name

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    chunkLoadingGlobal: `webpackJsonp_${packageName}`,
  },
  devServer: {
    port: 7101,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
}
```

如果子应用使用 Vite，需要额外确认以下内容：

- 开发服务端口固定，方便基座稳定注册。
- 静态资源路径可以被基座正确访问。
- 构建产物支持被外部运行时加载。
- 子应用在独立运行和被基座加载时都能正确挂载。

在团队实践中，可以把这些差异封装成统一脚手架，避免每个子应用重复配置。

## Nginx 部署配置

生产环境中，基座和子应用可以分别部署，也可以通过同一个域名反向代理。

```nginx
server {
  listen 80;
  server_name example.com;

  location / {
    root /var/www/main-app;
    try_files $uri $uri/ /index.html;
  }

  location /micro/order/ {
    alias /var/www/order-app/;
    try_files $uri $uri/ /micro/order/index.html;
    add_header Access-Control-Allow-Origin *;
  }

  location /micro/user/ {
    alias /var/www/user-app/;
    try_files $uri $uri/ /micro/user/index.html;
    add_header Access-Control-Allow-Origin *;
  }
}
```

对应的基座注册可以改成线上入口：

```ts
registerMicroApps([
  {
    name: 'order-app',
    entry: '/micro/order/',
    container: '#micro-app-container',
    activeRule: '/order',
  },
])
```

使用同域名部署可以减少跨域问题，也更容易复用登录态、Cookie 和网关能力。

## Module Federation 配置

如果更关注“运行时共享模块”或“远程组件加载”，可以使用 `Webpack Module Federation`。

远程应用暴露模块：

```js
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'product',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductList',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
}
```

宿主应用加载远程模块：

```js
const { ModuleFederationPlugin } = require('webpack').container

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'main',
      remotes: {
        product: 'product@https://cdn.example.com/product/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
}
```

在业务代码中使用：

```tsx
import { lazy, Suspense } from 'react'

const ProductList = lazy(() => import('product/ProductList'))

export function Page() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ProductList />
    </Suspense>
  )
}
```

`Module Federation` 更像“远程模块共享”，不一定天然等于完整微前端。它适合组件级复用、跨应用共享业务模块，以及需要减少重复打包的场景。

## 应用通信

微前端通信要少而明确。推荐先定义边界，再选择通信方式。

常见方式：

- **路由参数**：适合页面级状态，例如订单 ID、用户 ID。
- **Props 注入**：基座向子应用传递用户信息、主题、权限。
- **事件总线**：适合低频广播，例如主题切换、语言切换。
- **浏览器能力**：使用 `CustomEvent`、`BroadcastChannel`、`localStorage`。
- **后端状态**：复杂业务状态优先放在接口和服务端，不要让前端应用互相强依赖。

示例：

```ts
window.dispatchEvent(
  new CustomEvent('main-app:theme-change', {
    detail: { theme: 'dark' },
  }),
)
```

```ts
window.addEventListener('main-app:theme-change', (event) => {
  const theme = (event as CustomEvent).detail.theme
  document.documentElement.dataset.theme = theme
})
```

不要让子应用直接读取基座内部变量，也不要让子应用之间互相直接调用内部方法。微前端的核心价值是解耦，通信越随意，后期维护成本越高。

## 样式隔离

样式冲突是微前端项目最常见的问题之一。

常见处理方式：

- 使用 `CSS Modules`、`Scoped CSS` 或约定统一前缀。
- 基座只提供布局样式，子应用只管理自己的业务样式。
- 开启框架提供的样式隔离能力，例如 `experimentalStyleIsolation`。
- 避免在子应用中大量修改 `body`、`html`、全局选择器。
- 统一重置样式和设计变量，减少各应用重复覆盖。

例如统一使用业务前缀：

```css
.order-page {}
.order-card {}
.order-filter {}
```

不要在子应用中写过于宽泛的选择器：

```css
div {
  box-sizing: border-box;
}
```

## 依赖治理

微前端可以让团队技术栈相对独立，但不代表依赖可以完全失控。

建议约束：

- 基座统一管理登录、权限、菜单、主题和监控 SDK。
- 子应用可以独立选择业务框架，但关键运行时依赖要有版本策略。
- 公共组件库、工具函数和类型定义沉淀到独立包。
- 依赖升级要有兼容性测试，避免一个子应用升级后影响整体页面。
- 不要为了“共享”把所有能力都放进基座，否则会重新变成前端单体。

## 权限与登录

微前端项目中，权限最好由基座统一处理。

常见流程：

1. 用户进入基座应用。
2. 基座校验登录态，获取用户、角色和菜单。
3. 基座根据菜单生成可访问路由。
4. 用户进入某个子应用路径。
5. 基座加载子应用，并通过 `props` 或接口传递必要上下文。
6. 子应用只做业务级权限判断，不重复实现完整登录流程。

这样可以避免多个子应用各自维护登录逻辑，也能保证退出登录、Token 刷新和权限变更行为一致。

## 本地开发建议

本地开发时，每个应用使用固定端口：

```bash
# 基座
pnpm dev --port 7000

# 订单子应用
pnpm dev --port 7101

# 用户子应用
pnpm dev --port 7102
```

建议在仓库中维护一份应用注册配置：

```ts
export const microApps = [
  {
    name: 'order-app',
    localEntry: '//localhost:7101',
    prodEntry: '/micro/order/',
    activeRule: '/order',
  },
  {
    name: 'user-app',
    localEntry: '//localhost:7102',
    prodEntry: '/micro/user/',
    activeRule: '/user',
  },
]
```

根据环境切换入口：

```ts
const isDevelopment = import.meta.env.DEV

export const apps = microApps.map((app) => ({
  name: app.name,
  entry: isDevelopment ? app.localEntry : app.prodEntry,
  container: '#micro-app-container',
  activeRule: app.activeRule,
}))
```

## 落地检查清单

- 子应用能独立运行，也能被基座加载。
- 子应用刷新页面后路由正常，不出现 404。
- 静态资源路径在本地和生产环境都正确。
- 样式不会污染基座和其他子应用。
- 登录态、权限、主题、语言等公共能力有统一约定。
- 子应用发布失败时，基座有降级提示。
- 每个子应用有独立构建、测试、发布和回滚能力。
- 监控日志能区分基座和具体子应用。

## 常见问题

### 微前端是不是一定要 Monorepo

不一定。微前端关注运行时拆分和独立交付，Monorepo 关注代码仓库和依赖管理。二者可以组合使用，也可以分开使用。

### 微前端能不能混用 Vue 和 React

可以。只要子应用暴露的生命周期、挂载容器、路由规则和构建产物满足基座要求，不同技术栈可以共存。

### 子应用之间能不能互相调用

尽量不要直接互调。应该通过路由、事件、后端接口或明确的公共包完成协作。直接调用会制造隐式依赖，破坏独立发布能力。

### 是不是所有后台系统都适合微前端

不是。微前端会带来架构、工程、发布和排障复杂度。只有当团队协作、历史迁移、独立发布等收益大于复杂度时，才值得引入。

## 一句话总结

微前端的目标不是把一个项目拆得更碎，而是在大型前端系统中建立清晰边界，让不同业务模块能够独立演进、独立发布，并在用户侧保持统一体验。
