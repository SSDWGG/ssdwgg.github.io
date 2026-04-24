# React 介绍与使用

React 是一个用于构建用户界面的 JavaScript 库，核心思想是组件化、声明式 UI 和状态驱动视图。它不像传统模板引擎那样直接操作页面，而是通过组件函数描述“当前状态下 UI 应该长什么样”。

React 本身主要负责视图层。路由、状态管理、请求、构建、SSR 等能力通常由生态工具补充，例如 React Router、Redux、Zustand、Next.js、Vite 等。

## React 适合什么场景

- 中大型前端应用。
- 复杂交互和复杂状态管理场景。
- 需要跨 Web、移动端、小程序等多端思想复用的团队。
- 需要 SSR、SSG、全栈框架能力的项目。
- 组件库、低代码平台、可视化编辑器等高度组件化项目。

## 创建项目

使用 Vite 创建 React 项目：

```bash
pnpm create vite my-react-app --template react
cd my-react-app
pnpm install
pnpm dev
```

TypeScript 模板：

```bash
pnpm create vite my-react-app --template react-ts
```

## JSX 基础

React 使用 JSX 描述 UI：

```jsx
function App() {
  const name = 'React'

  return (
    <main>
      <h1>Hello {name}</h1>
    </main>
  )
}

export default App
```

JSX 看起来像 HTML，但本质上是 JavaScript 语法扩展。它最终会被编译成函数调用。

## 组件

React 组件通常是函数：

```jsx
function UserCard(props) {
  return (
    <section>
      <h2>{props.name}</h2>
      <p>{props.role}</p>
    </section>
  )
}
```

使用组件：

```jsx
<UserCard name="Ada" role="Engineer" />
```

组件的输入是 `props`，输出是 UI 描述。

## 状态：useState

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      当前数量：{count}
    </button>
  )
}
```

状态变化后，React 会重新执行组件函数，得到新的 UI 描述，再更新页面。

如果新状态依赖旧状态，推荐使用函数式更新：

```jsx
setCount((prev) => prev + 1)
```

## 副作用：useEffect

`useEffect` 用来处理渲染之外的副作用，例如请求接口、订阅事件、操作浏览器 API。

```jsx
import { useEffect, useState } from 'react'

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <p>窗口宽度：{width}</p>
}
```

依赖数组含义：

| 写法 | 含义 |
| :--- | :--- |
| 不传依赖数组 | 每次渲染后执行 |
| `[]` | 组件挂载后执行一次，卸载时清理 |
| `[value]` | `value` 改变后执行 |

## 列表渲染

```jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

`key` 用来帮助 React 识别列表项身份。不要优先使用数组下标作为 key，尤其是列表会排序、删除、插入时。

## 条件渲染

```jsx
function LoginStatus({ user }) {
  if (!user) {
    return <button>登录</button>
  }

  return <p>你好，{user.name}</p>
}
```

也可以使用三元表达式：

```jsx
{isLoading ? <Loading /> : <Content />}
```

## 表单

```jsx
import { useState } from 'react'

function LoginForm() {
  const [username, setUsername] = useState('')

  function submit(event) {
    event.preventDefault()
    console.log(username)
  }

  return (
    <form onSubmit={submit}>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button type="submit">提交</button>
    </form>
  )
}
```

由 React 状态控制表单值的写法叫“受控组件”。

## 自定义 Hook

当逻辑需要复用时，可以封装自定义 Hook：

```jsx
import { useEffect, useState } from 'react'

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return width
}
```

使用：

```jsx
function App() {
  const width = useWindowWidth()

  return <p>{width}</p>
}
```

Hook 的命名必须以 `use` 开头，并且只能在组件或其他 Hook 顶层调用。

## 常见生态

| 能力 | 常见选择 |
| :--- | :--- |
| 构建工具 | Vite |
| 路由 | React Router |
| 全栈框架 | Next.js |
| 状态管理 | Redux Toolkit、Zustand、Jotai |
| 请求缓存 | TanStack Query、SWR |
| UI 组件库 | Ant Design、MUI、Chakra UI |
| 表单 | React Hook Form |

## 原理层理解

### 1. JSX 会编译成元素对象

JSX 并不是浏览器原生语法。它会被编译成函数调用，生成 React 元素对象。

```jsx
<h1 className="title">Hello</h1>
```

可以理解为：

```js
React.createElement('h1', { className: 'title' }, 'Hello')
```

React 元素是轻量对象，用来描述 UI，而不是真实 DOM。

### 2. 状态变化会重新执行组件函数

React 的思路是：组件函数根据当前 `props` 和 `state` 返回 UI。

当 `setState` 被调用后：

1. React 记录状态更新。
2. 重新执行相关组件函数。
3. 生成新的元素树。
4. 与旧树对比。
5. 把必要变化提交到真实 DOM。

所以组件函数要保持纯粹：同样输入应该得到同样输出，不要在渲染过程中直接执行副作用。

### 3. Reconciliation 协调过程

React 会比较新旧元素树，判断哪些节点需要复用、更新、移动或卸载。这个过程通常称为协调。

基本规则：

- 不同类型的元素会被认为是不同节点。
- 相同类型的组件会尝试复用实例和状态。
- 列表中的 `key` 决定子节点身份。

这就是为什么列表 key 很重要。错误的 key 可能导致输入框内容错位、动画异常或组件状态复用错误。

### 4. Fiber 架构

Fiber 是 React 内部的数据结构和调度架构。可以把它理解为“可中断、可恢复的组件工作单元链表”。

传统递归渲染一旦开始就不容易暂停。Fiber 把渲染工作拆成很多小单元，使 React 可以：

- 给不同更新设置优先级。
- 在浏览器空闲时继续工作。
- 中断低优先级渲染。
- 优先响应用户输入。
- 支持并发渲染能力。

Fiber 并不是业务代码需要直接操作的 API，但理解它有助于理解为什么 React 更新并不总是同步完成。

### 5. Render 阶段与 Commit 阶段

React 更新大致分为两个阶段：

| 阶段 | 作用 | 特点 |
| :--- | :--- | :--- |
| Render | 计算新 UI、执行 Diff、生成变更计划 | 可以被中断 |
| Commit | 把变更真正提交到 DOM，执行布局和副作用 | 不可中断 |

`useEffect` 通常在浏览器绘制后执行；如果需要在 DOM 更新后、浏览器绘制前同步读取布局，可以使用 `useLayoutEffect`。

### 6. Hook 为什么不能写在条件里

React 通过 Hook 调用顺序来关联状态。如果把 Hook 写在条件语句里，不同渲染之间调用顺序可能变化，React 就无法正确知道哪个状态对应哪个 Hook。

错误示例：

```jsx
if (visible) {
  const [count, setCount] = useState(0)
}
```

正确做法是让 Hook 始终在组件顶层调用：

```jsx
const [count, setCount] = useState(0)

if (!visible) {
  return null
}
```

## 性能优化

常见优化方式：

- 使用 `React.memo` 避免 props 没变时重复渲染子组件。
- 使用 `useMemo` 缓存昂贵计算。
- 使用 `useCallback` 缓存函数引用。
- 列表很长时使用虚拟滚动。
- 避免把频繁变化的大对象直接传给很多子组件。
- 合理拆分状态，让变化影响范围更小。

示例：

```jsx
import { memo } from 'react'

const UserCard = memo(function UserCard({ user }) {
  return <p>{user.name}</p>
})
```

优化前要先确认瓶颈，不要为了“看起来高级”滥用缓存 API。

## 常见坑

- 直接修改状态对象，而不是创建新对象。
- 忘记给列表添加稳定 `key`。
- `useEffect` 依赖数组缺失，导致闭包拿到旧值。
- 在组件渲染过程中执行请求、订阅、DOM 操作等副作用。
- 滥用全局状态，让简单局部状态变复杂。
- 过度使用 `useMemo`、`useCallback`，增加代码复杂度。

状态对象更新示例：

```jsx
setUser((prev) => ({
  ...prev,
  name: 'new name',
}))
```

## React 与 Vue 的差异

| 维度 | React | Vue |
| :--- | :--- | :--- |
| UI 描述 | JSX 为主 | 模板为主，也支持 JSX |
| 响应方式 | 状态更新触发组件重新执行 | 响应式依赖追踪触发精确更新 |
| 逻辑复用 | Hook | Composable |
| 框架定位 | UI 库 + 生态组合 | 渐进式框架 |
| 编译优化 | 相对少依赖模板编译信息 | 编译器可分析模板动态点 |

两者没有绝对优劣，更多取决于团队经验、项目复杂度、生态需求和维护习惯。

## 一句话总结

React 的核心是“状态驱动 UI”：用组件函数描述界面，用 Hook 管理状态和副作用，再通过 Fiber、协调和提交阶段把变化高效更新到页面。
